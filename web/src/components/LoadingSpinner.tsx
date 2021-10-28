import React from "react";
import Wrapper from "./Wrapper";
import { Flex, Spinner } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
  <Wrapper>
    <Flex justifyContent="center">
      <Spinner size="xl" color="blue.500"/>
    </Flex>
  </Wrapper>
  )
};

export default LoadingSpinner;