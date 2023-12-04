import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { FiBookOpen, FiTv } from "react-icons/fi";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { ConnectionsType } from "../../types/connections.interface";

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalConnections, setTotalConnections] = useState(0);
  const [connections, setConnections] = useState<Array<ConnectionsType>>([]);

  useEffect(() => {
    async function getTotalConnections() {
      await getDocs(collection(db, "connections")).then((res) => {
        if (!res.empty) {
          setTotalConnections(res.docs.length);

          const con = res.docs.map((doc) => doc.data() as ConnectionsType);
          setConnections(con);
        }
      });
    }

    getTotalConnections();
  }, []);

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
            fontSize={["40px", "40px", "80px", "120px"]}
            lineHeight="70px"
          >
            Edu
          </Text>

          <Text
            color="#FFF"
            fontSize={["24px", "24px", "24px", "24px", "24px", "40px"]}
            lineHeight={["24px", "24px", "24px", "24px", "24px", "40px"]}
          >
            Sua plaforma de <br /> estudos online.
          </Text>
        </Flex>

        <Image
          src="/images/Ilustra.svg"
          maxW={["370px", "370px", "370px", "370px", "370px", "599px"]}
        />
      </Flex>

      <Flex
        paddingX={["160px", "160px", "160px", "160px", "150px", "250px"]}
        justify="space-between"
        align="center"
        mt="56px"
      >
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
            Total de {totalConnections} conexões <br /> já realizadas ❤️
          </Text>

          <Flex gap="16px">
            {connections.find((x) => x.studentId === user?.id) ? (
              <Button
                bg={colors.primary}
                color="#FFF"
                w={["230px", "230px", "230px", "230px", "230px", "301px"]}
                h={["80px", "80px", "80px", "80px", "80px", "104px"]}
                borderRadius="8px"
                fontSize="24px"
                fontFamily="Archivo"
                gap="24px"
                colorScheme="none"
                onClick={() => navigate("/profile/classes")}
              >
                <FiBookOpen color="#FFF" />
                Estudar
              </Button>
            ) : (
              <Button
                bg={colors.primary}
                color="#FFF"
                w={["230px", "230px", "230px", "230px", "230px", "301px"]}
                h={["80px", "80px", "80px", "80px", "80px", "104px"]}
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
            )}

            {user?.teacherId ? (
              <Button
                bg={colors.green}
                color="#FFF"
                w={["230px", "230px", "230px", "230px", "230px", "301px"]}
                h={["80px", "80px", "80px", "80px", "80px", "104px"]}
                borderRadius="8px"
                fontSize="24px"
                fontFamily="Archivo"
                gap="24px"
                colorScheme="none"
                onClick={() => navigate("/teacher/classes")}
              >
                <FiTv color="#FFF" />
                Dar aulas
              </Button>
            ) : (
              <Button
                bg={colors.green}
                color="#FFF"
                w={["230px", "230px", "230px", "230px", "230px", "301px"]}
                h={["80px", "80px", "80px", "80px", "80px", "104px"]}
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
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
