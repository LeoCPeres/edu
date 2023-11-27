import { useEffect, useState } from "react";
import { UserType } from "../../../types/User.interface";
import { ClassRequestsType } from "../../../types/classRequests.interface";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

type RequestsType = {
  request: ClassRequestsType;
  onClick: (requestId: string, studentData: UserType) => void;
};

export function Requests({ request, onClick }: RequestsType) {
  const [studentData, setStudentData] = useState<UserType>();

  useEffect(() => {
    async function fetchStudentData() {
      const docRef = doc(db, "users", request.studentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStudentData(docSnap.data() as UserType);
      } else {
        console.log("No such document!");
      }
    }

    fetchStudentData();
  }, []);

  return (
    <Flex
      _hover={{
        cursor: "pointer",
        backgroundColor: "gray.100",
      }}
      p="6px"
      borderRadius="6px"
      mb="4px"
      onClick={() => {
        if (studentData) onClick(request.id, studentData);
      }}
    >
      <Flex gap="8px" alignItems="center">
        <Avatar src={studentData?.avatar} name={studentData?.name} size="md" />
        <Box>
          <Text noOfLines={1} textOverflow="ellipsis" overflow="hidden">
            {studentData?.name}
          </Text>
          <Text fontSize="14px">deseja ter uma aula com você</Text>
        </Box>
      </Flex>
    </Flex>
  );
}
