import { ScheduleType } from "./Schedule.interface";
import { UserType } from "./User.interface";

export type TeachersProps = {
  biography: string;
  createdAt: Date;
  user_id: string;
  whatsapp: string;
  price: number;
  schedule: ScheduleType[];
  userData?: UserType;
};
