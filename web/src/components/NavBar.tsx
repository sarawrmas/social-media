import { Box, Link, Flex, Button } from "@chakra-ui/react";
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();
  const [{data, fetching}] = useMeQuery({
    // do not run query if no data
    pause: isServer()
  });
  const handleLogout = () => {
    logout();
    router.push("/")
  }
  // console.log(data?.me)
  let body = null;
  // data is loading
  if (fetching) {
    body = null;
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="login">
          <Link mr={8}>Login</Link>
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
          <Button
            variant="link"
            color="white"
            onClick={handleLogout}
            isLoading={logoutFetching}
          >Logout</Button>
        </Flex>
      </>
    )
  }

  return (
    <>
    <Flex bg="#521B41" p={15} color="white" fontSize="20px" position="sticky" top={0} zIndex={99999}>
      <Box mr={'auto'}>
        <NextLink href="/">
          LiReddit
        </NextLink>
      </Box>
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
    </>
  )
}

export default NavBar;