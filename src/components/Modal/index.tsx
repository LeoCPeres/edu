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
  size: string;
  title?: string;
  isOpen: boolean;
  textClose?: string;
  hasSaveButton?: boolean;
  isLoadingSave?: boolean;
  saveButtonText?: string;
  children: React.ReactNode;
  onSave?: () => void;
  onClose: () => void;
};

export function Modal({
  size,
  title,
  isOpen,
  onSave,
  onClose,
  children,
  textClose,
  isLoadingSave,
  hasSaveButton,
  saveButtonText,
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
              isLoading={isLoadingSave}
            >
              {saveButtonText ?? "Salvar"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
