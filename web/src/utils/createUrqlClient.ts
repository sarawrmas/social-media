import { dedupExchange, fetchExchange, stringifyVariables } from 'urql'
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import { MeDocument, LoginMutation, MeQuery, RegisterMutation, LogoutMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, "posts");
    info.partial = !isInCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach(field => {
      const key = cache.resolve(entityKey, field.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data)
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results
    };
  };
};

const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const
    },
    exchanges: [dedupExchange, cacheExchange({
      keys: {
        PaginatedPosts: () => null
      },
      resolvers: {
        Query: {
          posts: cursorPagination()
        }
      },
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