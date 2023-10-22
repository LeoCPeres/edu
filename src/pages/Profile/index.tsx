import { useParams } from "react-router-dom";

export function Profile() {
  const params = useParams();

  console.log(params);

  return <>{params.id}</>;
}
