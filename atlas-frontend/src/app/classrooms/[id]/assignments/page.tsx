import { getClassroom } from "@/api/classrooms/classroom";
import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AssignmentsClient from "./client";

export const generateMetadata = async ({params}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  const classroom_id = Number.parseInt(params.id);
  const classroom = await getClassroom(classroom_id, getStoredToken());
  if (classroom === null) {
    return {
      "title": "Invalid Classroom - Atlas",
      "description": "Failed to get specified classroom. Join or create classes on Atlas."
    }
  }
  return {
    "title": `${classroom.name} Assignments - Atlas`,
    "description": `View all avaliable assignments for ${classroom.name}.`
  }
}

const AssignmentsPage = async ({params}: {
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
        <h1>Assignments</h1>
        <AssignmentsClient user={user} classroom={classroom} />
      </AtlasWrapper>
    </>
  )
}

export default AssignmentsPage;
