import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { FiBookOpen, FiTv } from "react-icons/fi";

export function Home() {
  const navigate = useNavigate();

  return (
    <Flex w="100%" direction="column">
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        paddingY="88px"
        paddingX="250px"
        bgColor={colors.primary}
        marginTop="64px"
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

      <Flex paddingX="250px" justify="space-between" align="center" mt="56px">
        <Box>
          <Text fontSize="20px" color={colors.texts.base}>
            Seja bem-vindo
          </Text>
          <Text fontSize="20px" fontWeight="semibold" color={colors.texts.base}>
            O que deseja fazer?
          </Text>
        </Box>

        <Flex alignItems="center" gap="53px">
          <Text textAlign="right">
            Total de 285 conexões <br /> já realizadas ❤️
          </Text>

          <Flex gap="16px">
            <Button
              bg={colors.primary}
              color="#FFF"
              w="301px"
              h="104px"
              borderRadius="8px"
              fontSize="24px"
              fontFamily="Archivo"
              gap="24px"
              colorScheme="none"
              onClick={() => navigate("/teachers")}
            >
              <FiBookOpen color="#FFF" />
              Estudar
            </Button>
            <Button
              bg={colors.green}
              color="#FFF"
              w="301px"
              h="104px"
              borderRadius="8px"
              fontSize="24px"
              fontFamily="Archivo"
              gap="24px"
              colorScheme="none"
              onClick={() => navigate("/teacher/register")}
            >
              <FiTv color="#FFF" />
              Dar aulas
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
