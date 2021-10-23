import { Box } from "@chakra-ui/react";
import NavBar from "./NavBar";

interface WrapperProps {
  variant?: "small" | "regular"
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant="regular" }) => {
  return (
    <>
      <NavBar />
      <Box maxW={variant === "regular" ? "800px" : "400px"} w="100%" mt={8} mx="auto">
        {children}
      </Box>
    </>
  )
}

export default Wrapper;