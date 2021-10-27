import { Flex, Spinner, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import SinglePost from "../../components/SinglePost";
import Wrapper from "../../components/Wrapper";
import { PostSnippetFragment, usePostQuery } from "../../generated/graphql";
import createUrqlClient from "../../utils/createUrqlClient";

const Post: React.FC = () => {
  const router = useRouter();
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{data, error, fetching}] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId
    }
  });

  if (fetching) {
    return (
    <Flex justifyContent="center">
      <Spinner size="xl" color="blue.500"/>
    </Flex>
    );
  };

  if (error) {
    return <div>{error.message}</div>
  }

  if (!data?.post) {
    return (
      <Wrapper>
        <Flex justifyContent="center">
          <Heading color="tomato" fontSize="2rem">No post found</Heading>
        </Flex>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <SinglePost post={data?.post as PostSnippetFragment} />
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient, {ssr: false})(Post);