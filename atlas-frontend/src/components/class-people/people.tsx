import { ClassroomDTO } from "@/api/classrooms/dto"
import style from "./people.module.scss";
import { useEffect, useState } from "react";
import { UserDTO } from "@/api/users/dto";
import LoadingWheel from "../loading/loading";
import { getAllUsersFromIDs } from "@/api/users/user";
import UserChip from "../user-chip/user-chip";
import Link from "next/link";

const ClassroomPeople = (props: {
  classroom: ClassroomDTO
}) => {
  const [students, setStudents] = useState<UserDTO[]>([]);
  const [teachers, setTeachers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const temp_teachers = await getAllUsersFromIDs(props.classroom.teacher_ids);
      const temp_students = await getAllUsersFromIDs(props.classroom.student_ids);
      setTeachers(temp_teachers);
      setStudents(temp_students);
      setLoading(false);
    })();
  }, [props.classroom]);

  if (loading) {
    return (<LoadingWheel size_in_rems={5} />);
  }

  return (
    <div>
      <h1 style={{"margin": "1rem 0 0.5rem 0"}}>Teachers</h1>
      <div className={style.seperator} />
      <div className={style.people}>
        {teachers.map((teacher: UserDTO, index: number) => {
          return (<Link href={`/users/${teacher.id}`}><UserChip user={teacher} key={index} /></Link>);
        })}
      </div>
      <h1 style={{"margin": "1rem 0 0.5rem 0"}}>Students</h1>
      <div className={style.seperator} />
      <div className={style.people}>
        {students.map((student: UserDTO, index: number) => {
          return (<Link href={`/users/${student.id}`}><UserChip user={student} key={index} /></Link>);
        })}
      </div>
    </div>
  )
}

export default ClassroomPeople;
