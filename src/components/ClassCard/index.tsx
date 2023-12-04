import {
  Avatar,
  Box,
  Button,
  Flex,
  Textarea,
  FormLabel,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ConnectionsType } from "../../types/connections.interface";
import { colors } from "../../styles/colors";
import { ScheduleDays } from "../../utils/scheduleDays";
import { useEffect, useState } from "react";
import { UserType } from "../../types/User.interface";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import BeautyStars from "beauty-stars";
import { TeachersProps } from "../../types/Teachers.interface";
import { generateUUID } from "../../utils/generateGUID";

type ClassCardProps = {
  connection: ConnectionsType;
  onComplete: (connectionId: string) => void;
};

export function ClassCard({ connection, onComplete }: ClassCardProps) {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<UserType>();
  const [teacherData, setTeacherData] = useState<UserType>();

  const [fullTeacherData, setFullTeacherData] = useState<TeachersProps>();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAvaliarOpen,
    onOpen: onAvaliarOpen,
    onClose: onAvaliarClose,
  } = useDisclosure();

  useEffect(() => {
    async function getStudentData() {
      const userData = await getDoc(doc(db, "users", connection.studentId));
      setStudentData(userData.data() as UserType);
    }

    async function getTeacherData() {
      const userData = await getDoc(doc(db, "users", connection.teacherId));
      setTeacherData(userData.data() as UserType);
    }

    if (user?.teacherId) {
      getStudentData();
    } else {
      getTeacherData();
    }
  }, []);

  async function handleCompleteClass() {
    if (teacherData?.teacherId) {
      await updateDoc(doc(db, "connections", connection.id), {
        isCompleted: true,
      });

      const response = await getDoc(
        doc(db, "teachers", teacherData?.teacherId)
      ).then((teacher) => teacher.data() as TeachersProps);

      setFullTeacherData(response);

      if (response) {
        updateDoc(doc(db, "teachers", teacherData?.teacherId), {
          xp: response.xp + 350,
        });

        const newFullTeacherData = response;
        newFullTeacherData.xp = response.xp + 350;
        setFullTeacherData(newFullTeacherData);
      }
    }

    onAvaliarOpen();
  }

  console.log(teacherData);

  async function handleRateYourTeacher() {
    if (fullTeacherData) {
      if (user) {
        const formattedRating = {
          id: generateUUID(),
          userId: user.id,
          createdAt: new Date() as any,
          rating: rating,
          comment: comment,
        };

        let teste = fullTeacherData?.rating;
        if (teste) {
          teste.push(formattedRating);
        } else {
          teste = [formattedRating];
        }

        if (teacherData?.teacherId) {
          await updateDoc(doc(db, "teachers", teacherData?.teacherId), {
            xp: fullTeacherData?.xp + 100 * rating,
            rating: teste,
          });
        }
      }
    }

    onClose();
    onAvaliarClose();
    onComplete(connection.id);
  }

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
        <Avatar
          name={studentData?.name ?? teacherData?.name}
          src={studentData?.avatar ?? teacherData?.avatar}
        />
        <Flex flexDir="column">
          {teacherData ? (
            <Link
              fontSize="16px"
              fontWeight="semibold"
              onClick={() => navigate(`/profile/${connection.teacherId}`)}
            >
              {teacherData?.name}
            </Link>
          ) : (
            <Text fontSize="16px" fontWeight="semibold">
              {studentData?.name}
            </Text>
          )}

          <Link
            color={colors?.green}
            fontSize="14px"
            fontWeight="medium"
            mt="-4px"
            onClick={() => {
              window.open(
                `https://wa.me/${
                  studentData?.phoneNumber ?? teacherData?.phoneNumber
                }`,
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
      {connection.studentId === user?.id && (
        <Button bg={colors?.primary} colorScheme="none" onClick={onOpen}>
          Concluir aula
        </Button>
      )}

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex flexDirection="column" alignItems="center" py="16px">
              <img src="/images/star-face.png" alt="star-face" width={128} />
              <Text fontWeight="medium" fontSize="20px" mt="16px">
                Que legal que sua aula deu certo!
              </Text>
              <Text fontSize="18px">Agora, que tal avaliar seu professor?</Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex flexDirection="column" w="100%">
              <Button
                bg={colors?.primary}
                colorScheme="none"
                onClick={handleCompleteClass}
                w="100%"
              >
                Avaliar
              </Button>
              <Button onClick={onClose} w="100%" mt="8px">
                Não, obrigado
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal onClose={onAvaliarClose} isOpen={isAvaliarOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              flexDirection="column"
              alignItems="center"
              pt="32px"
              gap="24px"
            >
              <Text fontSize="18px">Como você avaliaria seu professor?</Text>

              <BeautyStars
                value={rating}
                onChange={(value) => setRating(value)}
              />

              <Textarea
                placeholder="Escreva uma avaliação (opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex flexDirection="column" w="100%">
              <Button
                bg={colors?.primary}
                colorScheme="none"
                onClick={handleRateYourTeacher}
                w="100%"
              >
                Avaliar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
