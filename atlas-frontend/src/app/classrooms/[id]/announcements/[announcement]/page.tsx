import { getAnnouncementFromID } from "@/api/announcements/announcement";
import { getClassroom } from "@/api/classrooms/classroom";
import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { redirect } from "next/navigation";
import AnnouncementClient from "./client";
import Link from "next/link";

const AnnouncementPage = async ({params}: {
  params: {
    id: string,
    announcement: string
  }
}) => {
  const classroom_id = Number.parseInt(params.id);
  const announcement_id = Number.parseInt(params.announcement);
  const classroom = await getClassroom(classroom_id, getStoredToken());
  if (classroom === null) {
    redirect("/")
  }

  const announcement = await getAnnouncementFromID(announcement_id, getStoredToken());
  if (announcement === null) {
    redirect(`/classrooms/${classroom.id}/announcements`);
  }

  const user = await getUserFromToken(getStoredToken());
  if (user === null) {
    redirect("/users/login");
  }

  return (
    <>
      <AtlasWrapper user={user} current_classroom={classroom}>
        <Link href={`/classrooms/${classroom.id}/announcements`}>Back</Link>
        <h1>Announcement for {classroom.name}</h1> 
        <AnnouncementClient user={user} announcement={announcement} />
      </AtlasWrapper>
    </>
  );
}

export default AnnouncementPage;
