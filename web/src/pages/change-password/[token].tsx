import { NextPage } from "next";
import Wrapper from "../../components/Wrapper";
import { Formik, Form } from "formik";
import InputField from "../../components/InputField";
import { Button, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useState } from "react";
import { withUrqlClient } from "next-urql";
import createUrqlClient from "../../utils/createUrqlClient";

const ChangePassword: NextPage<{ token: string }> = () => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  const router = useRouter();
  const token = JSON.stringify(router.query.token);

  async function handleSubmit(values: any, { setErrors }: any) {
    const response = await changePassword({newPassword: values.newPassword, token})
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
        <Formik initialValues={{ newPassword: '' }} onSubmit={handleSubmit}>
          {({isSubmitting}) => (
            <Form>
              <InputField name="newPassword" placeholder="New Password" label="New Password" type="password" />
              {tokenError ? <Box color="red">{tokenError}</Box> : null}
              <Button mt={4} type="submit" isLoading={isSubmitting} background="purple" color="white">Reset Password</Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: false})(ChangePassword);