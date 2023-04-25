import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { useState } from "react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Flex w="100vw" h="100vh">
      <Flex
        justifyContent="center"
        alignItems="center"
        bg={colors.primary}
        w="55%"
        h="100%"
        backgroundImage="/images/background-auth.svg"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="65%"
      >
        <Flex direction="column" gap="10px">
          <Heading
            color="#FFF"
            fontFamily="Secular One"
            fontSize="120px"
            margin="0"
            lineHeight="120px"
            marginRight="180px"
          >
            Edu
          </Heading>
          <Heading
            color="#FFF"
            fontFamily="Poppins"
            maxWidth="229px"
            fontWeight="400"
            fontSize="25px"
          >
            Sua plaforma de estudos online.
          </Heading>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        bg="#F0F0F7"
        w="45%"
        h="100%"
        direction="column"
      >
        <Flex mt="229px" w="352px" direction="column">
          <Heading
            fontFamily="Poppins"
            fontWeight="semibold"
            fontSize="35px"
            mb="40px"
            color="#32264D"
          >
            Fazer login
          </Heading>
          <FormControl>
            <Input
              type="email"
              placeholder="E-mail"
              backgroundColor="#FFF"
              borderRadius="8px 8px 0px 0px"
              borderColor={colors.gray100}
              border={`1px solid ${colors.gray100}`}
              padding="24px"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              type="password"
              placeholder="Senha"
              backgroundColor="#FFF"
              borderRadius=" 0px 0px 8px 8px"
              borderColor={colors.gray100}
              border={`1px solid ${colors.gray100}`}
              padding="24px"
              borderTop="0px"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Flex justifyContent="space-between" w="100%" mt="24px">
            <Flex gap="16px">
              <Checkbox />
              <Text
                fontFamily="Poppins"
                fontSize="14px"
                color={colors.texts.complement}
              >
                Lembrar-me
              </Text>
            </Flex>
            <Link
              fontFamily="Poppins"
              fontSize="14px"
              color={colors.texts.complement}
            >
              Esqueci minha senha
            </Link>
          </Flex>
          <Button
            w="100%"
            p="16px 152px"
            mt="56px"
            h="56px"
            borderRadius="8px"
            bgColor={colors.green}
            color="#FFF"
            fontFamily="Poppins"
            isDisabled={
              email.length >= 10 && password.length >= 8 ? false : true
            }
            colorScheme="none"
          >
            Entrar
          </Button>
        </Flex>
        <Flex mt="128px" justifyContent="space-between" w="352px">
          <Text color={colors.texts.base} fontFamily="Poppins" fontSize="16px">
            Não tem conta? <br />{" "}
            <Link
              fontFamily="Poppins"
              color={colors.primary}
              textDecoration="underline"
              fontSize="16px"
              fontWeight="semibold"
            >
              Cadastre-se
            </Link>
          </Text>
          <Text fontFamily="Poppins" color={colors.texts.base} fontSize="16px">
            É de graça ❤️
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
