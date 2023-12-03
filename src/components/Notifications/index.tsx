import {
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverFooter,
  Flex,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Avatar,
  Box,
  Text,
  FormControl,
  FormLabel,
  Select,
  Input,
  useToast,
  ModalHeader,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { colors } from "../../styles/colors";
import { useLocation } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { ClassRequestsType } from "../../types/classRequests.interface";
import { Requests } from "./Requests";
import { UserType } from "../../types/User.interface";
import { getTimeDifference } from "../../utils/getTimeDifference";
import { ScheduleDays } from "../../utils/scheduleDays";
import { TeachersProps } from "../../types/Teachers.interface";
import { generateUUID } from "../../utils/generateGUID";

type NotificationsProps = {
  user?: UserType;
};

export function Notifications({ user }: NotificationsProps) {
  let location = useLocation();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isRecuseOpen,
    onOpen: onRecuseOpen,
    onClose: onRecuseClose,
  } = useDisclosure();

  const {
    isOpen: isRefusedOpen,
    onOpen: onRefusedOpen,
    onClose: onRefusedClose,
  } = useDisclosure();

  const {
    isOpen: isAcceptedOpen,
    onOpen: onAcceptedOpen,
    onClose: onAcceptedClose,
  } = useDisclosure();

  const [requests, setRequests] = useState<ClassRequestsType[]>([]);
  const [studentData, setStudentData] = useState<UserType>();
  const [teacherData, setTeacherData] = useState<UserType>();
  const [requestId, setRequestId] = useState<string>();

  const [reason, setReason] = useState<number>();
  const [suggestClassDay, setSuggestClassDay] = useState<string>();
  const [suggestClassFrom, setSuggestClassFrom] = useState<string>();
  const [suggestClassTo, setSuggestClassTo] = useState<string>();

  useEffect(() => {
    async function fetchRequests() {
      if (!user?.teacherId) {
        const q = query(
          collection(db, "classRequests"),
          where("studentId", "==", user?.id)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const requestsData = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            } as ClassRequestsType;
          });

          setRequests(requestsData);
        });

        return () => unsubscribe();
      } else {
        const q = query(
          collection(db, "classRequests"),
          where("teacherId", "==", user?.id)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const requestsData = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            } as ClassRequestsType;
          });

          setRequests(requestsData);
        });

        return () => unsubscribe();
      }
    }

    fetchRequests();
  }, [user]);

  async function handleClickNotificationRequest(
    requestId: string,
    studentData: UserType,
    teacherData?: UserType
  ) {
    setStudentData(studentData);
    setTeacherData(teacherData);
    setRequestId(requestId);

    const requestRef = requests.find((x) => x.id === requestId);

    if (requestRef?.status === "refused") {
      onRefusedOpen();
      return;
    }

    if (requestRef?.status === "accepted") {
      onAcceptedOpen();
      return;
    }

    onOpen();
  }

  async function handleRecuseRequest() {
    if (requestId) {
      if (!reason) {
        toast({
          title: "Selecione um motivo para recusar o horário",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (
        reason == 1 &&
        !suggestClassDay &&
        !suggestClassFrom &&
        !suggestClassTo
      ) {
        toast({
          title: "Selecione um dia e horário para sugerir ao aluno",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      const docRef = doc(db, "classRequests", requestId);

      await updateDoc(docRef, {
        status: "refused",
        recuseReasonData:
          reason == 1
            ? {
                reason,
                suggestClassDay,
                suggestClassFrom,
                suggestClassTo,
              }
            : {
                reason,
              },
      });

      toast({
        title: "Horário recusado com sucesso",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onRecuseClose();
      onClose();
    }
  }

  async function handleAcceptRequest() {
    if (requestId) {
      const docRef = doc(db, "classRequests", requestId);

      await updateDoc(docRef, {
        status: "accepted",
      });

      toast({
        title: "Horário aceito com sucesso",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      await setDoc(doc(db, "connections", generateUUID()), {
        createdAt: new Date(),
        studentId: studentData?.id,
        teacherId: user?.id,
        schedule: {
          day: requests.find((x) => x.id === requestId)?.day,
          from: requests.find((x) => x.id === requestId)?.from,
          to: requests.find((x) => x.id === requestId)?.to,
        },
        isCompleted: false,
      });

      onClose();
    }
  }

  async function handleCreateConnection() {
    if (requestId) {
      await setDoc(doc(db, "connections", generateUUID()), {
        createdAt: new Date(),
        studentId: user?.id,
        teacherId: teacherData?.id,
        schedule: {
          day: requests.find((x) => x.id === requestId)?.recuseReasonData
            ?.suggestClassDay,
          from: requests.find((x) => x.id === requestId)?.recuseReasonData
            ?.suggestClassFrom,
          to: requests.find((x) => x.id === requestId)?.recuseReasonData
            ?.suggestClassTo,
        },
        isCompleted: false,
      });

      const docRef = doc(db, "classRequests", requestId);

      await updateDoc(docRef, {
        status: "accepted",
      });
    }

    onRefusedClose();
  }

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button
            borderRadius="8px"
            padding="0px"
            bg={colors.primary}
            colorScheme="none"
            style={{
              filter:
                location.pathname == "/"
                  ? `brightness(0.9)`
                  : `brightness(0.8)`,
            }}
          >
            <FiBell />
            {!user?.teacherId
              ? requests.filter(
                  (x) => x.status === "accepted" || x.status == "refused"
                ).length > 0 && (
                  <>
                    <span
                      style={{
                        backgroundColor: "red",
                        borderRadius: "50%",
                        width: "8px",
                        height: "8px",
                        display: "inline-block",
                        position: "absolute",

                        marginLeft: "12px",
                        marginTop: "12px",
                      }}
                    ></span>
                  </>
                )
              : requests.filter((x) => x.status === "pending").length > 0 && (
                  <span
                    style={{
                      backgroundColor: "red",
                      borderRadius: "50%",
                      width: "8px",
                      height: "8px",
                      display: "inline-block",
                      position: "absolute",

                      marginLeft: "12px",
                      marginTop: "12px",
                    }}
                  ></span>
                )}
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />

            <PopoverBody>
              {!user?.teacherId ? (
                <>
                  {requests.filter(
                    (x) => x.status === "accepted" || x.status == "refused"
                  ).length > 0 ? (
                    requests
                      .filter(
                        (x) => x.status === "accepted" || x.status == "refused"
                      )
                      .slice(0, 5)
                      .map((request) => (
                        <Requests
                          request={request}
                          onClick={(
                            requestId: string,
                            studentData: UserType,
                            teacherData?: UserType
                          ) =>
                            handleClickNotificationRequest(
                              requestId,
                              studentData,
                              teacherData
                            )
                          }
                        />
                      ))
                  ) : (
                    <Text textAlign="center">Nenhuma notificação</Text>
                  )}
                </>
              ) : (
                <>
                  {requests.filter((x) => x.status === "pending").length > 0 ? (
                    requests
                      .filter((x) => x.status === "pending")
                      .slice(0, 5)
                      .map((request) => (
                        <Requests
                          request={request}
                          onClick={(
                            requestId: string,
                            studentData: UserType,
                            teacherData?: UserType
                          ) =>
                            handleClickNotificationRequest(
                              requestId,
                              studentData
                            )
                          }
                        />
                      ))
                  ) : (
                    <Text textAlign="center">Nenhuma notificação</Text>
                  )}
                </>
              )}
            </PopoverBody>
            {requests.filter((x) => x.status === "pending").length > 5 && (
              <PopoverFooter p={0}>
                <Flex alignItems="center" justifyContent="center">
                  <Button
                    colorScheme="none"
                    color={colors?.texts.base}
                    p={0}
                    m={0}
                    fontSize="14px"
                  >
                    Ver todas
                  </Button>
                </Flex>
              </PopoverFooter>
            )}
          </PopoverContent>
        </Portal>
      </Popover>

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody mt="24px">
            <Flex gap="8px" alignItems="center">
              <Avatar src={studentData?.avatar} name={studentData?.name} />
              <Box>
                <Text>{studentData?.name}</Text>
                <Text fontSize="12px">
                  {getTimeDifference(
                    new Date(
                      requests.find((x) => x.id === requestId)?.createDate
                        .seconds * 1000
                    ).toDateString()
                  )}
                </Text>
              </Box>
            </Flex>

            <Text mt="24px">
              {requests.find((x) => x.id === requestId)?.text}
            </Text>

            <Text mt="8px">Minha preferência de dia e horário é:</Text>
            <Text mt="8px" fontWeight="semibold">
              {new Date(
                requests.find((x) => x.id === requestId)?.day ?? ""
              ).toLocaleDateString()}{" "}
              das {requests.find((x) => x.id === requestId)?.from} às{" "}
              {requests.find((x) => x.id === requestId)?.to}
            </Text>
            <Text mt="8px">Podemos marcar para esse horário?</Text>
          </ModalBody>
          <ModalFooter>
            <Flex gap="8px" w="100%">
              <Button
                colorScheme="none"
                onClick={onRecuseOpen}
                bg={"#E33D3D"}
                w="100%"
              >
                Reprovar
              </Button>
              <Button
                w="100%"
                bg={colors?.green}
                color="#FFF"
                colorScheme="none"
                onClick={handleAcceptRequest}
              >
                Aprovar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isCentered
        onClose={onRecuseClose}
        isOpen={isRecuseOpen}
        motionPreset="slideInBottom"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody mt="24px">
            <FormControl mt="8px">
              <FormLabel mb="0px">Motivo para a recusa do horário</FormLabel>
              <Text mb="8px" fontSize="12px">
                Esse motivo será enviado para o aluno
              </Text>
              <Select
                placeholder="Selecione"
                onChange={(e) => setReason(Number(e.target.value))}
              >
                <option value={1}>Horário indisponível</option>
                <option value={2}>Estou indisponível</option>
              </Select>
            </FormControl>

            {reason == 1 && (
              <>
                <Text mt="16px" fontWeight="semibold">
                  Escolha um dia disponível para sugerir ao aluno
                </Text>
                <Flex justify="space-between" gap="8px">
                  <Box minW="45%">
                    <FormControl mt="8px">
                      <FormLabel>Dia da semana</FormLabel>
                      <Input
                        type="date"
                        onChange={(e) => setSuggestClassDay(e.target.value)}
                      />
                    </FormControl>
                  </Box>
                  <Flex gap="8px">
                    <FormControl mt="8px">
                      <FormLabel>Das</FormLabel>
                      <Input
                        type="time"
                        onChange={(e) => setSuggestClassFrom(e.target.value)}
                      />
                    </FormControl>
                    <FormControl mt="8px">
                      <FormLabel>Até</FormLabel>
                      <Input
                        type="time"
                        onChange={(e) => setSuggestClassTo(e.target.value)}
                      />
                    </FormControl>
                  </Flex>
                </Flex>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="none"
              onClick={handleRecuseRequest}
              bg={"#E33D3D"}
              w="100%"
            >
              Reprovar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isCentered
        onClose={onRefusedClose}
        isOpen={isRefusedOpen}
        motionPreset="slideInBottom"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Horário recusado</ModalHeader>
          <ModalCloseButton />
          <ModalBody mt="-24px">
            <Text mt="8px">
              Infelizmente sua solicitação de horário para uma aula com o
              professor <strong>{teacherData?.name}</strong> foi recusada.
            </Text>
            <Text mt="8px" fontWeight="semibold">
              Motivo:{" "}
              {requests.find((x) => x.id === requestId)?.recuseReasonData
                ?.reason == 1
                ? "Horário indisponível"
                : "Estou indisponível"}
            </Text>
            {requests.find((x) => x.id === requestId)?.recuseReasonData
              ?.reason == 1 && (
              <>
                <Text mt="16px" fontWeight="semibold">
                  Horário sugerido pelo professor:
                </Text>
                <Text mt="8px">
                  {new Date(
                    requests.find((x) => x.id === requestId)?.recuseReasonData
                      ?.suggestClassDay ?? ""
                  ).toLocaleDateString()}{" "}
                  das{" "}
                  {
                    requests.find((x) => x.id === requestId)?.recuseReasonData
                      ?.suggestClassFrom
                  }{" "}
                  às{" "}
                  {
                    requests.find((x) => x.id === requestId)?.recuseReasonData
                      ?.suggestClassTo
                  }
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter display="flex" flexDirection="column" gap="8px">
            {requests.find((x) => x.id === requestId)?.recuseReasonData
              ?.reason == 1 && (
              <Button
                colorScheme="none"
                bg={colors?.primary}
                color="#FFF"
                fontFamily="Archivo"
                fontWeight="semibold"
                gap="8px"
                w="100%"
                onClick={handleCreateConnection}
                isDisabled={
                  requests.find((x) => x.id === requestId)?.status ===
                    "accepted" &&
                  requests.find((x) => x.id === requestId)?.recuseReasonData !=
                    undefined
                }
              >
                Aceitar horário sugerido
              </Button>
            )}
            <Button
              colorScheme="none"
              bg={colors?.green}
              color="#FFF"
              fontFamily="Archivo"
              fontWeight="semibold"
              gap="8px"
              w="100%"
              onClick={() => {
                window.open(
                  `https://wa.me/${teacherData?.phoneNumber}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <img src="/images/icons/Whatsapp.svg" alt="" /> Whatsapp do
              professor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isCentered
        onClose={onAcceptedClose}
        isOpen={isAcceptedOpen}
        motionPreset="slideInBottom"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Horário aprovado</ModalHeader>
          <ModalCloseButton />
          <ModalBody mt="-24px">
            <Text mt="8px">
              Sua solicitação de horário para uma aula com o professor{" "}
              <strong>{teacherData?.name}</strong> foi aprovada.
            </Text>
            <Text mt="8px" fontWeight="semibold">
              Horário:{" "}
              {new Date(
                requests.find((x) => x.id === requestId)?.day ?? ""
              ).toLocaleDateString()}{" "}
              das {requests.find((x) => x.id === requestId)?.from} às{" "}
              {requests.find((x) => x.id === requestId)?.to}
            </Text>
            <Text mt="8px">
              O professor entrará em contato com você em breve.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="none"
              bg={colors?.green}
              color="#FFF"
              fontFamily="Archivo"
              fontWeight="semibold"
              gap="8px"
              w="100%"
              onClick={() => {
                window.open(
                  `https://wa.me/${teacherData?.phoneNumber}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <img src="/images/icons/Whatsapp.svg" alt="" /> Whatsapp do
              professor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
