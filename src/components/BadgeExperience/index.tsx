import { Badge } from "@chakra-ui/react";
import { xpLevels } from "../../utils/xpLevels";
import { useMemo, useState } from "react";
import { LevelType } from "../../types/level.interface";

type BadgeProps = {
  xp: number;
};

export function BadgeExperience({ xp }: BadgeProps) {
  const [level, setLevel] = useState<LevelType>();

  function getLevel() {
    for (const nivel of xpLevels) {
      if (xp >= nivel.xp_min && xp <= nivel.xp_max) {
        setLevel(nivel);
      }
    }
  }

  useMemo(() => {
    getLevel();
  }, [xp]);

  return (
    <Badge
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
      textAlign="center"
    >
      {level?.name}
    </Badge>
  );
}
