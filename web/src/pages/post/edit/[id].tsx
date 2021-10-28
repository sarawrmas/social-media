import { withUrqlClient } from "next-urql";
import React from "react";
import createUrqlClient from "../../../utils/createUrqlClient";
import Wrapper from "../../../components/Wrapper";
import { useUpdatePostMutation, usePostQuery } from "../../../generated/graphql";
import { Box, Flex, Button, Heading } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../../../components/InputField";
import { getPostFromUrl } from "../../../utils/getPostFromUrl";
import LoadingSpinner from "../../../components/LoadingSpinner";
import WrongPage from "../../../components/WrongPage";
import router from "next/router";

const EditPost: React.FC = () => {
  const [, updatePost] = useUpdatePostMutation();
  const postId = getPostFromUrl();
  const [{data, fetching}] = usePostQuery({
    variables: {
      id: postId
    }
  });

  if (fetching) {
    return <LoadingSpinner />
  }

  if (!data?.post) {
    return <WrongPage />
  }

  return (
    <Wrapper>
      <Heading textAlign="center" fontSize="30px" color="tomato" mb={10}>Edit Post</Heading>
      <Formik initialValues={{postTitle: data.post.postTitle, postBody: data.post.postBody}} onSubmit={async (values) => {
        await updatePost({
          id: data!.post!.id,
          ...values
        });
        router.back();
      }}>
        {({isSubmitting}) => (
          <Form>
            <InputField name="postTitle" placeholder="Post Title" label="Title" />
            <Box mt={4}>
            <InputField textarea name="postBody" placeholder="Start typing..." label="Body" />
            </Box>
            <Flex justifyContent="center">
              <Button mt={4} type="submit" isLoading={isSubmitting} background="tomato" color="white" p={15}>Update Post</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);