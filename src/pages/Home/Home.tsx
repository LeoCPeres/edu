import { useAuth } from "../../contexts/AuthContext";

export function Home() {
  const { user } = useAuth();

  return <span>{user?.name}</span>;
}
