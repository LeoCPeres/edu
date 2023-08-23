import {
  Modal as ChakraModal,
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { colors } from "../../styles/colors";

type FullSizeModalType = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
  textClose?: string;
  onSave?: () => void;
};

export function FullSizeModal({
  isOpen,
  onClose,
  title,
  subTitle,
  textClose,
  onSave,
}: FullSizeModalType) {
  return (
    <ChakraModal onClose={onClose} isOpen={isOpen} isCentered size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={0} m={0}>
          <Flex
            w="100%"
            h="100vh"
            flex={1}
            bg={colors?.primary}
            direction="column"
            justify="center"
            align="center"
            bgImage={"url(/images/background-success.svg)"}
            bgRepeat={"no-repeat"}
            bgPosition={"center"}
          >
            <Image src="/images/completed.svg" />

            <Text
              fontFamily="Archivo"
              color="#FFF"
              fontWeight="bold"
              fontSize="54"
              mt="50px"
            >
              {title}
            </Text>

            <Text
              fontFamily="Poppins"
              fontSize="16"
              color={colors?.texts.lightBlue}
              maxW="472px"
              textAlign="center"
              mt="24px"
            >
              {subTitle}
            </Text>

            <Button
              bg={colors?.green}
              colorScheme="none"
              fontFamily="Archivo"
              fontWeight="semibold"
              paddingX="40px"
              paddingY="15px"
              h="56px"
              mt="50px"
              onClick={onClose}
            >
              {textClose}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}
