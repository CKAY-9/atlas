"use client"

import { UserDTO } from "@/api/users/dto";
import style from "./banner.module.scss";
import { ClassroomDTO } from "@/api/classrooms/dto";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { getAllUsersFromIDs } from "@/api/users/user";
import Image from "next/image";
import Link from "next/link";
import LoadingWheel from "../loading/loading";
import UserChip from "../user-chip/user-chip";
import Popup from "../popup/popup";
import DeleteButton from "../delete-button/delete";
import { deleteClassroomFromID } from "@/api/classrooms/classroom";

const ClassroomBanner = (props: {
  user: UserDTO,
  classroom: ClassroomDTO
}) => {
  const [teachers, setTeachers] = useState<UserDTO[]>([]);
  const [loading_teachers, setLoadingTeachers] = useState<boolean>(false);
  const [showing_description, setShowingDescription] = useState<boolean>(false);
  const [confirm_delete, setConfirmDelete] = useState<boolean>(false);

  const is_teacher = props.classroom.teacher_ids.includes(props.user.id);

  useEffect(() => {
    (async () => {
      const temp_teachers = await getAllUsersFromIDs(props.classroom.teacher_ids);
      setTeachers(temp_teachers);
    })();
  }, [props.classroom]);

  const deleteClassroom = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const deletion = await deleteClassroomFromID(props.classroom.id);
    if (deletion) {
      window.location.href = "/";
      return;
    }
  }

  return (
    <>
      {confirm_delete && 
        <Popup close={() => setConfirmDelete(false)}>
          <div>
            <h1>Confirm Deletion</h1>
            <section style={{"display": "flex", "gap": "1rem"}}>
              <DeleteButton on_click={deleteClassroom} text="Confirm" />
              <button onClick={() => setConfirmDelete(false)}>Nevermind</button>
            </section>
          </div>
        </Popup>
      }
      <div className={style.banner}>
        {is_teacher &&
          <div className={style.teacher_tools}>
            <Link href={`/classrooms/${props.classroom.id}/assignments/new`}>
              <Image 
                src="/icons/edit.svg"
                alt="Edit"
                sizes="100%"
                width={0}
                height={0}
              />
            </Link> 
            <Link href={`/classrooms/${props.classroom.id}/settings`}>
              <Image 
                src="/icons/settings.svg"
                alt="Settings"
                sizes="100%"
                width={0}
                height={0}
              />
            </Link> 
            <button onClick={() => setConfirmDelete(true)} className="minimal">
              <Image 
                src="/icons/delete.svg"
                alt="Delete"
                sizes="100%"
                width={0}
                height={0}
              />
            </button> 
          </div>
        }
        <div className={style.info}>
          <h1>{props.classroom.name}</h1>
          {(loading_teachers || teachers.length <= 0) 
            ? <LoadingWheel size_in_rems={2} />
            : <div className={style.interact}>
              <Link href={`/users/${teachers[0].id}`}>
                <UserChip user={teachers[0]} />
              </Link>
              <button onClick={() => setShowingDescription(!showing_description)} className={`minimal + ${style.expand}`}>
                <Image 
                  src="/icons/expand.svg"
                  alt="Expand"
                  sizes="100%"
                  width={0}
                  height={0}
                  style={{"transform": showing_description ? "rotate(180deg)" : "rotate(0deg)"}}
                />
              </button>
            </div>
          }
          {showing_description && <p>{props.classroom.description}</p>}
        </div>
      </div>
    </>
  );
}

export default ClassroomBanner;
