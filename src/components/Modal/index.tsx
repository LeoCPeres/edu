import {
  Modal as ChakraModal,
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
} from "@chakra-ui/react";
import React from "react";
import { colors } from "../../styles/colors";

type ModalType = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  textClose?: string;
  hasSaveButton?: boolean;
  onSave?: () => void;
  size: string;
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  textClose,
  hasSaveButton,
  onSave,
  size,
}: ModalType) {
  return (
    <ChakraModal onClose={onClose} isOpen={isOpen} isCentered size={size}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter gap="8px">
          <Button onClick={onClose}>{textClose}</Button>
          {hasSaveButton && (
            <Button
              onClick={onSave}
              bg={colors.primary}
              color="white"
              colorScheme="none"
            >
              Salvar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
