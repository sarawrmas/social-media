// required dependency with typegraph-ql
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { __prod__ } from "./constants";
import { MyContext } from "./types";
require('dotenv').config();

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  // run migrations before it does anything else
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  redisClient.on("error", function (err) {
    console.log("Error: " + err);
  })

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
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
        sameSite: "lax"
      },
      saveUninitialized: false,
      secret: `${process.env.DB_SECRET}`,
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false
    }),
    // function that returns an object for the context
    context: ({ req, res }): MyContext => <MyContext>({ em: orm.em, req, res })
  });

  const startServer = async() => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
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