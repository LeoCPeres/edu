import { Box, Flex, Text } from "@chakra-ui/react";

import { colors } from "../../styles/colors";
import { ScheduleType } from "../../types/Schedule.interface";

export function ScheduleItem({
  id,
  from,
  to,
  week_day,
  isDisabled,
}: ScheduleType) {
  return (
    <Flex
      bg={colors?.gray150}
      borderColor={colors?.gray100}
      borderWidth={1}
      borderRadius="8px"
      direction="column"
      p="16px"
      w="100%"
      gap="12px"
      minW="70px"
      opacity={isDisabled ? 0.5 : 1}
    >
      <Box>
        <Text fontSize="12px" color={colors?.texts.complement}>
          Dia
        </Text>
        <Text
          fontFamily="Archivo"
          fontSize="16px"
          fontWeight="bold"
          color={colors?.texts.base}
        >
          {week_day}
        </Text>
      </Box>
      <Box>
        <Text fontSize="12px" color={colors?.texts.complement}>
          Horário
        </Text>
        <Text
          fontFamily="Archivo"
          fontSize="16px"
          fontWeight="bold"
          color={colors?.texts.base}
        >
          {from}-{to}
        </Text>
      </Box>
    </Flex>
  );
}
