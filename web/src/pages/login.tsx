import React from "react";
import { Formik, Form } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from "../components/InputField";
import { Box, Button, Link, Flex, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import createUrqlClient from "../utils/createUrqlClient";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [_, login] = useLoginMutation();

  async function handleSubmit(values: any, { setErrors }: any) {
    const response = await login(values);
    if (response.data?.login.errors) {
      setErrors(toErrorMap(response.data.login.errors));
    } else if (response.data?.login.user) {
      // redirect user to page they were trying to access before being redirected to login
      if (typeof router.query.next === 'string') {
        router.push(router.query.next);
      } else {
      // if user simply wants to login, take them to the homepage after
        router.push("/")
      }
    }
  }

  return (
    <Wrapper variant="small">
      <Heading textAlign="center" fontSize="30px" color="pink" mb={10}>Log In</Heading>
      <Formik initialValues={{usernameOrEmail: '', password: ''}} onSubmit={handleSubmit}>
        {({isSubmitting}) => (
          <Form>
            <InputField name="usernameOrEmail" placeholder="Username or Email" label="Username or Email" />
            <Box mt={4}>
            <InputField name="password" placeholder="Password" label="Password" type="password" />
            </Box>
            <Flex>
              <NextLink href="/forgot-password">
                <Link color="blue" ml="auto">Forgot Password?</Link>
              </NextLink><br />
            </Flex>
            <Flex justifyContent="center">
              <Button mt={4} type="submit" isLoading={isSubmitting} background="purple" color="white" p={15}>Login</Button>
            </Flex>

          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Login);