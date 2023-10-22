import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { TeachersProps } from "../../types/Teachers.interface";
import { ScheduleList } from "../ScheduleList";
import { UserType } from "../../types/User.interface";
import { ScheduleDays } from "../../utils/scheduleDays";
import { ScheduleType } from "../../types/Schedule.interface";
import { formatPrice } from "../../utils/formatCurrency";
import { getReadableSubject } from "../../utils/getReadableSubject";
import { useNavigate } from "react-router-dom";
import { generateSchedule } from "../../utils/generateSchedule";

type TeacherCardProps = {
  teacher: TeachersProps;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  const [userData, setUserData] = useState<UserType>();
  const [scheduleData, setScheduleData] = useState<ScheduleType[]>([
    {} as ScheduleType,
  ]);

  const navigation = useNavigate();

  useMemo(() => {
    async function getUserData() {
      const user = (
        await getDoc(doc(db, "users", teacher.user_id))
      ).data() as UserType;

      setUserData(user);
    }

    getUserData();

    const schedule = generateSchedule(teacher.schedule);

    setScheduleData(schedule);
  }, [teacher]);

  function handleGoToProfile() {
    navigation(`/profile/${teacher.user_id}`);
  }

  return (
    <>
      <Flex
        direction="column"
        bg="#FFF"
        borderTopRadius="8px"
        borderColor={colors?.gray100}
        borderWidth="1px"
        p="32px"
        mt="24px"
        borderBottomWidth="0"
      >
        <Flex alignItems="center" gap="24px">
          <Avatar
            w="80px"
            h="80px"
            src={userData?.avatar}
            name={userData?.name}
            bg={colors?.primary}
          />

          <Box>
            <Link
              color={colors?.texts.title}
              fontFamily="Archivo"
              fontWeight="bold"
              fontSize="24px"
              onClick={handleGoToProfile}
            >
              {userData?.name}
            </Link>
            <Text color={colors?.texts.base} fontSize="16px">
              {getReadableSubject(teacher.subject)}
            </Text>
          </Box>
        </Flex>
        <Textarea
          readOnly
          border="none"
          resize="none"
          minH="200px"
          p="0"
          mt="32px"
        >
          {teacher.biography}
        </Textarea>

        <ScheduleList schedule={scheduleData} />
      </Flex>
      <Flex
        borderBottomRadius="8px"
        borderColor={colors?.gray100}
        paddingX="31px"
        paddingY="50px"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        borderWidth="1px"
        bg="#FFF"
      >
        <Flex alignItems="center" gap="16px">
          <Text fontSize="14pt" color={colors?.texts.complement}>
            Preço/hora
          </Text>
          <Text
            fontFamily="Archivo"
            fontWeight="bold"
            color={colors?.primary}
            fontSize="20pt"
          >
            {formatPrice(teacher.price)}
          </Text>
        </Flex>

        <Button
          colorScheme="none"
          paddingX="43px"
          paddingY="15px"
          bg={colors?.green}
          color="#FFF"
          fontFamily="Archivo"
          fontWeight="semibold"
          gap="16px"
        >
          <img src="/images/icons/Whatsapp.svg" alt="" /> Entrar em contato
        </Button>
      </Flex>
    </>
  );
}
