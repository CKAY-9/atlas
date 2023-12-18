import { getClassroom } from "@/api/classrooms/classroom";
import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import NewAssignmentClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    "title": "New Assignment - Atlas",
    "description": "Create a new assignment on Atlas."
  }
}

const NewAssignmentPage = async ({params}: {
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
        <Link href={`/classrooms/${classroom.id}/assignments`}>Back</Link>
        <h1>New Assignment</h1>
        <NewAssignmentClient classroom={classroom} user={user} />
      </AtlasWrapper>
    </>
  );
}

export default NewAssignmentPage;
