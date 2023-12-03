export type ClassRequestsType = {
  id: string;
  createDate: any;
  day: string;
  from: string;
  to: string;
  studentId: string;
  teacherId: string;
  text: string;
  status: string;
  recuseReasonData?: {
    reason: number;
    suggestClassDay?: string;
    suggestClassFrom?: string;
    suggestClassTo?: string;
  };
};
