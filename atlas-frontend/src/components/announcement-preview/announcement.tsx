"use client"

import { AnnouncementDTO } from "@/api/announcements/dto"
import style from "./announcement.module.scss";
import UserChip from "../user-chip/user-chip";
import { useEffect, useState } from "react";
import { UserDTO } from "@/api/users/dto";
import { ClassroomDTO } from "@/api/classrooms/dto";
import LoadingWheel from "../loading/loading";
import { getUserFromID } from "@/api/users/user";
import { getClassroom } from "@/api/classrooms/classroom";

const AnnouncementPreview = (props: {
  announcement: AnnouncementDTO
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [creator, setCreator] = useState<UserDTO | null>(null);
  const [classroom, setClassroom] = useState<ClassroomDTO | null>(null);

  useEffect(() => {
    (async () => {
      const temp_user = await getUserFromID(props.announcement.sender_id);
      const temp_class = await getClassroom(props.announcement.classroom_id);
      setCreator(temp_user);
      setClassroom(temp_class);
      setLoading(false);
    })();
  }, [props.announcement]);

  return (
    <div className={style.preview}>
      {(loading || creator === null) 
        ? <LoadingWheel size_in_rems={2} />
        : <UserChip user={creator} />
      }
      <p>{props.announcement.content}</p>
      <span style={{"opacity": "0.5"}}>{new Date(props.announcement.posted).toLocaleDateString()}</span>
    </div>
  );
}

export default AnnouncementPreview;
