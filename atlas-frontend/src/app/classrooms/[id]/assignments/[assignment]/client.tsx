"use client"

import { AssignmentDTO } from "@/api/assignments/dto"
import { ClassroomDTO } from "@/api/classrooms/dto"
import { UserDTO } from "@/api/users/dto"
import style from "./assignment.module.scss";
import { useEffect, useState } from "react";
import { getUserFromID } from "@/api/users/user";
import LoadingWheel from "@/components/loading/loading";
import UserChip from "@/components/user-chip/user-chip";

export interface AssignmentProps {
  user: UserDTO
  classroom: ClassroomDTO,
  assignment: AssignmentDTO
}

const StudentView = (props: AssignmentProps) => {
  return (
    <div className={style.assignment_container}>
      <section className={style.description}>
        <p>{props.assignment.description}</p>
        <span style={{"opacity": "0.5"}}>Posted on {new Date(props.assignment.posted).toLocaleDateString()}</span>
      </section>
      <section className={style.interaction}>
        <div className={style.work}>
          <h2>Work</h2>
          <div className={style.attachments}>
            <button>Add Attachment</button>
          </div>
          <button>Submit</button>
        </div>
        <div className={style.messages}>
          <h2>Private Comments</h2>
          <div className={style.comments}>
            <button>New Comment</button>
          </div>
        </div>
      </section>
    </div>
  )
}

const AssignmentClient = (props: AssignmentProps) => {
  const [teacher, setTeacher] = useState<UserDTO | null>(null);
  const [loading_teacher, setLoadingTeacher] = useState<boolean>(true);
  const [is_student, setIsStudent] = useState<boolean>(!props.classroom.teacher_ids.includes(props.user.id));

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
      {is_student 
        ? <StudentView user={props.user} assignment={props.assignment} classroom={props.classroom} />
        : <></>
      }
    </div>
  );
}

export default AssignmentClient;
