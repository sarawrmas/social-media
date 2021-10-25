import { NextPage } from "next";
import Wrapper from "../../components/Wrapper";
import { Formik, Form } from "formik";
import InputField from "../../components/InputField";
import { Button, Box, Link, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useState } from "react";
import { withUrqlClient } from "next-urql";
import createUrqlClient from "../../utils/createUrqlClient";
import NextLink from "next/link";

const ChangePassword: NextPage = () => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  const router = useRouter();
  // const token = JSON.stringify(router.query.token);

  async function handleSubmit(values: any, { setErrors }: any) {
    const response = await changePassword({
      newPassword: values.newPassword,
      token: typeof router.query.token === 'string' ? router.query.token : ""
    })
    if (response.data?.changePassword.errors) {
      const errorMap = toErrorMap(response.data.changePassword.errors)
      if ('token' in errorMap) {
        setTokenError(errorMap.token)
      }
      setErrors(errorMap);
    } else if (response.data?.changePassword.user) {
      router.push("/");
    }
  }

  
  return (
    <>
      <Wrapper variant="small">
      <Heading textAlign="center" fontSize="30px" color="pink" mb={10}>Change Password</Heading>
        <Formik initialValues={{ newPassword: '' }} onSubmit={handleSubmit}>
          {({isSubmitting}) => (
            <Form>
              <InputField name="newPassword" placeholder="New Password" label="New Password" type="password" />
              {tokenError ?
              <Box>
                <Flex>
                <Box mr={4} color="red">{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link color="blue" ml="auto">Try again</Link>
                </NextLink><br />
                </Flex>
              </Box>
              : null}
              <Flex justifyContent="center">
                <Button mt={4} type="submit" isLoading={isSubmitting} background="purple" color="white" p={15}>Reset Password</Button>
              </Flex>
              <Flex>
                <NextLink href="/login">
                  <Link m="auto" color="blue">Back to Login</Link>
                </NextLink>
              </Flex>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: false})(ChangePassword);

