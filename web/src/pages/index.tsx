// import NavBar from "../components/NavBar";
import { withUrqlClient } from 'next-urql';
import createUrqlClient from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Spinner, Link, Stack, Box, Heading, Text, Flex } from "@chakra-ui/react"
import NextLink from "next/link";
// import NavBar from '../components/NavBar';
import Wrapper from '../components/Wrapper';
// import Wrapper from '../components/Wrapper';

const Index = () => {
  const [{data}] = usePostsQuery({
    // pagination
    variables: {
      limit: 10
    }
  });
  return (
    <Wrapper>
      {/* <NavBar /> */}
      <Flex>
        <NextLink href="/create-post">
          <Link color="blue" ml="auto">Create New Post</Link>
        </NextLink>
      </Flex>

      {!data ? (
        <Spinner />
      ) : (
        <Stack spacing={8}>
          {data.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.postTitle}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);