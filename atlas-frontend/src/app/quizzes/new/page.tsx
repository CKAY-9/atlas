import { getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { getStoredToken } from "@/utils/token.server";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import NewQuizClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    "title": "New Quiz - Atlas",
    "description": "Create a new quiz on Atlas."
  }
}

const NewQuizPage = async () => {
  const user = await getUserFromToken(getStoredToken());
  if (user === null) {
    redirect("/users/login");
  }

  return (
    <>
      <AtlasWrapper user={user}>
        <Link href="/quizzes">Back</Link>
        <h1>New Quiz</h1>
        <NewQuizClient />
      </AtlasWrapper>
    </>
  );
}

export default NewQuizPage;
