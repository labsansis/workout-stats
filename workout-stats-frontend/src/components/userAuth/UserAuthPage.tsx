import { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import useFirebaseAuthentication from "../../common/hooks/useFirebaseAuthentication";
import {
  userCoreState,
  userState,
  userSupplementalState,
} from "../../common/recoilStateDefs";
import { useRecoilState, useRecoilValue } from "recoil";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { FcGoogle } from "react-icons/fc";
import "./UserAuthPage.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserSupplementalInfo } from "../../models/user";

export default function UserAuthPage({ kind }: UserAuthPageProps) {
  const [ssoErrorCode, setSsoErrorCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const fbsUser = useFirebaseAuthentication();
  const [userCore, setUserCore] = useRecoilState(userCoreState);
  const [userSuppl, setUserSuppl] = useRecoilState(userSupplementalState);
  const user = useRecoilValue(userState);

  const handleGoogleSignin = () => {
    firebaseAuth.useDeviceLanguage();
    const provider = new GoogleAuthProvider();
    signInWithPopup(firebaseAuth, provider).catch((error) => {
      console.error(error);
      setSsoErrorCode(error.code);
    });
  };

  useEffect(() => {
    if (!!fbsUser) {
      setUserCore({
        name: fbsUser.displayName as string,
        email: fbsUser.email as string,
        id: fbsUser.uid,
      });
      console.log("SETTING UP FETCH");
      fetchUserSupplementalData(fbsUser.uid);
    }
  }, [fbsUser]);

  useEffect(() => {
    if (!!user) {
      const redirectPath = decodeURIComponent(
        new URLSearchParams(location.search).get("redirect") || "",
      );
      navigate(redirectPath || "/home");
    }
  }, [user]);

  const fetchUserSupplementalData = async (userId: string) => {
    const docsnap = await getDoc(doc(db, "users", userId));
    const usi = docsnap.data() as UserSupplementalInfo;
    setUserSuppl(usi || {});
  };

  return (
    <div className="mx-auto md:w-[30em] px-4 py-10">
      <h1>{kind == "signin" ? <>Sign In</> : <>Sign Up</>}</h1>

      <div
        className="h-10 bg-[#0891b2] block w-full rounded text-[#f1f5f9] disabled:bg-[#88aab3] min-w-[15em] flex gap-0 cursor-pointer"
        onClick={handleGoogleSignin}
      >
        <div className="w-10 h-10 flex-none">
          <FcGoogle className="w-7 h-7 m-1" />
        </div>
        <div className="flex-1 align-middle text-center mt-[7px]">
          Sign in with Google
        </div>
      </div>

      <div className="text-center my-4">or</div>

      {kind == "signin" ? <SignInForm /> : <SignUpForm />}
    </div>
  );
}

type UserAuthPageProps = {
  kind: string;
};
