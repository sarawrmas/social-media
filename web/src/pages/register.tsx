import React from "react";
import { Formik, Form } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik initialValues={{username: '', password: ''}} onSubmit={(values) => {console.log(values)}}>
        {({isSubmitting}) => (
          <Form>
            <InputField name="username" placeholder="Username" label="Username" />
            <Box mt={4}>
            <InputField name="password" placeholder="Password" label="Password" type="password" />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting} background="purple" color="white">Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register;