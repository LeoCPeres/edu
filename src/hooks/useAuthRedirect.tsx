import "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function useAuthRedirect() {
  const { loadUserDataWithEmailAndPassword } = useAuth();
  const navigate = useNavigate();

  auth.onAuthStateChanged((user) => {
    if (user) {
      // Usuário está autenticado
      if (user.providerData[0].providerId != "google.com") {
        loadUserDataWithEmailAndPassword(user.uid);
      }
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
