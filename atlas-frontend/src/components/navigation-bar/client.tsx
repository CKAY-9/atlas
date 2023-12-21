"use client"

import { ClassroomDTO } from "@/api/classrooms/dto";
import Image from "next/image";
import style from "./nav-bar.module.scss";
import ClassChip from "../classroom-chip/class-chip";
import { useEffect, useState } from "react";
import { getAllClassesFromIDs } from "@/api/classrooms/classroom";
import { UserDTO } from "@/api/users/dto";
import LoadingWheel from "../loading/loading";
import Link from "next/link";

export const Classrooms = (props: {
  user: UserDTO | null
}) => {
  if (props.user === null) return;

  const [classes, setClasses] = useState<ClassroomDTO[]>([]);
  const [loading_classes, setLoadingClasses] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const teaching_classes = await getAllClassesFromIDs(props.user?.teaching_classes || []);
      const enrolled_classes = await getAllClassesFromIDs(props.user?.enrolled_classes || []); 
      setClasses(enrolled_classes.concat(teaching_classes));
      setLoadingClasses(false);
    })();
  }, [props.user]);

  if (loading_classes) {
    return (
      <>
        <LoadingWheel size_in_rems={2} />
      </>
    )
  }

  return (
    <>
      {classes.map((classroom: ClassroomDTO, index: number) => {
        return (<Link key={index} className={style.class} href={`/classrooms/${classroom.id}`}><ClassChip classroom={classroom} key={index} /></Link>)
      })}
    </>
  )
}

export const CurrentClassroom = (props: {
  classroom: ClassroomDTO
}) => {
  const [show_info, setShowInfo] = useState<boolean>(false);

  return (
    <>
      <div className={style.classroom}>
        <button onClick={() => setShowInfo(!show_info)} className={`${style.current_class} + minimal`}>
          <ClassChip classroom={props.classroom} />
          <Image 
            src="/icons/expand.svg"
            alt="Expand"
            sizes="100%"
            width={0}
            height={0}
            style={{"filter": "invert(1)", "transform": show_info ? "rotate(180deg)" : "rotate(0deg)"}}
          />
        </button>
        {show_info &&
          <div className={style.info}>
            <span>Teachers: {props.classroom.teacher_ids.length}</span>
            <span>Students: {props.classroom.student_ids.length}</span>
          </div>
        }
      </div>
      <div className={style.seperator}></div>
    </>
  );
}

