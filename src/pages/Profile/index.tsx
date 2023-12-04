import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
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
import { ChangeEvent, useMemo, useRef, useState } from "react";
import {
  useNavigate,
  useParams,
  useRoutes,
  useSearchParams,
} from "react-router-dom";
import { UserType } from "../../types/User.interface";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
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
import { Post } from "../../components/Post";
import { PostType } from "../../types/post.interface";
import { RateCard } from "../../components/RateCard";

type ProfileParams = {
  id: string;
};

export function Profile() {
  const { user } = useAuth();
  const { id } = useParams<ProfileParams>();
  const navigation = useNavigate();
  const [userData, setUserData] = useState<UserType>();
  const [teacherData, setTeacherData] = useState<TeachersProps>();
  const [scheduleData, setScheduleData] = useState<ScheduleType[]>([
    {} as ScheduleType,
  ]);

  let [searchParams, setSearchParams] = useSearchParams();

  const [requestClassIsLoading, setRequestClassIsLoading] = useState(false);
  const [requestClassText, setRequestClassText] = useState("");
  const [requestClassFrom, setRequestClassFrom] = useState("");
  const [requestClassDay, setRequestClassDay] = useState("");
  const [requestClassTo, setRequestClassTo] = useState("");

  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postText, setPostText] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSavingPhoneNumber, setIsSavingPhoneNumber] = useState(false);

  const isMe = id === user?.id;

  const {
    isOpen: isRequestOpen,
    onOpen: onRequestOpen,
    onClose: onRequestClose,
  } = useDisclosure();

  const {
    isOpen: isPhoneOpen,
    onOpen: onPhoneOpen,
    onClose: onPhoneClose,
  } = useDisclosure();

  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);

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
          status: "pending",
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

  function handleEdit() {
    if (teacherData) {
      navigation(`/teachers/edit`, { state: { teacher: teacherData } });
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

  async function handleFetchPosts() {
    setIsLoadingPosts(true);
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("authorId", "==", id));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const postsData = querySnapshot.docs.map((doc) => {
        console.log(doc.data());
        return {
          id: doc.id,
          ...doc.data(),
        } as PostType;
      });

      setPosts(postsData);
    }

    setIsLoadingPosts(false);
  }

  async function handleDeletePost(postId: string) {
    await deleteDoc(doc(db, "posts", postId));
    setPosts(posts.filter((post) => post.id !== postId));
  }

  async function handleCreatePost() {
    setIsCreatingPost(true);
    const postId = generateUUID();
    const postData = {
      id: postId,
      content: {
        text: postText,
      },
      authorId: user?.id,
      createdAt: new Date(),
      likes: 0,
      usersWhoLiked: [""],
    } as PostType;

    await setDoc(doc(db, "posts", postId), postData);
    setIsCreatingPost(false);

    postData.createdAt = {
      seconds: new Date().getTime(),
    };
    console.log(postData.createdAt);

    setPosts([postData, ...posts]);
    setPostText("");
  }

  const formatPhoneNumber = (phoneNumber: string) => {
    if (phoneNumber.length === 0) return `(  )`;

    if (phoneNumber.length <= 2) {
      return `(${phoneNumber})`;
    } else if (phoneNumber.length <= 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    } else {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
        2,
        7
      )}-${phoneNumber.slice(7)}`;
    }
  };

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputPhoneNumber = event.target.value;
    const formattedPhoneNumber = inputPhoneNumber.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    setPhoneNumber(formattedPhoneNumber);
  };

  async function handleSavePhoneNumber() {
    if (user) {
      setIsSavingPhoneNumber(true);
      await updateDoc(doc(db, "users", user.id), {
        phoneNumber: phoneNumber,
      }).finally(() => {
        setIsSavingPhoneNumber(false);
      });

      onPhoneClose();
      onRequestOpen();
    }
  }

  return (
    <Flex
      direction="column"
      paddingX={["160px", "160px", "160px", "160px", "150px", "250px"]}
      w="100%"
    >
      <Toast />

      {isMe && teacherData && <ExperienceBar currentXP={teacherData.xp ?? 0} />}

      <Flex mt="64px" gap="32px" h="100vh">
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

              {!isMe && (
                <Flex gap="6px" mt="4">
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
                        `https://wa.me/${teacherData?.whatsapp}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    <img src="/images/icons/Whatsapp.svg" alt="" /> Whatsapp
                  </Button>
                  <Button
                    w="100%"
                    bg={colors?.primary}
                    color="white"
                    colorScheme="none"
                    onClick={() => {
                      if (user?.phoneNumber || phoneNumber != "") {
                        onRequestOpen();
                      } else {
                        onPhoneOpen();
                      }
                    }}
                  >
                    Solicitar horário
                  </Button>
                </Flex>
              )}
            </>
          )}
          {isMe && (
            <Button mt="8px" onClick={handleEdit}>
              Editar perfil
            </Button>
          )}

          {/* {!isMe && (
            <Button
              mt="8px"
              bg="#E33D3D"
              color="white"
              gap="8px"
              colorScheme="none"
            >
              Reportar professor
              <FiFlag />
            </Button>
          )} */}
        </Flex>

        {teacherData && (
          <Flex w="100%">
            <Tabs
              align="start"
              w="100%"
              defaultIndex={searchParams.get("avaliar") == "true" ? 3 : 0}
            >
              <Flex w="100%" alignItems="center" justifyContent="flex-start">
                <TabList>
                  <Tab>Horários</Tab>
                  <Tab onClick={handleFetchPosts}>Posts</Tab>
                  <Tab>Avaliações</Tab>
                </TabList>
              </Flex>

              <TabPanels>
                <TabPanel>
                  <ScheduleList schedule={scheduleData} />
                </TabPanel>
                <TabPanel>
                  {isMe && (
                    <Flex flexDirection="column">
                      <Textarea
                        placeholder="Escreva algo para os seus alunos..."
                        borderColor={colors?.texts.zinc100}
                        borderWidth={1}
                        borderRadius="8px"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                      />
                      <Button
                        alignSelf="flex-end"
                        mt="16px"
                        bg={colors?.primary}
                        colorScheme="none"
                        isDisabled={postText == ""}
                        onClick={handleCreatePost}
                        isLoading={isCreatingPost}
                      >
                        Publicar
                      </Button>
                    </Flex>
                  )}
                  {isLoadingPosts && posts.length == 0 ? (
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Spinner />
                    </Flex>
                  ) : !isLoadingPosts && posts.length == 0 ? (
                    <Flex
                      w="100%"
                      alignItems="center"
                      justifyContent="center"
                      mt="16px"
                      flexDirection="column"
                      gap="8px"
                    >
                      <Text>Nenhum post encontrado</Text>
                    </Flex>
                  ) : (
                    <Flex flexDirection="column" mt="16px">
                      {posts?.map((post) => (
                        <Post
                          post={post}
                          deletePost={(postId: string) =>
                            handleDeletePost(postId)
                          }
                        />
                      ))}
                    </Flex>
                  )}
                </TabPanel>
                <TabPanel>
                  <Flex flexDirection="column" mt="16px" gap="8px">
                    {teacherData?.rating.length > 0 &&
                      teacherData?.rating?.map((rate) => (
                        <RateCard rate={rate} />
                      ))}
                  </Flex>
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
              <FormLabel>Dia</FormLabel>
              <Input
                type="date"
                onChange={(e) => setRequestClassDay(e.target.value)}
              />
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

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onPhoneClose}
        isOpen={isPhoneOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Cadastre uma forma de contato</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Whatsapp</FormLabel>
              <Text fontSize="12px" mb="10px" mt="-10px">
                O professor entrará em contato com você{" "}
              </Text>
              <Input
                type="tel"
                placeholder="(  )"
                value={formatPhoneNumber(phoneNumber)}
                onChange={handlePhoneNumberChange}
                maxLength={15}
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onPhoneClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="none"
              bg={colors?.primary}
              ml={3}
              onClick={handleSavePhoneNumber}
              isLoading={isSavingPhoneNumber}
            >
              Salvar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
}
