import "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function useAuthRedirect() {
  const navigate = useNavigate();

  auth.onAuthStateChanged((user) => {
    if (user) {
      // Usuário está autenticado
    } else {
      // Usuário não está autenticado
      if (
        window.location.pathname != "/login" &&
        window.location.pathname != "/register" &&
        window.location.pathname != "/resetpassword"
      )
        navigate("/login");
    }
  });
}

export default useAuthRedirect;
