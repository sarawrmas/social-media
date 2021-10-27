import { useState } from "react";
import { withUrqlClient } from 'next-urql';
import createUrqlClient from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Spinner, Link, Stack, Heading, Flex, Button } from "@chakra-ui/react"
import NextLink from "next/link";
import Wrapper from '../components/Wrapper';
import SinglePost from "../components/SinglePost";

const Index = () => {
  const [variables, setVariables] = useState({ limit: 20, cursor: null as null | string})
  const [{data, fetching}] = usePostsQuery({
    // pagination
    variables
  });

  if (!fetching && !data) {
    return (
      <Wrapper>
        <Flex justifyContent="center">
          <Heading color="tomato" fontSize="2rem">Post retrieval failed</Heading>
        </Flex>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {!data && fetching ? (
        <Flex justifyContent="center">
          <Spinner size="xl" color="blue.500"/>
        </Flex>
      ) : (
        <>
          {/* <Flex>
            <NextLink href="/create-post">
              <Link color="blue" ml="auto">Create New Post</Link>
            </NextLink>
          </Flex> */}
          <Stack spacing={8}>
            {data!.posts.posts.map((p) => (
              <SinglePost post={p} key={p.id} />
            ))}
          </Stack>
          {data?.posts.hasMore ? (
            <Flex>
              <Button m="auto" mt={20} mb={20} p={15}
                background="tomato" color="white"
                type="submit"
                isLoading={fetching}
                onClick={() => setVariables({
                  limit: variables.limit,
                  cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                })}
              >
                Load More
              </Button>
            </Flex>
          ) : (
            <Flex justifyContent="center">
              <Heading fontSize="1rem" mb={20} mt={20}>- Fin -</Heading>
            </Flex>
          )
          }
        </>
      )}
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Index);