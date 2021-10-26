import React from "react";
import { Button, Box, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { PostInput, useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import Wrapper from "../components/Wrapper";
import { withUrqlClient } from "next-urql";
import createUrqlClient from "../utils/createUrqlClient";
import { userIsAuth } from "../utils/userIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();
  userIsAuth();

  async function handleSubmit(values: PostInput) {
    await createPost({ input: values });
    router.push("/")
  }

  return (
    <Wrapper variant="small">
      <Formik initialValues={{postTitle: "", postBody: ""}} onSubmit={handleSubmit}>
        {({isSubmitting}) => (
          <Form>
            <InputField name="postTitle" placeholder="Post Title" label="Title" />
            <Box mt={4}>
            <InputField name="postBody" placeholder="Start typing..." label="Body" />
            </Box>
            <Flex justifyContent="center">
              <Button mt={4} type="submit" isLoading={isSubmitting} background="purple" color="white" p={15}>Create Post</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost);