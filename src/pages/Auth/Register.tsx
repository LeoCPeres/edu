import {
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function Register() {
  const { registerUserWithEmailAndPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  async function handleRegisterUser() {
    const fullName = name + " " + surname;

    await registerUserWithEmailAndPassword(email, password, fullName)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
            mb="21px"
            color="#32264D"
          >
            Cadastro
          </Heading>
          <Text
            fontFamily="Poppins"
            maxWidth="213px"
            color={colors.texts.base}
            fontSize="16px"
            mb="40px"
          >
            Preencha os dados abaixo para começar.
          </Text>
          <FormControl>
            <Input
              type="text"
              placeholder="Nome"
              backgroundColor="#FFF"
              borderRadius="8px 8px 0px 0px"
              borderColor={colors.gray100}
              border={`1px solid ${colors.gray100}`}
              padding="24px"
              onChange={(e) => setName(e.target.value)}
              fontFamily="Poppins"
            />
          </FormControl>
          <FormControl>
            <Input
              type="email"
              placeholder="Sobrenome"
              backgroundColor="#FFF"
              borderRadius="0px"
              borderColor={colors.gray100}
              border={`1px solid ${colors.gray100}`}
              padding="24px"
              borderTop="0px"
              onChange={(e) => setSurname(e.target.value)}
              fontFamily="Poppins"
            />
          </FormControl>
          <FormControl>
            <Input
              type="text"
              placeholder="E-mail"
              backgroundColor="#FFF"
              borderRadius="0px"
              borderColor={colors.gray100}
              border={`1px solid ${colors.gray100}`}
              padding="24px"
              borderTop="0px"
              onChange={(e) => setEmail(e.target.value)}
              fontFamily="Poppins"
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
              fontFamily="Poppins"
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
            isDisabled={
              email.length >= 10 && password.length >= 8 ? false : true
            }
            colorScheme="none"
            onClick={handleRegisterUser}
          >
            Concluir cadastro
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
