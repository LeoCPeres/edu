export type ConnectionsType = {
  id: string;
  createdAt: any;
  isCompleted: boolean;
  schedule: {
    day: string;
    from: string;
    to: string;
  };
  studentId: string;
  teacherId: string;
};
