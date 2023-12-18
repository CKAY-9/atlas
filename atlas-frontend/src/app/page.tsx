import { UserDTO } from "@/api/users/dto";
import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import HomeClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    "title": "Home - Atlas",
    "description": "View all your notifications, announcments, messages, and more on Atlas."
  }
}

const HomePage = async () => {
  const user_token = getStoredToken();
  const user: UserDTO | null = await getUserFromToken(user_token);

  if (user === null) {
    redirect("/landing");
  }

  return (
    <>
      <AtlasWrapper user={user}>
        <h1>Hello, {user.username}</h1>
        <HomeClient user={user} />
      </AtlasWrapper>
    </>
  );
}

export default HomePage;
