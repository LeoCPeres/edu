import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
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
  Textarea,
  Th,
  Thead,
  Toast,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { UserType } from "../../types/User.interface";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
import { generateUUID } from "../../utils/generateGUID";
import { useAuth } from "../../contexts/AuthContext";
import { FiFlag } from "react-icons/fi";
import ExperienceBar from "../../components/ExperienceBar";

type ProfileParams = {
  id: string;
};

export function Profile() {
  const { user } = useAuth();
  const { id } = useParams<ProfileParams>();
  const [userData, setUserData] = useState<UserType>();
  const [teacherData, setTeacherData] = useState<TeachersProps>();
  const [scheduleData, setScheduleData] = useState<ScheduleType[]>([
    {} as ScheduleType,
  ]);

  const [requestClassIsLoading, setRequestClassIsLoading] = useState(false);
  const [requestClassText, setRequestClassText] = useState("");
  const [requestClassFrom, setRequestClassFrom] = useState("");
  const [requestClassDay, setRequestClassDay] = useState("");
  const [requestClassTo, setRequestClassTo] = useState("");

  const isMe = id === user?.id;

  const {
    isOpen: isRequestOpen,
    onOpen: onRequestOpen,
    onClose: onRequestClose,
  } = useDisclosure();

  const toast = useToast();

  async function handleRequestClass() {
    if (!isRequestOpen) {
      return;
    }

    if (
      requestClassText != "" &&
      requestClassFrom != "" &&
      requestClassTo != "" &&
      requestClassDay != ""
    ) {
      setRequestClassIsLoading(true);

      try {
        const requestClassData = {
          from: requestClassFrom,
          to: requestClassTo,
          day: requestClassDay,
          text: requestClassText,
          teacherId: teacherData?.user_id,
          studentId: user?.id,
          createDate: new Date(),
        };

        await setDoc(
          doc(db, "classRequests", generateUUID()),
          requestClassData
        );
        setRequestClassIsLoading(false);
        onRequestClose();
        toast({
          title: "Horário solicitado com sucesso!",
          description: "Aguarde a confirmação do professor.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        console.log(error);
        setRequestClassIsLoading(false);
      }
    }
  }

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
        setRequestClassText(
          `Olá, ${teacher?.userData?.name}. Gostaria de solicitar um horário para uma de suas aulas.`
        );
      }

      setUserData(user);
    }

    getUserData();
  }, []);

  return (
    <Flex direction="column" paddingX="250px" w="100%">
      <Toast />

      {isMe && teacherData && <ExperienceBar currentXP={teacherData.xp ?? 0} />}

      <Flex mt="64px" gap="32px">
        <Flex direction="column" w="35%">
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
          {isMe && <Button mt="8px">Editar perfil</Button>}

          {!isMe && (
            <Button mt="8px" bg="#E33D3D" color="white" gap="8px">
              Reportar professor
              <FiFlag />
            </Button>
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
        onSave={handleRequestClass}
        isLoadingSave={requestClassIsLoading}
      >
        <Textarea
          onChange={(e) => setRequestClassText(e.target.value)}
          value={requestClassText}
        />

        <Flex justify="space-between" gap="8px">
          <Box minW="45%">
            <FormControl mt="16px">
              <FormLabel>Dia da semana</FormLabel>
              <Select
                placeholder="Selecione o dia"
                onChange={(e) => setRequestClassDay(e.target.value)}
              >
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
                <option value="6">Sábado</option>
                <option value="7">Domingo</option>
              </Select>
            </FormControl>
          </Box>
          <Flex gap="8px">
            <FormControl mt="16px">
              <FormLabel>Das</FormLabel>
              <Input
                type="time"
                onChange={(e) => setRequestClassFrom(e.target.value)}
              />
            </FormControl>
            <FormControl mt="16px">
              <FormLabel>Até</FormLabel>
              <Input
                type="time"
                onChange={(e) => setRequestClassTo(e.target.value)}
              />
            </FormControl>
          </Flex>
        </Flex>
      </Modal>
    </Flex>
  );
}
