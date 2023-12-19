"use client"

import { AnnouncementDTO } from "@/api/announcements/dto"
import style from "./assignment.module.scss";
import UserChip from "../user-chip/user-chip";
import { useEffect, useState } from "react";
import { UserDTO } from "@/api/users/dto";
import { ClassroomDTO } from "@/api/classrooms/dto";
import LoadingWheel from "../loading/loading";
import { getUserFromID } from "@/api/users/user";
import { getClassroom } from "@/api/classrooms/classroom";
import { AssignmentDTO } from "@/api/assignments/dto";

const AssignmentPreview = (props: {
  assignment: AssignmentDTO 
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [creator, setCreator] = useState<UserDTO | null>(null);
  const [classroom, setClassroom] = useState<ClassroomDTO | null>(null);

  useEffect(() => {
    (async () => {
      const temp_user = await getUserFromID(props.assignment.teacher_id);
      const temp_class = await getClassroom(props.assignment.classroom_id);
      setCreator(temp_user);
      setClassroom(temp_class);
      setLoading(false);
    })();
  }, [props.assignment]);

  return (
    <div className={style.preview}>
      <h2 style={{"margin": "0 0 1rem 0"}}>{props.assignment.name}</h2>
      {(loading || creator === null) 
        ? <LoadingWheel size_in_rems={2} />
        : <UserChip user={creator} />
      }
      <p>{props.assignment.description}</p>
      <span style={{"opacity": "0.5"}}>{new Date(props.assignment.posted).toLocaleDateString()}</span>
    </div>
  );
}

export default AssignmentPreview;
