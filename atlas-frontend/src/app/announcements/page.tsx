import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const generateMetadata = (): Metadata => {
  return {
    "title": "All Announcements - Atlas",
    "description": "View all of your announcements on Atlas."
  }
}

const GlobalAnnouncementsPage = async () => {
  const user = await getUserFromToken(getStoredToken());
  if (user === null) {
    redirect("/users/login");
  }

  return (
    <>
      <AtlasWrapper user={user}>
        <h1>All Announcements</h1>
      </AtlasWrapper>
    </>
  );
}

export default GlobalAnnouncementsPage;
