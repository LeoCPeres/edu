import { Avatar, Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
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

type TeacherCardProps = {
  teacher: TeachersProps;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  const [userData, setUserData] = useState<UserType>();
  const [scheduleData, setScheduleData] = useState<ScheduleType[]>([
    {} as ScheduleType,
  ]);

  useMemo(() => {
    async function getUserData() {
      const user = (
        await getDoc(doc(db, "users", teacher.user_id))
      ).data() as UserType;

      setUserData(user);
    }

    function generateSchedule() {
      // Função para criar um objeto de programação com as propriedades fornecidas
      function createScheduleObject({
        id,
        week_day,
        from,
        to,
        isDisabled = false,
      }: ScheduleType) {
        return { id, week_day, from, to, isDisabled };
      }

      // Função para criar uma lista de objetos de programação para a semana
      function createWeeklySchedule(scheduleData: ScheduleType[]) {
        const daysOfWeek = [
          "Domingo",
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado",
        ];
        const weeklySchedule = [];

        for (let i = 0; i < 7; i++) {
          const dayName = daysOfWeek[i];
          const scheduleInfo = scheduleData.find(
            (item) => parseInt(item.week_day) === i
          );

          if (scheduleInfo) {
            weeklySchedule.push(
              createScheduleObject({
                id: scheduleInfo.id,
                week_day: dayName,
                from: scheduleInfo.from,
                to: scheduleInfo.to,
              })
            );
          } else {
            weeklySchedule.push(
              createScheduleObject({
                id: "",
                week_day: dayName,
                from: "",
                to: "",
                isDisabled: true,
              })
            );
          }
        }

        return weeklySchedule;
      }

      return createWeeklySchedule(teacher.schedule);
    }

    getUserData();

    const schedule = generateSchedule();

    setScheduleData(schedule);
  }, [teacher]);

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
          <Avatar w="80px" h="80px" src={userData?.avatar} />

          <Box>
            <Text
              color={colors?.texts.title}
              fontFamily="Archivo"
              fontWeight="bold"
              fontSize="24px"
            >
              {userData?.name}
            </Text>
            <Text color={colors?.texts.base} fontSize="16px">
              Química
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
