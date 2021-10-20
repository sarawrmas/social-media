import { Box, Link, Flex, Button } from "@chakra-ui/react";
import NextLink from 'next/link';
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{data, fetching}] = useMeQuery();
  let body;
  // data is loading
  if (fetching) {
    body = null;
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="register">
          <Link>Register</Link>
        </NextLink>
      </>
    )
    // user logged in
  } else {
    body = (
      <>
        <Flex>
          <Box mr={6}>{data.me.username}</Box>
          <Button bg="purple" color="white">Logout</Button>
        </Flex>
      </>
    )
  }

  return (
    <>
    <Flex bg="black" p={4} color="white">
      <Box mr={'auto'}>
        Social Media
      </Box>
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
    </>
  )
}

export default NavBar;