import { getClassroom } from "@/api/classrooms/classroom";
import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { redirect } from "next/navigation";
import AnnouncementsClient from "./client";
import { Metadata } from "next";
import Link from "next/link";

export const generateMetadata = async ({params}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  const classroom_id = Number.parseInt(params.id);
  const classroom = await getClassroom(classroom_id, getStoredToken());
  if (classroom === null) {
    return {
      "title": "Invalid Announcements - Atlas",
      "description": "Failed to get announcements for specified classroom. View your announcements on Atlas."
    }
  }
  return {
    "title": `Announcements for ${classroom.name} - Atlas`,
    "description": `View all announcements for ${classroom.name}.`
  }
}


const AnnouncementsPage = async ({params}: {
  params: {
    id: string
  }
}) => {
  const classroom_id = Number.parseInt(params.id);
  const classroom = await getClassroom(classroom_id, getStoredToken());
  if (classroom === null) {
    redirect("/");
  }

  const user = await getUserFromToken(getStoredToken());
  if (user === null) {
    redirect("/users/login");
  }

  return (
    <>
      <AtlasWrapper user={user} current_classroom={classroom}>
        <Link href={`/classrooms/${classroom.id}`}>Back</Link>
        <h1>Announcements</h1>
        <AnnouncementsClient user={user} classroom={classroom} />
      </AtlasWrapper>
    </>
  );
}

export default AnnouncementsPage;
