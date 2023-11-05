import { Box, Flex, Text, Progress, Badge } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LevelType } from "../../types/level.interface";
import { xpLevels } from "../../utils/xpLevels";
import { BadgeExperience } from "../BadgeExperience";

interface ExperienceBarProps {
  currentXP: number;
}

export default function ExperienceBar({ currentXP }: ExperienceBarProps) {
  const [level, setLevel] = useState<LevelType>({} as LevelType);
  const nextLevel =
    xpLevels.find((x) => x.id === level.id + 1) ?? ({} as LevelType);
  const percentToNextLevel = Math.round((currentXP * 100) / nextLevel?.xp_min);

  function getLevel() {
    for (const nivel of xpLevels) {
      if (currentXP >= nivel.xp_min && currentXP <= nivel.xp_max) {
        setLevel(nivel);
      }
    }
  }

  useMemo(() => {
    getLevel();
  }, [currentXP]);

  return (
    <Box mt="80px">
      <Flex align="center">
        <BadgeExperience xp={currentXP} />
        <Text fontSize="sm" mr="2" ml="3">
          {currentXP} xp
        </Text>
        <Progress
          flex="1"
          mr="2"
          borderRadius="full"
          colorScheme={
            level?.id == 0
              ? "green"
              : level?.id == 1
              ? "yellow"
              : level?.id == 2
              ? "orange"
              : level?.id == 3
              ? "red"
              : "purple"
          }
          size="sm"
          value={percentToNextLevel}
        />
        <Text fontSize="sm" ml="2">
          {nextLevel?.xp_min} xp
        </Text>

        <Badge
          ml="3"
          colorScheme={
            nextLevel?.id == 0
              ? "green"
              : nextLevel?.id == 1
              ? "yellow"
              : nextLevel?.id == 2
              ? "orange"
              : nextLevel?.id == 3
              ? "red"
              : "purple"
          }
          textAlign="center"
        >
          {nextLevel?.name}
        </Badge>
      </Flex>
    </Box>
  );
}
