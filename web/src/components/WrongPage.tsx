import React from "react";
import Wrapper from "./Wrapper";
import { Flex, Heading } from "@chakra-ui/react";

const WrongPage = () => {
  return (
    <Wrapper>
      <Flex justifyContent="center">
        <Heading color="tomato" fontSize="2rem">Wrong Page!</Heading>
      </Flex>
    </Wrapper>
  )
};

export default WrongPage;