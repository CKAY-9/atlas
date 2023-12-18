import { getUserFromID, getUserFromToken } from "@/api/users/user";
import AtlasWrapper from "@/components/wrapper/wrapper";
import { redirect } from "next/navigation";
import Image from "next/image";
import style from "./user.module.scss";
import { Metadata } from "next";
import { getStoredToken } from "@/utils/token.server";

export const generateMetadata = async ({params}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  const user_id = Number.parseInt(params.id)
  const user = await getUserFromID(user_id);
  if (user === null) {
    return {
      "title": "Invalid User - Atlas",
      "description": "Failed to get specified user. Find all public users on Atlas."
    }
  }
  return {
    "title": `${user.username}'s Profile - Atlas`,
    "description": `View ${user.username}'s profile on Atlas.`
  }
}

const UserPage = async ({params}: {
  params: {
    id: string
  }
}) => {
  const user_id = Number.parseInt(params.id)
  const user = await getUserFromID(user_id);
  if (user === null) {
    redirect("/");
  }

  const self_user = await getUserFromToken(getStoredToken());

  return (
    <>
      <AtlasWrapper user={self_user}>
        <div className={style.user}>
          <Image 
            src={user.avatar}
            alt="Avatar"
            sizes="100%"
            width={0}
            height={0}
            className={style.icon}
          />
          <h1>{user.username}</h1>
        </div>
      </AtlasWrapper>
    </>
  );
}

export default UserPage;
