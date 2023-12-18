"use client"

import { ClassroomDTO } from "@/api/classrooms/dto";
import style from "./class-chip.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UserDTO } from "@/api/users/dto";
import { getUserFromID } from "@/api/users/user";
import LoadingWheel from "../loading/loading";

const ClassChip = (props: {
  classroom: ClassroomDTO | null
}) => {
  if (props.classroom === null) return;
  const [teacher, setTeacher] = useState<UserDTO | null>(null);
  const [loading_teacher, setLoadingTeacher] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const temp_teacher = await getUserFromID(props.classroom?.teacher_ids[0] || 0);
      setTeacher(temp_teacher);
      setLoadingTeacher(false);
    })();
  }, [props.classroom]);

  return (
    <div className={style.class}>
      {(!loading_teacher && teacher !== null)
        ? <Image 
          src={teacher.avatar}
          alt="Avatar"
          sizes="100%"
          width={0}
          height={0}
          className={style.icon}
        />
        : <LoadingWheel size_in_rems={2} />
      }
      <span className={style.name}>{props.classroom.name.substring(0, 15)}{props.classroom.name.length >= 15 && <>...</>}</span>
    </div>
  )
}

export default ClassChip;
