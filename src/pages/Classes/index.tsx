import { Flex, Text, Heading, Spinner } from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { ConnectionsType } from "../../types/connections.interface";
import { ClassCard } from "../../components/ClassCard";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export function Classes() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Array<ConnectionsType>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getConnectionsList() {
      setIsLoading(true);
      if (user) {
        if (user?.teacherId) {
          const ref = collection(db, "connections");
          const q = query(ref, where("teacherId", "==", user.id));

          const querySnapshot = await getDocs(q);

          const connectionsList = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            } as ConnectionsType;
          });
          setIsLoading(false);
          setConnections(connectionsList);
        } else {
          const ref = collection(db, "connections");
          const q = query(ref, where("studentId", "==", user.id));

          const querySnapshot = await getDocs(q);

          const connectionsList = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            } as ConnectionsType;
          });
          setIsLoading(false);
          setConnections(connectionsList);
        }
      }
    }

    getConnectionsList().finally(() => {
      setIsLoading(false);
    });
  }, [user]);

  async function handleCompleteClass(connectionId: string) {
    const newClasses = connections.map((connection) =>
      connection.id === connectionId
        ? {
            ...connection,
            isCompleted: true,
          }
        : connection
    );

    setConnections(newClasses);
  }

  return (
    <Flex direction="column">
      <Flex
        bg={colors.primary}
        w="100%"
        paddingX="450px"
        paddingTop="64px"
        paddingBottom="64px"
        alignItems="flex-end"
        justifyContent="space-between"
        mt="64px"
      >
        <Flex align="center" justifyContent="space-between" w="100%">
          <Flex direction="column" gap="24px">
            <Heading color="#FFF" fontSize="36px">
              Estas são as <br /> suas aulas agendadas.
            </Heading>
            <Text color="#FFF" fontSize="16px">
              Aguarde até que o <br /> professor entre em contato.
            </Text>
          </Flex>
          <Flex align="center" gap="16px">
            <img src="/images/nerd-face.png" alt="nerd-face" width={64} />

            <Text
              color={colors?.texts.zinc100}
              fontFamily="Poppins"
              fontSize="16"
            >
              Total de {connections.length} <br /> aulas desde o início.
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        paddingX="450px"
        direction="column"
        bg={colors?.background}
        minH="100vh"
      >
        <Flex
          mt="32px"
          bg="#FFF"
          borderRadius="8px"
          borderColor={colors?.gray100}
          borderWidth="1px"
          px="24px"
          py="8px"
          alignItems="center"
          gap="8px"
          _hover={{
            color: colors?.primary,
            cursor: "pointer",
          }}
          onClick={() => navigate("/teachers")}
        >
          <Text fontSize="18px">Acesse a lista completa de professores</Text>
          <FiArrowRight fontSize="18px" />
        </Flex>

        <Flex flexDir="column" mt="24px" gap="8px">
          {isLoading && connections?.length == 0 ? (
            <Flex w="100%" alignItems="center" justifyContent="center">
              <Spinner />
            </Flex>
          ) : !isLoading && connections.length == 0 ? (
            <Flex w="100%" alignItems="center" justifyContent="center">
              <Text>Você ainda não tem nenhuma aula agendada.</Text>
            </Flex>
          ) : (
            connections?.map((connection) => (
              <ClassCard
                connection={connection}
                key={connection.id}
                onComplete={handleCompleteClass}
              />
            ))
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
