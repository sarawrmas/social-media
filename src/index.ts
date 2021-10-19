// required dependency with typegraph-ql
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  // run migrations before it does anything else
  await orm.getMigrator().up();

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false
    }),
    // function that returns an orm object for the context
    context: () => ({ em: orm.em })
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

main();