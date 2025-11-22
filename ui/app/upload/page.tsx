import { redirect } from "next/navigation";
import { getJwtFromCookies } from "../utils";
import UploadForm from "./UploadForm";

const UploadPage = async () => {
  const jwt = await getJwtFromCookies();

  if (!jwt) {
    redirect("/sign-in");
  }

  return <UploadForm />;
};

export default UploadPage;
