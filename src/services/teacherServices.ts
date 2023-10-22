import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { TeachersProps } from "../types/Teachers.interface";

export async function getTeacherByUserId(userId: string) {
  const q = query(collection(db, "teachers"), where("user_id", "==", userId));

  const response = await getDocs(q);

  if (response.empty) {
    return null;
  }

  const teacher = response.docs[0].data() as TeachersProps;

  return teacher;
}
