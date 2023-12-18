"use client"

import { UserDTO } from "@/api/users/dto";
import Header from "../header/header";
import NavigationBar from "../navigation-bar/nav-bar";
import style from "./wrapper.module.scss";
import { ClassroomDTO } from "@/api/classrooms/dto";
import { AssignmentDTO } from "@/api/assignments/dto";

export interface WrapperProps {
  user: UserDTO | null,
  current_classroom: ClassroomDTO | null,
  current_assignment: AssignmentDTO | null,
  children: any
}

const AtlasWrapper = (props: WrapperProps): JSX.Element => {
  return (
    <main className={style.wrapper}>
      <Header user={props.user} />
      <div className={style.wrapper_container}>
        <NavigationBar user={props.user} current_assignment={props.current_assignment} current_classroom={props.current_classroom} />
        <div className="container">
          {props.children} 
        </div>
      </div>
    </main>
  );
}

AtlasWrapper.defaultProps = {
  user: null,
  current_classroom: null,
  current_assignment: null,
  children: {}
}

export default AtlasWrapper;
