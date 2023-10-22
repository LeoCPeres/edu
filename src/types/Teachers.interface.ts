import { ScheduleType } from "./Schedule.interface";
import { UserType } from "./User.interface";

export type TeachersProps = {
  biography: string;
  user_id: string;
  whatsapp: string;
  subject: string;
  price: number;
  createdAt: Date;
  schedule: ScheduleType[];
  userData?: UserType;
  xp: number;
};
