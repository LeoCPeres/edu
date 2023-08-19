import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { useAuth } from "../../contexts/AuthContext";
import { Modal } from "../../components/Modal";
import { ChangeEvent, useState } from "react";
import { generateUUID } from "../../utils/generateGUID";
import { unformatPrice } from "../../utils/unformatCurrency";
import { formatPrice } from "../../utils/formatCurrency";
import { AlertDialog } from "../../components/AlertDialog";

type ScheduleType = {
  id: string;
  week_day: string;
  from: string;
  to: string;
};

export function RegisterTeacher() {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [biography, setBiography] = useState("");
  const [price, setPrice] = useState<number>(0);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onClose: onConfirmClose,
    onOpen: onConfirmOpen,
  } = useDisclosure();
  const [scheduleItems, setScheduleItems] = useState<ScheduleType[]>([]);
  const [day, setDay] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function handleSaveSchedule() {
    setScheduleItems([
      ...scheduleItems,
      {
        id: generateUUID(),
        week_day: day,
        from,
        to,
      },
    ]);

    setDay("");
    setFrom("");
    setTo("");
    onClose();
  }

  function handleDeleteSchedule(id: string) {
    const newScheduleItems = scheduleItems.filter(
      (schedule) => schedule.id !== id
    );

    setScheduleItems(newScheduleItems);
  }

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputPhoneNumber = event.target.value;
    const formattedPhoneNumber = inputPhoneNumber.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    setPhoneNumber(formattedPhoneNumber);
  };

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

  function handleRegisterTeacher() {}

  return (
    <Flex direction="column">
      <Flex
        bg={colors.primary}
        w="100%"
        paddingX="450px"
        paddingTop="64px"
        paddingBottom="128px"
        alignItems="flex-end"
        justifyContent="space-between"
        mt="64px"
      >
        <Flex direction="column" gap="24px">
          <Heading color="#FFF" fontSize="36px">
            Que incrível que você <br /> quer dar aulas.
          </Heading>
          <Text color="#FFF" fontSize="16px">
            O primeiro passo, é preencher esse <br /> formulário de inscrição.
          </Text>
        </Flex>

        <Flex gap="24px">
          <img src="/images/icons/rocket.svg" alt="Foguete" />
          <Text color="#FFF">
            Preparare-se! <br /> Vai ser o máximo.
          </Text>
        </Flex>
      </Flex>

      <Flex bg={colors.background} borderRadius="8px" paddingX="450px" flex={1}>
        <Flex
          w="100%"
          marginTop="-56px"
          mb="81px"
          direction="column"
          borderRadius="9px"
          border={`1px solid ${colors.gray100}`}
        >
          <Flex
            paddingX="64px"
            bg="#FFF"
            paddingY="56px"
            direction="column"
            w="100%"
            borderRadius="8px 8px 0px 0px"
          >
            <Text fontSize="24px" fontWeight="semibold" fontFamily="Archivo">
              Seus dados
            </Text>

            <Divider height="16px" />

            <Flex mt="25px" justify="space-between" w="100%">
              <Flex align="center" gap="24px">
                <Avatar
                  name={user?.name}
                  src={user?.avatar}
                  w="80px"
                  h="80px"
                />

                <Heading fontSize="20px" fontFamily="Archivo">
                  {user?.name}
                </Heading>
              </Flex>

              <Box>
                <FormControl>
                  <FormLabel>Whatsapp</FormLabel>
                  <Input
                    type="tel"
                    placeholder="(  )"
                    value={formatPhoneNumber(phoneNumber)}
                    onChange={handlePhoneNumberChange}
                    maxLength={15}
                  />
                </FormControl>
              </Box>
            </Flex>

            <FormControl mt="32px">
              <FormLabel>
                <>
                  Biografia (Máximo 400 caracteres)
                  {biography.length > 0 ? ` - (${biography.length})` : ""}
                </>
              </FormLabel>
              <Textarea
                minH="168px"
                maxLength={400}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
              />
            </FormControl>

            <Text
              fontSize="24px"
              fontWeight="semibold"
              fontFamily="Archivo"
              mt="64px"
            >
              Sobre a aula
            </Text>

            <Divider height="16px" />

            <Flex justify="space-between" gap="33px">
              <Box minW="500px">
                <FormControl mt="32px">
                  <FormLabel>Disciplina</FormLabel>
                  <Select placeholder="Selecione qual você quer ensinar">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                </FormControl>
              </Box>
              <FormControl mt="32px">
                <FormLabel>Custo da sua hora por aula</FormLabel>
                <Input
                  type="text"
                  placeholder="R$"
                  value={formatPrice(price)}
                  onChange={(e) => setPrice(unformatPrice(e.target.value))}
                />
              </FormControl>
            </Flex>

            <Flex align="center" justify="space-between" w="100%" mt="64px">
              <Text fontSize="24px" fontWeight="semibold" fontFamily="Archivo">
                Horários disponíveis
              </Text>

              <Button
                type="button"
                colorScheme="none"
                bg="transparent"
                color={colors.primary}
                onClick={onOpen}
              >
                + Novo horário
              </Button>
            </Flex>

            <Divider height="16px" />

            {scheduleItems.map((schedule) => {
              return (
                <>
                  <Flex justify="space-between" gap="16px">
                    <Box minW="50%">
                      <FormControl mt="32px">
                        <FormLabel>Dia da semana</FormLabel>
                        <Select
                          placeholder="Selecione o dia"
                          isDisabled
                          value={schedule.week_day}
                        >
                          <option value="seg">Segunda-feira</option>
                          <option value="ter">Terça-feira</option>
                          <option value="qua">Quarta-feira</option>
                          <option value="qui">Quinta-feira</option>
                          <option value="sex">Sexta-feira</option>
                          <option value="sab">Sábado</option>
                          <option value="dom">Domingo</option>
                        </Select>
                      </FormControl>
                    </Box>
                    <Flex gap="16px">
                      <FormControl mt="32px">
                        <FormLabel>Das</FormLabel>
                        <Input type="text" isDisabled value={schedule.from} />
                      </FormControl>
                      <FormControl mt="32px">
                        <FormLabel>Até</FormLabel>
                        <Input type="text" isDisabled value={schedule.to} />
                      </FormControl>
                    </Flex>
                  </Flex>
                  <Flex
                    gap="24px"
                    alignItems="center"
                    justify="center"
                    mt="5px"
                  >
                    <Box width="40%" mt="-7px">
                      <Divider height="16px" />
                    </Box>

                    <Button
                      colorScheme="none"
                      bg="transparent"
                      color="#E33D3D"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
                      Excluir horário
                    </Button>

                    <Box width="40%" mt="-7px">
                      <Divider height="16px" />
                    </Box>
                  </Flex>
                </>
              );
            })}
          </Flex>

          <Flex
            w="100%"
            bg={colors.gray150}
            paddingX="64px"
            paddingY="40px"
            borderRadius="0px 0px 8px 8px"
            borderTop={`2px solid ${colors.gray100}`}
            justifyContent="space-between"
            align="center"
          >
            <Flex>
              <img src="/images/icons/warning.svg" alt="Aviso importante" />
              <Text fontSize="14px" ml="16px">
                <span style={{ color: colors.primary }}>Importante!</span>{" "}
                <br /> Preencha todos os dados corretamente.
              </Text>
            </Flex>

            <Button
              paddingX="40px"
              paddingY="15px"
              bg={colors.primary}
              fontFamily="Archivo"
              fontWeight="semibold"
              color="white"
              colorScheme="none"
              h="56px"
              onClick={onConfirmOpen}
            >
              Salvar cadastro
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <Modal
        title="Cadastrar Horário"
        onClose={onClose}
        isOpen={isOpen}
        textClose="Fechar"
        hasSaveButton
        size="3xl"
        onSave={handleSaveSchedule}
      >
        <Flex justify="space-between" gap="18px">
          <Box w="65%">
            <FormControl>
              <FormLabel>Dia da semana</FormLabel>
              <Select
                placeholder="Selecione o dia"
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="seg">Segunda-feira</option>
                <option value="ter">Terça-feira</option>
                <option value="qua">Quarta-feira</option>
                <option value="qui">Quinta-feira</option>
                <option value="sex">Sexta-feira</option>
                <option value="sab">Sábado</option>
                <option value="dom">Domingo</option>
              </Select>
            </FormControl>
          </Box>
          <Flex gap="16px">
            <FormControl>
              <FormLabel>Das</FormLabel>
              <Input type="time" onChange={(e) => setFrom(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Até</FormLabel>
              <Input type="time" onChange={(e) => setTo(e.target.value)} />
            </FormControl>
          </Flex>
        </Flex>
      </Modal>

      <AlertDialog
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        confirmAction={handleRegisterTeacher}
        confirmText="Sim"
        header="Deseja finalizar o formulário?"
        title="Deseja finalizar o formulário? Você poderá alterar os dados depois."
      />
    </Flex>
  );
}
