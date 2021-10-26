// required dependency with typegraph-ql and typeorm
import "reflect-metadata";
// import { MikroORM } from "@mikro-orm/core";
// import microConfig from './mikro-orm.config';
import { createConnection } from "typeorm";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from "./resolvers/user";
import session from 'express-session';
import connectRedis from 'connect-redis';
import { __prod__, COOKIE_NAME } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import cors from 'cors';
import Redis from "ioredis";
import path from "path";
import { Updoot } from "./entities/Updoot";
require('dotenv').config();

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "lireddit",
    username: "postgres",
    password: "postgres",
    logging: true,
    // create tables automatically without running migration
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot]
  });
  // // clear database
  // await Post.delete({});
  // await User.delete({});

  await conn.runMigrations()

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }))

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        // do not expire session to limit requests to redis
        disableTouch: true,
      }),
      cookie: {
        // ms * s * min * hoursinday * daysinyear * 10 = 10 years
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        // make more secure by disabling on front end
        httpOnly: true,
        // cookie only works in https when in production mode
        secure: __prod__,
        // protect csrf
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: `${process.env.DB_SECRET}`,
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    // function that returns an object for the context
    context: ({ req, res }) =>
    // : MyContext => <MyContext>
    ({ req, res, redis })
  });

  const startServer = async() => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
  }

  startServer();
  
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
};

main().catch((err) => {
  console.error(err);
});