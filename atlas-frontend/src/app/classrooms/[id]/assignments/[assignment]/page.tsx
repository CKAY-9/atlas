import { getAssignmentFromID } from "@/api/assignments/assignment"
import { getClassroom } from "@/api/classrooms/classroom"
import { getUserFromToken } from "@/api/users/user"
import AtlasWrapper from "@/components/wrapper/wrapper"
import { getStoredToken } from "@/utils/token.server"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const generateMetadata = async ({params}: {
  params: {
    id: string,
    assignment: string
  }
}): Promise<Metadata> => {
  const assignment_id = Number.parseInt(params.assignment);
  const assignment = await getAssignmentFromID(assignment_id, getStoredToken());
  if (assignment === null) {
    return {
      "title": "Invalid Assignment - Atlas",
      "description": "Failed to fetch specified assignment. View all your assignments on Atlas."
    }
  }
  return {
    "title": `${assignment.name} - Atlas`,
    "description": `${assignment.name} (Assignment): ${assignment.description}`
  }
}

const AssignmentPage = async ({params}: {
  params: {
    id: string,
    assignment: string
  }
}) => {
  const classroom_id = Number.parseInt(params.id);
  const assignment_id = Number.parseInt(params.assignment);
  const classroom = await getClassroom(classroom_id, getStoredToken());
  if (classroom === null) {
    redirect("/");
  }

  const assignment = await getAssignmentFromID(assignment_id, getStoredToken());
  if (assignment === null) {
    redirect("/");
  }

  const user = await getUserFromToken(getStoredToken());
  if (user === null) {
    redirect("/users/login");
  }

  return (
    <>
      <AtlasWrapper user={user} current_classroom={classroom} current_assignment={assignment}>
        <Link href={`/classrooms/${classroom.id}/assignments`}>Back</Link>
      </AtlasWrapper>
    </>
  );
}

export default AssignmentPage;
