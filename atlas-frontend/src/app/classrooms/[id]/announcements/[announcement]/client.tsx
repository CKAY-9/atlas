"use client";

import { AnnouncementDTO } from "@/api/announcements/dto"
import { UserDTO } from "@/api/users/dto"
import { getUserFromID } from "@/api/users/user";
import LoadingWheel from "@/components/loading/loading";
import UserChip from "@/components/user-chip/user-chip";
import Link from "next/link";
import { useEffect, useState } from "react"

const AnnouncementClient = (props: {
  announcement: AnnouncementDTO,
  user: UserDTO
}) => {
  const [creator, setCreator] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const temp_creator = await getUserFromID(props.announcement.sender_id);
      setCreator(temp_creator);
      setLoading(false);
    })();
  }, [props.announcement]);

  return (
    <>
      {(loading || creator === null)
        ? <LoadingWheel size_in_rems={5} />
        : <div style={{"display": "flex", "alignItems": "center", "gap": "0.5rem"}}>
          <span>Posted by</span>
          <Link href={`/users/${props.announcement.sender_id}`}>
            <UserChip user={creator} />
          </Link>
        </div>
      }
      <p>{props.announcement.content}</p>
      <span style={{"opacity": "0.5"}}>Posted on {new Date(props.announcement.posted).toLocaleDateString()}</span>
    </>
  );
}

export default AnnouncementClient;
