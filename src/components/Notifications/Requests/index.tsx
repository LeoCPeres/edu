import { useEffect, useState } from "react";
import { UserType } from "../../../types/User.interface";
import { ClassRequestsType } from "../../../types/classRequests.interface";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { colors } from "../../../styles/colors";

type RequestsType = {
  request: ClassRequestsType;
  onClick: (
    requestId: string,
    studentData: UserType,
    teacherData?: UserType
  ) => void;
};

export function Requests({ request, onClick }: RequestsType) {
  const [studentData, setStudentData] = useState<UserType>();
  const [teacherData, setTeacherData] = useState<UserType>();

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

    async function fetchTeacherData() {
      const docRef = doc(db, "users", request.teacherId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTeacherData(docSnap.data() as UserType);
      } else {
        console.log("No such document!");
      }
    }

    if (request.status === "accepted" || request.status === "refused") {
      fetchTeacherData();
    }

    fetchStudentData();
  }, []);

  if (request.status === "pending") {
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
          <Avatar
            src={studentData?.avatar}
            name={studentData?.name}
            size="md"
          />
          <Box>
            <Text
              noOfLines={1}
              textOverflow="ellipsis"
              overflow="hidden"
              fontWeight="semibold"
            >
              {studentData?.name}
            </Text>
            <Text fontSize="14px">deseja ter uma aula com você</Text>
          </Box>
        </Flex>
      </Flex>
    );
  } else if (request.status == "accepted") {
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
          if (studentData) onClick(request.id, studentData, teacherData);
        }}
      >
        <Flex gap="8px" alignItems="center">
          <Avatar
            src={teacherData?.avatar}
            name={teacherData?.name}
            size="md"
          />
          <Box>
            <Text
              noOfLines={1}
              textOverflow="ellipsis"
              overflow="hidden"
              fontWeight="semibold"
            >
              {teacherData?.name}
            </Text>
            <Text fontSize="14px">
              <strong style={{ color: colors.green }}>Aprovou</strong> seu
              horário
            </Text>
          </Box>
        </Flex>
      </Flex>
    );
  } else {
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
          if (studentData) onClick(request.id, studentData, teacherData);
        }}
      >
        <Flex gap="8px" alignItems="center">
          <Avatar
            src={teacherData?.avatar}
            name={teacherData?.name}
            size="md"
          />
          <Box>
            <Text
              noOfLines={1}
              textOverflow="ellipsis"
              overflow="hidden"
              fontWeight="semibold"
            >
              {teacherData?.name}
            </Text>
            <Text fontSize="14px">
              <strong style={{ color: colors.red }}>Recusou</strong> seu horário
            </Text>
          </Box>
        </Flex>
      </Flex>
    );
  }
}
