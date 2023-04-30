import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { useState } from "react";
import { Link } from "react-router-dom";

export function ResetPassword() {
  const [email, setEmail] = useState("");

  return (
    <Flex w="100vw" h="100vh">
      <Flex
        alignItems="center"
        bg="#F0F0F7"
        w="45%"
        h="100%"
        direction="column"
      >
        <Link
          style={{ width: "352px", marginTop: "27px", marginBottom: "-27px" }}
          to="/login"
        >
          <img src="/images/icons/arrow-left.svg" alt="back" />
        </Link>
        <Flex mt="229px" w="352px" direction="column">
          <Heading
            fontFamily="Poppins"
            fontWeight="semibold"
            fontSize="35px"
            mb="16px"
            color="#32264D"
            maxWidth="266px"
          >
            Eita, esqueceu sua senha?
          </Heading>
          <Text
            fontFamily="Poppins"
            color={colors.texts.base}
            fontSize="16px"
            mb="40px"
          >
            Não esquenta, vamos dar um jeito nisso.
          </Text>

          <FormControl>
            <Input
              type="text"
              placeholder="E-mail"
              backgroundColor="#FFF"
              h="72px"
              borderRadius="8px"
              borderColor={colors.gray100}
              border={`1px solid ${colors.gray100}`}
              padding="24px"
              borderTop="0px"
              onChange={(e) => setEmail(e.target.value)}
              fontFamily="Poppins"
              value={email}
            />
          </FormControl>

          <Button
            w="100%"
            p="16px 152px"
            mt="40px"
            h="56px"
            borderRadius="8px"
            bgColor={colors.primary}
            color="#FFF"
            fontFamily="Poppins"
            isDisabled={email.length >= 10 ? false : true}
            colorScheme="none"
          >
            Enviar
          </Button>
        </Flex>
      </Flex>
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
    </Flex>
  );
}
