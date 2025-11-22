import { redirect } from "next/navigation";
import { getJwtFromCookies } from "../utils";
import SignUpForm from "./SignUpForm";

const SignUpPage = async () => {
  const jwt = await getJwtFromCookies();

  if (jwt) {
    redirect("/feed");
  }

  return <SignUpForm />;
};

export default SignUpPage;
