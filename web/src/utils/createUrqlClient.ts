import { dedupExchange, fetchExchange } from 'urql'
import { cacheExchange } from "@urql/exchange-graphcache";
import { MeDocument, LoginMutation, MeQuery, RegisterMutation, LogoutMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
// import { pipe, tap } from 'wonka';
// import { Exchange } from 'urql';
// import Router from "next/router";

// const errorExchange: Exchange = ({ forward }) => ops$ => {
//   return pipe(
//     forward(ops$),
//     tap(({ error }) => {
//       if (error?.message.includes("Not authenticated")) {
//         Router.replace("/login")
//       }
//     })
//   )
// }

const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const
    },
    exchanges: [dedupExchange, cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
              if (result.login.errors) {
                return query
              } else {
                return {
                  me: result.login.user
                }
              }
            })
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
              if (result.register.errors) {
                return query
              } else {
                return {
                  me: result.register.user
                }
              }
            })
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(cache, {query: MeDocument}, _result, () => ({ me: null }))
          }
        }
      }
    }), 
    // errorExchange, 
    ssrExchange, 
    fetchExchange]
})

export default createUrqlClient;