import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const generateMetadata = (): Metadata => {
  return {
    "title": "Quizzes - Atlas",
    "description": "Browse all quizzes or create one on Atlas."
  }
}

const QuizzesPage = async () => {
  const user = await getUserFromToken(getStoredToken());
  if (user === null) {
    redirect("/users/login");
  }

  return (
    <>
      <AtlasWrapper user={user}>
        <h1>Quizzes</h1>
        <p style={{"width": "50%"}}>
          Atlas' quizzes are meant to engage students and classrooms with fun, exciting, quizzes. 
          Teachers are able to host quizzes and have their class join and compete head-to-head in a battle of speed, intelligence, and maybe some luck.
        </p>
        <Link href="/quizzes/new" style={{
          "padding": "1rem 2rem", 
          "borderRadius": "0.5rem", 
          "backgroundColor": "rgb(var(--neutral))", 
          "fontWeight": "900", 
          "width": "fit-content"
        }}>New Quiz</Link>
      </AtlasWrapper>
    </>
  );
}

export default QuizzesPage;
