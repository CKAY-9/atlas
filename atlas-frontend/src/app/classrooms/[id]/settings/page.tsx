import { getClassroom } from "@/api/classrooms/classroom";
import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const generateMetadata = async ({params}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  const classroom_id = Number.parseInt(params.id);
  const classroom = await getClassroom(classroom_id, getStoredToken());
  if (classroom === null) {
    return {
      "title": "Invalid Settings - Atlas",
      "description": "Failed to get settings page for specified classroom. View your classroom settings on Atlas."
    }
  }
  return {
    "title": `Settings for ${classroom.name} - Atlas`,
    "description": `Manage classroom settings for ${classroom.name}.`
  }
}


const ClassroomSettingsPage = async ({params}: {
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
        <h1>Settings for {classroom.name}</h1>
      </AtlasWrapper>
    </>
  );
}

export default ClassroomSettingsPage;
