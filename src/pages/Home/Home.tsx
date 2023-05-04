import { useNavigate } from "react-router-dom";
import { Flex, Image, Text } from "@chakra-ui/react";
import { colors } from "../../styles/colors";

export function Home() {
  return (
    <Flex w="100%" direction="column">
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        paddingY="88px"
        paddingX="250px"
        bgColor={colors.primary}
      >
        <Flex direction="column" gap="16px">
          <Text
            fontFamily="Secular One"
            color="#FFF"
            fontSize="98pt"
            lineHeight="70px"
          >
            Edu
          </Text>

          <Text color="#FFF" fontSize="45pt" lineHeight="70px">
            Sua plaforma de <br /> estudos online.
          </Text>
        </Flex>

        <Image src="/images/Ilustra.svg" />
      </Flex>
    </Flex>
  );
}
