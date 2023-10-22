import {
  Avatar,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { UserType } from "../../types/User.interface";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { TeachersProps } from "../../types/Teachers.interface";
import { getTeacherByUserId } from "../../services/teacherServices";
import { BadgeExperience } from "../../components/BadgeExperience";
import { getReadableSubject } from "../../utils/getReadableSubject";
import { generateSchedule } from "../../utils/generateSchedule";
import { ScheduleType } from "../../types/Schedule.interface";
import { ScheduleList } from "../../components/ScheduleList";
import { colors } from "../../styles/colors";

type ProfileParams = {
  id: string;
};

export function Profile() {
  const { id } = useParams<ProfileParams>();
  const [userData, setUserData] = useState<UserType>();
  const [teacherData, setTeacherData] = useState<TeachersProps>();
  const [scheduleData, setScheduleData] = useState<ScheduleType[]>([
    {} as ScheduleType,
  ]);

  useMemo(() => {
    async function getUserData() {
      if (!id) {
        return;
      }

      const user = (await getDoc(doc(db, "users", id))).data() as UserType;
      const teacher = await getTeacherByUserId(id);

      teacher.userData = user;

      const schedule = generateSchedule(teacher.schedule);

      setUserData(user);
      setTeacherData(teacher);
      setScheduleData(schedule);
    }

    getUserData();
  }, []);

  return (
    <Flex direction="column">
      <Flex mt="128px" paddingX="250px">
        <Flex direction="column" maxW="30%">
          <Flex alignItems="center">
            <Avatar src={userData?.avatar} width="72px" h="72px" />

            <Flex direction="column" ml="5" gap="2px">
              <Text fontWeight="semibold">{userData?.name}</Text>
              {teacherData && <BadgeExperience xp={teacherData.xp} />}
            </Flex>
          </Flex>

          {teacherData && (
            <>
              <Text mt="5" fontWeight="semibold">
                Biografia
              </Text>

              <Text mt="2" fontWeight="normal" fontSize="14">
                {teacherData?.biography}
              </Text>

              <Text mt="5" fontWeight="semibold">
                Matéria
              </Text>

              <Text mt="2" fontWeight="normal" fontSize="14">
                {getReadableSubject(teacherData?.subject)}
              </Text>

              <Text mt="5" fontWeight="semibold">
                Preço/hora
              </Text>

              <Text mt="2" fontWeight="semibold" fontSize="26">
                R$ {teacherData?.price}
              </Text>

              <Flex gap="6px" mt="4">
                <Button
                  colorScheme="none"
                  bg={colors?.green}
                  color="#FFF"
                  fontFamily="Archivo"
                  fontWeight="semibold"
                  gap="16px"
                  w="100%"
                >
                  <img src="/images/icons/Whatsapp.svg" alt="" /> Entrar em
                  contato
                </Button>
                <Button
                  w="100%"
                  bg={colors?.primary}
                  color="white"
                  colorScheme="none"
                >
                  Solicitar horário
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
