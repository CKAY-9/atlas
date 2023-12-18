"use client"

import Image from "next/image";
import style from "./header.module.scss";
import HeaderDropdown from "./header-dropdown";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import Popup from "../popup/popup";
import { createNewClassroom, getAllClassesFromIDs, joinClassroomFromCode } from "@/api/classrooms/classroom";
import { UserDTO } from "@/api/users/dto";
import { ClassroomDTO } from "@/api/classrooms/dto";
import LoadingWheel from "../loading/loading";
import ClassChip from "../classroom-chip/class-chip";
import Link from "next/link";

const PickAClassPopup = (props: {
  user: UserDTO | null
}) => {
  if (props.user === null) return;
  const [classes, setClasses] = useState<ClassroomDTO[]>([]);
  const [loading_classes, setLoadingClasses] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const temp_classes = await getAllClassesFromIDs(props.user?.teaching_classes || []);
      setClasses(temp_classes);
      setLoadingClasses(false);
    })();
  }, [props.user]);

  if (loading_classes) {
    return (
      <>
        <LoadingWheel size_in_rems={5} />
      </>
    )
  }

  return (
    <>
      <h2>Pick a Class</h2>
      <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
      {classes.map((classroom: ClassroomDTO, index: number) => {
        return (
          <Link href={`/classrooms/${classroom.id}/assignments/new`}>
            <ClassChip classroom={classroom} key={index} />
          </Link>
        );
      })} 
      </div>
    </>
  );
}

const HeaderClient = (props: {
  user: UserDTO | null
}) => {
  const [show_new_classroom, setShowNewClassroom] = useState<boolean>(false);
  const [new_classroom_name, setNewClassroomName] = useState<string>("");

  const [show_join_classroom, setShowJoinClassroom] = useState<boolean>(false);
  const [join_classroom_code, setJoinClassroomCode] = useState<string>("");

  const [show_new_assignment, setShowNewAssignment] = useState<boolean>(false);

  const createClassroom = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const classroom_creation = await createNewClassroom(new_classroom_name);
    if (classroom_creation !== null) {
      window.location.href = `/classrooms/${classroom_creation}`;
      return;
    }
  }

  const joinClass = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const join_classroom = await joinClassroomFromCode(join_classroom_code);
    if (join_classroom !== null) {
      window.location.href = `/classrooms/${join_classroom}`;
      return;
    }
  }

  return (
    <>
      {show_new_classroom &&
        <Popup>
          <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
            <button onClick={() => setShowNewClassroom(false)} className="minimal">X</button>
            <h1>Create a Classroom</h1>
            <label>Classroom Name</label>
            <input minLength={3} maxLength={100} type="text" placeholder="Name" onChange={(e: BaseSyntheticEvent) => setNewClassroomName(e.target.value)} />
            <button onClick={createClassroom} style={{"opacity": new_classroom_name.length <= 2 ? "0.5" : "1"}} disabled={new_classroom_name.length <= 2}>Create</button>
          </div>
        </Popup>
      }
      {show_new_assignment &&
        <Popup>
          <button onClick={() => setShowNewAssignment(false)} className="minimal">X</button>
          <PickAClassPopup user={props.user} />
        </Popup>
      }
      {show_join_classroom &&
        <Popup>
          <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
            <button onClick={() => setShowJoinClassroom(false)} className="minimal">X</button>
            <h1>Join a Classroom</h1>
            <label>Classroom Code</label>
            <input minLength={6} maxLength={12} type="text" placeholder="Code" onChange={(e: BaseSyntheticEvent) => setJoinClassroomCode(e.target.value)} />
            <button onClick={joinClass} style={{"opacity": join_classroom_code.length <= 5 ? "0.5" : "1"}} disabled={join_classroom_code.length <= 5}>Join</button>
          </div>
        </Popup>
      }
      <HeaderDropdown id="add">
        <>
          <button onClick={() => setShowNewClassroom(true)} className={`${style.nav_link} + minimal`}>
            <Image 
              src="/icons/create_classroom.svg"
              alt="Create a Classroom"
              sizes="100%"
              width={0}
              height={0}
              className={style.nav_icon}
            />
            <span>Create a Classroom</span>
          </button>
          {((props.user !== null && props.user !== undefined) && props.user.teaching_classes.length >= 1) &&
            <button onClick={() => setShowNewAssignment(true)} className={`${style.nav_link} + minimal`}>
              <Image 
                src="/icons/add.svg"
                alt="Create a new Assignment"
                sizes="100%"
                width={0}
                height={0}
                className={style.nav_icon}
              />
              <span>Create an Assignment</span>
            </button>
          }
          <button onClick={() => setShowJoinClassroom(true)} className={`${style.nav_link} + minimal`}>
            <Image 
              src="/icons/school.svg"
              alt="Join a Classroom"
              sizes="100%"
              width={0}
              height={0}
              className={style.nav_icon}
            />
            <span>Join a Classroom</span>
          </button>
        </>
      </HeaderDropdown>
    </>
  );
}

export default HeaderClient;
