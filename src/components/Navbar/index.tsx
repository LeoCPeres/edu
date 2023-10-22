import {
  Avatar,
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { whichRoute } from "../../routes/whichRoute";
import { AlertDialog } from "../AlertDialog";

export function Navbar() {
  const { user, signOutWithGoogle } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  let location = useLocation();

  useAuthRedirect();

  function whichStage(route: string) {
    if (route.includes("/profile/")) return true;

    return {
      "/": true,
      "/teacher/register": true,
      "/teachers": true,
      "/profile/": true,
    }[route] as boolean;
  }

  async function handleLogOut() {
    await signOutWithGoogle()
      .then(() => {
        onClose();
        navigate("/login");
      })
      .catch((error) => console.log(error));
  }

  if (location.pathname != "/") {
    return (
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        bgColor={colors.primaryDark}
        paddingY="24px"
        paddingX="250px"
        position="fixed"
        maxH="64px"
        zIndex={1}
        display={whichStage(location.pathname) == true ? "flex" : "none"}
      >
        <Button
          onClick={() => navigate(-1)}
          bg="transparent"
          colorScheme="none"
        >
          <img src="/images/icons/arrow-left-white.svg" alt="back" />
        </Button>

        <Text
          fontSize="16px"
          fontWeight={500}
          fontFamily="Archivo"
          color={colors?.texts.lightBlue}
        >
          {whichRoute(location.pathname)}
        </Text>

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
          isOpen={isOpen}
          confirmAction={handleLogOut}
          confirmText="Sim"
          onClose={onClose}
          header="Deseja sair?"
          title="Deseja mesmo fazer logout?"
        />
      </Flex>
    );
  }

  return (
    <Flex
      w="100%"
      justify="space-between"
      align="center"
      paddingY="24px"
      paddingX="250px"
      position="fixed"
      zIndex={1}
      bgColor={location.pathname == "/" ? colors.primary : colors.primaryDark}
      display={whichStage(location.pathname) == true ? "flex" : "none"}
      maxH="64px"
    >
      <Flex align="center" gap="16px" borderRadius="40px">
        <Avatar
          boxSize="40px"
          borderRadius="full"
          src={user?.avatar}
          name={user?.name}
          bg={colors?.primaryDark}
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
        isOpen={isOpen}
        confirmAction={handleLogOut}
        confirmText="Sim"
        onClose={onClose}
        header="Deseja sair?"
        title="Deseja mesmo fazer logout?"
      />
    </Flex>
  );
}
