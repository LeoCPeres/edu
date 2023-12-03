import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useContext,
} from "react";
import { auth, db, provider } from "../firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { UserType } from "../types/User.interface";

type AuthContextType = {
  user: UserType | undefined;
  loadUserDataWithEmailAndPassword: (uid: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutWithGoogle: () => Promise<void>;
  registerUserWithEmailAndPassword: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account");
        }

        loadUserDataWithEmailAndPassword(uid);
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

  async function registerUserWithEmailAndPassword(
    email: string,
    password: string,
    name: string
  ) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        const isNewUser = await verifyNewUser(user?.uid);

        if (isNewUser) {
          // Add user to database

          await setDoc(doc(db, "users", user?.uid), {
            id: user?.uid,
            name: name,
            avatar: user?.photoURL,
          });

          setUser({
            id: user?.uid,
            name: name,
            avatar: "",
          });
        }
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  async function signInWithEmail(email: string, password: string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        const userData = (
          await getDoc(doc(db, "users", user.uid))
        ).data() as UserType;

        setUser({
          id: user.uid,
          name: userData.name,
          avatar: userData.avatar,
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  async function loadUserDataWithEmailAndPassword(uid: string) {
    if (user != undefined) return;

    await getDoc(doc(db, "users", uid))
      .then((response) => {
        const userData = response.data() as UserType;

        setUser(userData);
      })
      .catch((error) => console.log(error));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signOutWithGoogle,
        registerUserWithEmailAndPassword,
        signInWithEmail,
        loadUserDataWithEmailAndPassword,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  return value;
}
