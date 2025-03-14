import { useLayoutEffect } from "react";
import "../App.css";

import { SignInWindow } from "../components/auth/sign-in";

const SignIn = ({ setToastMessage }) => {
  useLayoutEffect(() => {
    document.title = "Sign in";
  });

  return (
    <main>
      <SignInWindow setToastMessage={setToastMessage} />
    </main>
  );
};

export default SignIn;
