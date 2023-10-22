import { LevelType } from "../types/level.interface";

export const xpLevels: LevelType[] = [
  {
    id: 0,
    name: "Iniciante",
    xp_min: 0,
    xp_max: 1000,
  },
  {
    id: 1,
    name: "Intermediário",
    xp_min: 1001,
    xp_max: 3000,
  },
  {
    id: 2,
    name: "Avançado",
    xp_min: 3001,
    xp_max: 6000,
  },
  {
    id: 3,
    name: "Especialista",
    xp_min: 6001,
    xp_max: 10000,
  },
  {
    id: 5,
    name: "Mestre",
    xp_min: 10001,
    xp_max: Infinity,
  },
];
