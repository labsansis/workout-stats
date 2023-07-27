import { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormTextInput from "../formInputs/FormTextInput";
import { userState } from "../../common/recoilStateDefs";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import useFirebaseAuthentication from "../../common/hooks/useFirebaseAuthentication";

export default function SignUp() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const fbsUser = useFirebaseAuthentication();

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
        return userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error creating a user");
        console.log(`Error code ${errorCode} message ${errorMessage}`);
        setServerError(errorMessage);
        setSubmitting(false);
      });
  };

  const checkCurrentAuth = () => {
    console.log(firebaseAuth.currentUser);
  };

  return (
    <div>
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
            .required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          password: Yup.string()
            .min(8, "Must be at least 8 characters long")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) =>
          handleSignup(values, setSubmitting)
        }
      >
        <Form>
          <FormTextInput
            label="Name"
            name="name"
            type="text"
            placeholder="Rob Brown"
          />

          <FormTextInput
            label="Email"
            name="email"
            type="email"
            placeholder="rob@gmail.com"
          />

          <FormTextInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
          />

          <button type="submit">Submit</button>
          {!!serverError && <div>Error signing up: {serverError}</div>}
        </Form>
      </Formik>
    </div>
  );
}
