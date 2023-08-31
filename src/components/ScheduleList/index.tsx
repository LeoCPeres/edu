import { Box, Flex, Text } from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { ScheduleItem } from "../ScheduleItem";
import { ScheduleDays } from "../../utils/scheduleDays";
import { ScheduleType } from "../../types/Schedule.interface";

type ScheduleListProps = {
  schedule: ScheduleType[];
};

export function ScheduleList({ schedule }: ScheduleListProps) {
  return (
    <Flex flex="1" gap="16px" w="100%">
      {schedule?.map((day) => (
        <ScheduleItem
          id={day.id}
          key={day.week_day}
          week_day={day.week_day}
          from={day.from}
          to={day.to}
          isDisabled={day.isDisabled}
        />
      ))}
    </Flex>
  );
}
