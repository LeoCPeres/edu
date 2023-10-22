import {
  Avatar,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
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
import { Modal } from "../../components/Modal";

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

  const {
    isOpen: isRequestOpen,
    onOpen: onRequestOpen,
    onClose: onRequestClose,
  } = useDisclosure();

  useMemo(() => {
    async function getUserData() {
      if (!id) {
        return;
      }

      const user = (await getDoc(doc(db, "users", id))).data() as UserType;
      const teacher = await getTeacherByUserId(id);

      if (teacher != null) {
        teacher.userData = user;

        const schedule = generateSchedule(teacher.schedule);
        setTeacherData(teacher);
        setScheduleData(schedule);
      }

      setUserData(user);
    }

    getUserData();
  }, []);

  return (
    <Flex direction="column">
      <Flex mt="128px" paddingX="250px" w="100%" gap="32px">
        <Flex direction="column" w="25%">
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
                  gap="8px"
                  w="100%"
                >
                  <img src="/images/icons/Whatsapp.svg" alt="" /> Whatsapp
                </Button>
                <Button
                  w="100%"
                  bg={colors?.primary}
                  color="white"
                  colorScheme="none"
                  onClick={onRequestOpen}
                >
                  Solicitar horário
                </Button>
              </Flex>
            </>
          )}
        </Flex>

        {teacherData && (
          <Flex w="100%">
            <Tabs align="start" w="100%">
              <Flex w="100%" alignItems="center" justifyContent="flex-start">
                <TabList>
                  <Tab>Horários</Tab>
                  <Tab>Posts</Tab>
                  <Tab>Conquistas</Tab>
                  <Tab>Avaliações</Tab>
                </TabList>
              </Flex>

              <TabPanels>
                <TabPanel>
                  <ScheduleList schedule={scheduleData} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        )}
      </Flex>

      <Modal
        isOpen={isRequestOpen}
        onClose={onRequestClose}
        size="lg"
        title="Solicitar um horário"
        textClose="Cancelar"
        hasSaveButton
        saveButtonText="Solicitar"
        onSave={() => {
          onRequestClose();
        }}
      >
        <Text>oi</Text>
      </Modal>
    </Flex>
  );
}
