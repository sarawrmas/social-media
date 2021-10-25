// import NavBar from "../components/NavBar";
import { withUrqlClient } from 'next-urql';
import createUrqlClient from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Spinner, Link, Flex } from "@chakra-ui/react"
import NextLink from "next/link";
import NavBar from '../components/NavBar';
// import Wrapper from '../components/Wrapper';

const Index = () => {
  const [{data}] = usePostsQuery();
  return (
    <>
      <NavBar />
      {/* <Flex justifyContent="flex-start"> */}
        <NextLink href="/create-post">
          <Link color="blue">Create New Post</Link>
        </NextLink>
      {/* </Flex> */}

      {!data ? (<Spinner />) : (data.posts.map((p) => <div key={p.id}>{p.postTitle}</div>))}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);