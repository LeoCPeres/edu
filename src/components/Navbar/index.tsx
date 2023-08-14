import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";
import { FiPower } from "react-icons/fi";
import { colors } from "../../styles/colors";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";

export function Navbar() {
  const { user, signOutWithGoogle } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  let location = useLocation();

  useAuthRedirect();

  const whichStage = (route: string) =>
    ({
      "/": true,
      "/teacher/register": true,
    }[route] as boolean);

  async function handleLogOut() {
    await signOutWithGoogle()
      .then(() => {
        onClose();
        navigate("/login");
      })
      .catch((error) => console.log(error));
  }

  return (
    <Flex
      w="100%"
      justify="space-between"
      align="center"
      paddingY="24px"
      paddingX="250px"
      bgColor={location.pathname == "/" ? colors.primary : colors.primaryDark}
      display={whichStage(location.pathname) == true ? "flex" : "none"}
    >
      <Flex align="center" gap="16px" borderRadius="40px">
        <Image
          boxSize="40px"
          borderRadius="full"
          src={user?.avatar}
          alt={user?.name}
        />
        <Text fontWeight="medium" fontSize="14px" color="#FFF">
          {user?.name}
        </Text>
      </Flex>

      <Button
        borderRadius="8px"
        padding="0px"
        bg={colors.primary}
        colorScheme="none"
        style={{
          filter:
            location.pathname == "/" ? `brightness(0.9)` : `brightness(0.8)`,
        }}
        onClick={() => onOpen()}
      >
        <FiPower />
      </Button>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Deseja sair?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Deseja mesmo fazer logout?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleLogOut}>
              Sim
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
}
