import "../App.css";

import { useLayoutEffect } from "react";
import { SignUpWindow } from "../components/auth/sign-up";

const SignUp = ({ setToastMessage }) => {
  useLayoutEffect(() => {
    document.title = "Sign up";
  });

  return (
    <main>
      <SignUpWindow setToastMessage={setToastMessage} />
    </main>
  );
};

export default SignUp;
