import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useContext,
} from "react";
import { auth, db, provider } from "../firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signOutWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    await signInWithPopup(auth, provider)
      .then(async (response) => {
        const credential = GoogleAuthProvider.credentialFromResult(response);
        const token = credential?.accessToken;
        const user = response?.user;

        const isNewUser = await verifyNewUser(user?.uid);

        if (isNewUser) {
          // Add user to database

          await setDoc(doc(db, "users", user?.uid), {
            id: user?.uid,
            name: user?.displayName,
            avatar: user?.photoURL,
          });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
      });
  }

  async function signOutWithGoogle() {
    await signOut(auth).then(
      function () {
        console.log("Signout Succesfull");
      },
      function (error) {
        console.log("Signout Failed");
      }
    );
  }

  async function verifyNewUser(userId: string) {
    const isNewUser =
      (await getDocs(collection(db, "users"))).docs.find(
        (user) => user.id == userId
      ) == null || undefined
        ? true
        : false;

    return isNewUser;
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOutWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  return value;
}
