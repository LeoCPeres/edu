import {
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { TeacherCard } from "../../components/TeacherCard";
import { getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { TeachersProps } from "../../types/Teachers.interface";

export function Teachers() {
  const { isOpen, onToggle } = useDisclosure();

  const [teachers, setTeachers] = useState([] as Array<TeachersProps>);
  const [defaultTeachers, setDefaultTeachers] = useState([] as Array<TeachersProps>);
  const [text, setText] = useState("")

  useEffect(() => {
    async function fetchData() {
      const response = await getDocs(collection(db, "teachers"));

      const data = response.docs.map((doc) => doc.data() as TeachersProps);

      setTeachers(data);
      setDefaultTeachers(data);
    }

    fetchData();
  }, []);


  useEffect(() => {
    if(text == ""){
      setTeachers(defaultTeachers)
      return;
    }

    const newTeachers = defaultTeachers?.filter(x => x?.name?.includes(text))
    setTeachers(newTeachers)
  }, [text])

  return (
    <Flex direction="column">
      <Flex
        bg={colors.primary}
        w="100%"
        paddingX={["160px", "160px", "160px", "160px", "150px", "450px"]}
        paddingTop="64px"
        paddingBottom="128px"
        alignItems="flex-end"
        justifyContent="space-between"
        mt="64px"
      >
        <Flex align="center" justifyContent="space-between" w="100%">
          <Text
            color={colors?.texts.zinc100}
            fontFamily="Archivo"
            fontWeight="bold"
            fontSize="36"
          >
            Estes são os <br /> professores disponíveis.
          </Text>
          <Flex align="center" gap="16px">
            <img src="/images/nerd-face.png" alt="nerd-face" width={64} />

            <Text
              color={colors?.texts.zinc100}
              fontFamily="Poppins"
              fontSize="16"
            >
              Nós temos {teachers?.length} <br /> professor
              {teachers?.length > 1 && "es"}.
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        paddingX={["160px", "160px", "160px", "160px", "150px", "450px"]}
        direction="column"
        bg={colors?.background}
        minH="100vh"
      >
        <Flex mt="-60px" direction="column" gap="16px">
          <FormControl>
            <FormLabel color={colors?.texts.lightBlue}>Nome</FormLabel>
            <Input
              type="text"
              bg={colors?.gray150}
              placeholder="Digite o nome do professor que você procura"
              h="56px"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </FormControl>

          <Collapse in={isOpen} animateOpacity>
            <Flex gap="16px">
              <FormControl>
                <FormLabel>Matéria</FormLabel>
                <Input type="text" bg={colors?.gray150} h="56px" />
              </FormControl>
              <FormControl>
                <FormLabel>Dia da semana</FormLabel>
                <Input type="text" bg={colors?.gray150} h="56px" />
              </FormControl>
              <FormControl>
                <FormLabel>Horário</FormLabel>
                <Input type="time" bg={colors?.gray150} h="56px" />
              </FormControl>
            </Flex>
          </Collapse>
        </Flex>

        <Box mb="16px">
          {teachers.length > 0 ? (
            teachers.map((teacher) => {
              return <TeacherCard teacher={teacher} />;
            })
          ) : (
            <Flex
              mt="64px"
              flex="1"
              alignItems="center"
              justifyContent="center"
            >
              <Text>Ops! Parece que não encontramos nada por aqui.</Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
