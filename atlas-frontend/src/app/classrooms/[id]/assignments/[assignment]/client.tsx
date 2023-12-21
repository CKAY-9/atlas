"use client"

import { AssignmentDTO } from "@/api/assignments/dto"
import { ClassroomDTO } from "@/api/classrooms/dto"
import { UserDTO } from "@/api/users/dto"
import style from "./assignment.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { getAllUsersFromIDs, getUserFromID } from "@/api/users/user";
import LoadingWheel from "@/components/loading/loading";
import UserChip from "@/components/user-chip/user-chip";
import { AssignmentEntryDTO } from "@/api/entries/dto";
import { createNewAssignmentEntry, getStudentAssignmentEntry } from "@/api/entries/entry";

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

const TeacherView = (props: AssignmentProps) => {
  const [students, setStudents] = useState<UserDTO[]>([]);
  const [loading_students, setLoadingStudents] = useState<boolean>(true);
  const [selected_entry, setSelectedEntry] = useState<AssignmentEntryDTO | null>(null);
  const [loading_selected, setLoadingSelected] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const get_students = await getAllUsersFromIDs(props.classroom.student_ids);
      setStudents(get_students);
      setLoadingStudents(false);
    })();
  }, []);

  const selectStudent = async (e: BaseSyntheticEvent, student_id: number) => {
    e.preventDefault();
    setLoadingSelected(true);
    const fetch = await getStudentAssignmentEntry(student_id, props.assignment.id);
    if (fetch !== null) {
      setSelectedEntry(fetch);
    } else {
      const student = await getUserFromID(student_id);
      if (student !== null) {
        const create = await createNewAssignmentEntry(student_id, props.assignment.id, []);
        if (create !== null) {
          const fetch_new = await getStudentAssignmentEntry(student_id, props.assignment.id);
          setSelectedEntry(fetch_new);
        }
      } 
    }
    setLoadingSelected(false);
  }

  return (
    <div className={style.teacher_view}>
      <nav className={style.students}>
        {loading_students
          ? <LoadingWheel size_in_rems={2} />
          : <>
            {students.length <= 0
              ? <span>There are no enrolled students in this class.</span>
              : <>
                <span>Students</span>
                {students.map((student: UserDTO, index: number) => {
                  return (
                    <button onClick={async (e: BaseSyntheticEvent) => await selectStudent(e, student.id)} className={style.student}>
                      <UserChip user={student} key={index} />
                    </button>
                  );
                })}
              </>
            }
          </>
        } 
      </nav>
      <div className={style.work}>
        <div className={style.tools}>
        </div>
        <div className={style.entry}>
          {selected_entry === null 
            ? <span>No assignment entry selected.</span>
            : <>
            </>
          }
        </div>
      </div>
    </div>
  );
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
        : <TeacherView user={props.user} assignment={props.assignment} classroom={props.classroom} />
      }
    </div>
  );
}

export default AssignmentClient;
