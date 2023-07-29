import { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import useFirebaseAuthentication from "../../common/hooks/useFirebaseAuthentication";
import { userState } from "../../common/recoilStateDefs";
import { useRecoilState } from "recoil";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { FcGoogle } from "react-icons/fc";
import "./UserAuthPage.css";

export default function UserAuthPage({ kind }: UserAuthPageProps) {
  const [ssoErrorCode, setSsoErrorCode] = useState("");
  const navigate = useNavigate();
  const fbsUser = useFirebaseAuthentication();
  const [user, setUser] = useRecoilState(userState);

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
      setUser({
        name: fbsUser.displayName as string,
        email: fbsUser.email as string,
        id: fbsUser.uid,
      });
      navigate("/home");
    }
  }, [fbsUser]);

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
