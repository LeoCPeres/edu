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
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { colors } from "../../styles/colors";
import { useLocation } from "react-router-dom";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { ClassRequestsType } from "../../types/classRequests.interface";
import { Requests } from "./Requests";
import { UserType } from "../../types/User.interface";
import { getTimeDifference } from "../../utils/getTimeDifference";

export function Notifications() {
  let location = useLocation();
  const { user } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requests, setRequests] = useState<ClassRequestsType[]>([]);
  const [studentData, setStudentData] = useState<UserType>();
  const [requestId, setRequestId] = useState<string>();

  useEffect(() => {
    if (user) {
      if (user?.teacherId) {
        const docRef = collection(db, "classRequests");
        const q = query(docRef, where("teacherId", "==", user?.id));
        console.log("teacher");

        const unsub = onSnapshot(q, (snap) => {
          const requests = snap.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            } as ClassRequestsType;
          });

          setRequests(requests);
        });
      } else {
        console.log("student");
        const docRef = collection(db, "classRequests");
        const q = query(docRef, where("studentId", "==", user?.id));

        const unsub = onSnapshot(q, (snap) => {
          const requests = snap.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            } as ClassRequestsType;
          });

          setRequests(requests);
        });
      }
    }
  }, [user]);

  async function handleClickNotificationRequest(
    requestId: string,
    studentData: UserType
  ) {
    setStudentData(studentData);
    setRequestId(requestId);
    onOpen();
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
            {requests.length > 0 && (
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
              {requests.slice(0, 5).map((request) => (
                <Requests
                  request={request}
                  onClick={(requestId: string, studentData: UserType) =>
                    handleClickNotificationRequest(requestId, studentData)
                  }
                />
              ))}
            </PopoverBody>
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

            <Text my="24px">
              {requests.find((x) => x.id === requestId)?.text}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Flex gap="8px" w="100%">
              <Button
                colorScheme="none"
                onClick={onClose}
                bg={"#E33D3D"}
                w="100%"
              >
                Reprovar
              </Button>
              <Button w="100%" bg={colors?.green} color="#FFF">
                Aprovar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
