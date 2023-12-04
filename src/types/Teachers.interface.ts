import { ScheduleType } from "./Schedule.interface";
import { UserType } from "./User.interface";

export type TeachersProps = {
  name: string;
  biography: string;
  user_id: string;
  whatsapp: string;
  subject: string;
  price: number;
  createdAt: Date;
  schedule: ScheduleType[];
  userData?: UserType;
  xp: number;
  rating: [
    {
      id: string;
      userId: string;
      createdAt: any;
      rating: number;
      comment: string;
    }
  ];
};
