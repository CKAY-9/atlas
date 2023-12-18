import { getClassroom } from "@/api/classrooms/classroom";
import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import style from "./classroom.module.scss";
import { ClassroomBanner, ClassroomContainer } from "./client";

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
      "description": "Failed to find classroom on Atlas. Join or Create classrooms using Atlas."
    }
  }

  return {
    "title": `${classroom.name} - Atlas`,
    "description": `${classroom.description}. View classrooms on Atlas.`
  }
}

const ClassroomPage = async ({params}: {
  params: {
    id: string
  }
}) => {
  const classroom_id = Number.parseInt(params.id);
  const classroom = await getClassroom(classroom_id, getStoredToken());
  if (classroom === null) {
    redirect("/");
  }

  const user_token = getStoredToken();
  const user = await getUserFromToken(user_token);
  if (user === null) {
    redirect("/users/login");
  }

  return (
    <>
      <AtlasWrapper user={user} current_classroom={classroom}>
        <div className={style.classroom}>
          <ClassroomBanner user={user} classroom={classroom} />
          <ClassroomContainer user={user} classroom={classroom} />
        </div>
      </AtlasWrapper>
    </>
  );
}

export default ClassroomPage;
