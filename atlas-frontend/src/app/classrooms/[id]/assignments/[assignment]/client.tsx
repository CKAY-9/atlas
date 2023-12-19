"use client"

import { AssignmentDTO } from "@/api/assignments/dto"
import { ClassroomDTO } from "@/api/classrooms/dto"
import { UserDTO } from "@/api/users/dto"
import style from "./assignment.module.scss";
import { useEffect, useState } from "react";
import { getUserFromID } from "@/api/users/user";
import LoadingWheel from "@/components/loading/loading";
import UserChip from "@/components/user-chip/user-chip";

const AssignmentClient = (props: {
  user: UserDTO,
  classroom: ClassroomDTO,
  assignment: AssignmentDTO
}) => {
  const [teacher, setTeacher] = useState<UserDTO | null>(null);
  const [loading_teacher, setLoadingTeacher] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const temp_teacher = await getUserFromID(props.assignment.teacher_id);
      setTeacher(temp_teacher);
      setLoadingTeacher(false);
    })();
  }, []);

  return (
    <div className={style.assignment}>
      <h1>{props.assignment.name}</h1>
      {(loading_teacher || teacher === null) 
        ? <LoadingWheel size_in_rems={2} />
        : <UserChip user={teacher} />
      } 
      <p>{props.assignment.description}</p>
      <span style={{"opacity": "0.5"}}>Posted on {new Date(props.assignment.posted).toLocaleDateString()}</span>
    </div>
  );
}

export default AssignmentClient;
