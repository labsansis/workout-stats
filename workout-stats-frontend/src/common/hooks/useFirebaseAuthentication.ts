import { useState, useEffect } from "react";
import { firebaseAuth } from "../../firebase";
import { User as FirebaseUser } from "firebase/auth";

const useFirebaseAuthentication = () => {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(
    firebaseAuth.currentUser,
  );

  useEffect(() => {
    const unlisten = firebaseAuth.onAuthStateChanged((authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });
    return () => {
      unlisten();
    };
  }, []);

  return authUser;
};

export default useFirebaseAuthentication;
