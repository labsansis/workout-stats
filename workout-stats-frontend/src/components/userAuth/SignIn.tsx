import { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormTextInput from "../formInputs/FormTextInput";
import { useNavigate, Link } from "react-router-dom";
import useFirebaseAuthentication from "../../common/hooks/useFirebaseAuthentication";
import { userState } from "../../common/recoilStateDefs";
import { useRecoilState } from "recoil";

export default function SignIn() {
  const [serverErrorCode, setServerErrorCode] = useState("");
  const navigate = useNavigate();
  const fbsUser = useFirebaseAuthentication();
  const [user, setUser] = useRecoilState(userState);

  const WRONG_PASSWORD_CODE = "auth/wrong-password";
  const USER_NOT_FOUND_CODE = "auth/user-not-found";

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

  const handleSignin = (
    { email, password }: { email: string; password: string },
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then(async (userCredential) => {
        // Signed in
        console.log("Signed in");
        console.log(userCredential);
        console.log(userCredential.user);
        setSubmitting(false);
        return userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error signing in");
        console.log(`Error code ${errorCode} message ${errorMessage}`);
        setServerErrorCode(errorCode);
        setSubmitting(false);
      });
  };

  const formatServerError = () => {
    if (
      serverErrorCode === WRONG_PASSWORD_CODE ||
      serverErrorCode === USER_NOT_FOUND_CODE
    ) {
      return "Incorrect email or password";
    }
    return "There was an error signing in. Please try again.";
  };

  return (
    <div className="mx-auto md:w-[30em] px-4 py-10">
      <h1>Sign In</h1>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Please enter your email"),
          password: Yup.string().required("Please enter your password"),
        })}
        onSubmit={(values, { setSubmitting }) =>
          handleSignin(values, setSubmitting)
        }
      >
        {(formik) => (
          <Form>
            <FormTextInput label="Email" name="email" type="email" />

            <FormTextInput label="Password" name="password" type="password" />

            <button
              type="submit"
              className="py-2 bg-[#0891b2] block w-full rounded text-[#f1f5f9] disabled:bg-[#88aab3]"
              disabled={formik.isSubmitting}
            >
              Submit
            </button>
            <div className="text-sm text-[#b91c1c] mt-3 min-h-[1.8em]">
              {!!serverErrorCode && formatServerError()}
            </div>
            <div className="text-sm mt-1">
              Don't have an acount?{" "}
              <Link
                to="/signup"
                className="underline hover:text-[#0891b2] active:text-[#0891b2] focus:text-[#0891b2]"
              >
                Sign up
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
