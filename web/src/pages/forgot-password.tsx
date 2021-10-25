import { Link, Button, Flex, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import NextLink from "next/link";
import { useForgotPasswordMutation } from "../generated/graphql"

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [_, forgotPassword] = useForgotPasswordMutation();
  async function handleSubmit(values: any) {
    await forgotPassword(values);
    setComplete(true);
  }
  return (
    <Wrapper variant="small">
    <Formik initialValues={{email: ''}} onSubmit={handleSubmit}>
      {({isSubmitting}) =>
      complete ? (
      <Box>
        <Flex>
          <Box m="auto">Check your email for a password reset link!</Box>
        </Flex>
        <Flex>
          <NextLink href="/login">
            <Link m="auto" color="blue">Back to Login</Link>
          </NextLink>
        </Flex>
      </Box>
      ) : (
        <Form>
          <InputField name="email" placeholder="Email" label="Email" />
          <Flex>
            <NextLink href="/login">
              <Link ml="auto" color="blue">Back to Login</Link>
            </NextLink>
          </Flex>
          <Flex justifyContent="center">
            <Button mt={4} type="submit" isLoading={isSubmitting} background="purple" color="white" p={15}>Reset</Button>
          </Flex>
        </Form>
      )}
    </Formik>
  </Wrapper>
  )
}

export default ForgotPassword;