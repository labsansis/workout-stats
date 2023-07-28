import { useState } from "react";
import { firebaseAuth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormTextInput from "../formInputs/FormTextInput";
import { Link } from "react-router-dom";

export default function SignInForm() {
  const [serverErrorCode, setServerErrorCode] = useState("");

  const WRONG_PASSWORD_CODE = "auth/wrong-password";
  const USER_NOT_FOUND_CODE = "auth/user-not-found";

  const handleSignin = (
    { email, password }: { email: string; password: string },
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        setSubmitting(false);
      })
      .catch((error) => {
        setServerErrorCode(error.code);
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
  );
}
