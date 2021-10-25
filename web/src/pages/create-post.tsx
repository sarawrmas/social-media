import React, { useEffect } from "react";
import { Button, Box, Flex, Textarea } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import Wrapper from "../components/Wrapper";
import { withUrqlClient } from "next-urql";
import createUrqlClient from "../utils/createUrqlClient";

const CreatePost: React.FC<{}> = ({}) => {
  const [, createPost] = useCreatePostMutation();
  const [{ data }] = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (data?.me === null) {
      router.push("/login")
    }
  })

  async function handleSubmit(values: any) {
    // const { error } = await createPost({ input: values });
    await createPost({ input: values });
    console.log(values)
    // if (error?.message.includes("Not authenticated")) {
    //   router.push("/login")
    // }
      router.push("/")
  }

  return (
    <Wrapper variant="small">
      <Formik initialValues={{postTitle: '', postBody: ''}} onSubmit={handleSubmit}>
        {({isSubmitting}) => (
          <Form>
            <InputField name="postTitle" placeholder="Post Title" label="Title" />
            <Box mt={4}>
            <Textarea name="postBody" placeholder="Start typing..." label="Body" />
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

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost);