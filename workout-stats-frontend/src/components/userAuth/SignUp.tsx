import { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormTextInput from "../formInputs/FormTextInput";
import { useNavigate, Link } from "react-router-dom";
import useFirebaseAuthentication from "../../common/hooks/useFirebaseAuthentication";

export default function SignUp() {
  const [serverErrorCode, setServerErrorCode] = useState("");
  const navigate = useNavigate();
  const fbsUser = useFirebaseAuthentication();

  const EMAIL_ALREADY_IN_USE_CODE = "auth/email-already-in-use";

  useEffect(() => {
    if (!!fbsUser) {
      // setUser({name: fbsUser.displayName as string, email: fbsUser.email as string});
      navigate("/home");
    }
  }, [fbsUser]);

  const handleSignup = (
    {
      email,
      password,
      name,
    }: { email: string; password: string; name: string },
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then(async (userCredential) => {
        // Signed in
        console.log("Created a user");
        console.log(userCredential);
        console.log(userCredential.user);
        await updateProfile(userCredential.user, { displayName: name });
        setSubmitting(false);
        return userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error creating a user");
        console.log(`Error code ${errorCode} message ${errorMessage}`);
        setServerErrorCode(errorCode);
        setSubmitting(false);
      });
  };

  const formatServerError = () => {
    if (serverErrorCode === EMAIL_ALREADY_IN_USE_CODE) {
      return null;
    }
    return "There was an error signing up. Please try again.";
  };

  return (
    <div className="mx-auto md:w-[30em] px-4 py-10">
      <h1>Sign Up</h1>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .max(50, "Must be 50 characters or less")
            .required("Name is required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
          password: Yup.string()
            .min(8, "Must be at least 8 characters long")
            .required("Password is required"),
        })}
        onSubmit={(values, { setSubmitting }) =>
          handleSignup(values, setSubmitting)
        }
      >
        {(formik) => (
          <Form>
            <FormTextInput label="Name" name="name" type="text" />

            <FormTextInput
              label="Email"
              name="email"
              type="email"
              errorOverride={
                (serverErrorCode === EMAIL_ALREADY_IN_USE_CODE || undefined) &&
                "This email is already registered"
              }
            />

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
              Already have an acount?{" "}
              <Link
                to="/signin"
                className="underline hover:text-[#0891b2] active:text-[#0891b2] focus:text-[#0891b2]"
              >
                Sign in
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
