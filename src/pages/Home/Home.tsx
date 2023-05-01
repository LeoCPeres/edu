import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { colors } from "../../styles/colors";

export function Home() {
  return (
    <Flex w="100%" direction="column">
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        paddingY="24px"
        paddingX="200px"
        bgColor={colors.primary}
      >
        <h1>Home</h1>
      </Flex>
    </Flex>
  );
}
