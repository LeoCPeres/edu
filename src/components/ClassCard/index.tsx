import { Avatar, Box, Flex, Link, Text } from "@chakra-ui/react";
import { ConnectionsType } from "../../types/connections.interface";
import { colors } from "../../styles/colors";
import { ScheduleDays } from "../../utils/scheduleDays";
import { useEffect, useState } from "react";
import { UserType } from "../../types/User.interface";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

type ClassCardProps = {
  connection: ConnectionsType;
};

export function ClassCard({ connection }: ClassCardProps) {
  const [studentData, setStudentData] = useState<UserType>();

  useEffect(() => {
    async function getStudentData() {
      const userData = await getDoc(doc(db, "users", connection.studentId));
      setStudentData(userData.data() as UserType);
    }

    getStudentData();
  }, []);

  return (
    <Flex
      bg="#FFF"
      borderColor={colors?.gray100}
      borderWidth="1px"
      py="16px"
      px="24px"
      borderRadius="8px"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex gap="12px" alignItems="center">
        <Avatar name={studentData?.name} src={studentData?.avatar} />
        <Flex flexDir="column">
          <Text fontSize="16px" fontWeight="semibold">
            {studentData?.name}
          </Text>
          <Link
            color={colors?.green}
            fontSize="14px"
            fontWeight="medium"
            mt="-4px"
            onClick={() => {
              window.open(
                `https://wa.me/${studentData?.phoneNumber}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Entrar em contato
          </Link>
        </Flex>
      </Flex>
      <Flex flexDir="column" alignItems="center">
        <Text>Quando:</Text>
        <Text>
          {new Date(connection.schedule.day ?? "").toLocaleDateString()} -{" "}
          {connection.schedule.from} - {connection.schedule.to}.
        </Text>
      </Flex>
      <Flex flexDir="column">
        <Text>Status:</Text>
        {connection.isCompleted ? (
          <Text color={colors?.green} fontWeight="semibold">
            Concluído
          </Text>
        ) : (
          <Text color={colors?.red} fontWeight="semibold">
            Pendente
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
