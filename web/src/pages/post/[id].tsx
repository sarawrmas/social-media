import { withUrqlClient } from "next-urql";
import React from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import SinglePost from "../../components/SinglePost";
import Wrapper from "../../components/Wrapper";
import WrongPage from "../../components/WrongPage";
import { PostSnippetFragment } from "../../generated/graphql";
import createUrqlClient from "../../utils/createUrqlClient";
import { getPostFromUrl } from "../../utils/getPostFromUrl";
import { usePostQuery } from "../../generated/graphql";

const Post: React.FC = () => {
  const postId = getPostFromUrl();

  const [{data, error, fetching}] = usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId
    }
  });

  if (fetching) {
    return (
    <LoadingSpinner />
    );
  };

  if (error) {
    return <div>{error.message}</div>
  }

  if (!data?.post) {
    return <WrongPage />
  }

  return (
    <Wrapper>
      <SinglePost post={data?.post as PostSnippetFragment} />
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient, {ssr: false})(Post);