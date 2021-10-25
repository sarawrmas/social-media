import React from "react";
import { Formik, Form } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from "../components/InputField";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [_, register] = useRegisterMutation();

  const handleSubmit = async (values: any, {setErrors}: any) => {
    const response = await register({ options: values });
    if (response.data?.register.errors) {
      setErrors (toErrorMap(response.data.register.errors));
    } else if (response.data?.register.user) {
      router.push("/")
    }
  }

  return (
    <Wrapper variant="small">
      <Heading textAlign="center" fontSize="30px" color="pink" mb={10}>Register</Heading>
      <Formik initialValues={{email: '', username: '', password: ''}} onSubmit={handleSubmit}>
        {({isSubmitting}) => (
          <Form>
            <InputField name="username" placeholder="Username" label="Username" />
            <Box mt={4}>
            <InputField name="email" placeholder="Email" label="Email" />
            </Box>
            <Box mt={4}>
            <InputField name="password" placeholder="Password" label="Password" type="password" />
            </Box>
            <Flex justifyContent="center">
              <Button mt={4} type="submit" isLoading={isSubmitting} background="purple" color="white" p={15}>Register</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register;