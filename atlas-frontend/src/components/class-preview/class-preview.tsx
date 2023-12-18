import { ClassroomDTO } from "@/api/classrooms/dto";
import style from "./class-preview.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserDTO } from "@/api/users/dto";
import { getAllUsersFromIDs } from "@/api/users/user";
import LoadingWheel from "../loading/loading";
import UserChip from "../user-chip/user-chip";

const ClassPreview = (props: {
  class: ClassroomDTO
}) => {
  const [teachers, setTeachers] = useState<UserDTO[]>([]);
  const [loading_teachers, setLoadingTeachers] = useState<boolean>(false);

  if (props.class.teacher_ids.length <= 0) {
    return (<></>);
  }

  useEffect(() => {
    (async () => {
      const temp_teachers = await getAllUsersFromIDs(props.class.teacher_ids);
      setTeachers(temp_teachers);
      setLoadingTeachers(false);
    })(); 
  }, [props.class]);

  return (
    <Link className={style.preview} href={`/classrooms/${props.class.id}`}>
      <div className={style.banner} style={{"backgroundImage": `url(${props.class.banner})`}}>
        <div className={style.info}>
          <span className={style.name}>{props.class.name}</span>
          <div className={style.teacher}>
            {(loading_teachers || teachers.length <= 0) 
              ? <LoadingWheel size_in_rems={2} /> 
              : <>
                <UserChip user={teachers[0]} />
              </>
            }
          </div>
        </div>
      </div>
      <div className={style.about}>
        <span>{props.class.description}</span>
      </div>
      <div className={style.stats}>
        <section>
          <Image 
            src="/icons/person.svg"
            alt="People in classroom"
            sizes="100%"
            width={0}
            height={0}
          />
          <span>{props.class.student_ids.length + props.class.teacher_ids.length}</span>
        </section>
        <section>
          <Image 
            src="/icons/school.svg"
            alt="Teachers in classroom"
            sizes="100%"
            width={0}
            height={0}
          />
          <span>{props.class.teacher_ids.length}</span>

        </section>
      </div>
    </Link>
  )
}

export default ClassPreview;
