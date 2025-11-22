import { redirect } from "next/navigation";
import { getJwtFromCookies } from "../utils";
import SignInForm from "./SignInForm";

const SignInPage = async () => {
  const jwt = await getJwtFromCookies();

  if (jwt) {
    redirect("/feed");
  }

  return <SignInForm />;
};

export default SignInPage;
