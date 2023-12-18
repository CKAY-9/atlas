import { getUserFromToken } from "@/api/users/user"
import AtlasWrapper from "@/components/wrapper/wrapper"
import { getStoredToken } from "@/utils/token.server"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import SettingsClient from "./client"

export const generateMetadata = (): Metadata => {
  return {
    "title": "User Settings - Atlas",
    "description": "Edit your account settings on Atlas."
  }
}
 
const SettingsPage = async () => {
  const user = await getUserFromToken(getStoredToken());
  if (user === null) {
    redirect("/users/login");
  }

  return (
    <>
      <AtlasWrapper user={user}>
        <SettingsClient user={user} />
      </AtlasWrapper>
    </>
  );
}

export default SettingsPage;
