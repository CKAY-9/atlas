"use client"

import { ClassroomDTO } from "@/api/classrooms/dto"
import { UserDTO } from "@/api/users/dto"
import style from "./classroom.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import ClassroomBanner from "@/components/class-banner/banner";
import ClassroomFeed from "@/components/class-feed/feed";
import { useSearchParams } from "next/navigation";
import ClassroomPeople from "@/components/class-people/people";

const ClassroomContainer = (props: {
  user: UserDTO,
  classroom: ClassroomDTO
}) => {
  const search_params = useSearchParams();
  const query_view = search_params.get("view");
  const [view, setView] = useState<number>(0);

  useEffect(() => {
    if (query_view !== null) {
      switch (query_view.toLowerCase()) {
        case "feed":
          setView(0);
          break;
        case "course":
          setView(1);
          break;
        case "people":
          setView(2);
          break;
      }
    }
  }, [query_view]);

  const changeView = (set_view: number) => {
    setView(set_view);
  }
  
  return (
    <div className={style.classroom}>
      <nav className={style.nav}>
        <button onClick={() => changeView(0)} className="minimal">
          Feed
        </button>
        <button onClick={() => changeView(1)} className="minimal">
          Course
        </button>
        <button onClick={() => changeView(2)} className="minimal">
          People
        </button>
      </nav>
      <div style={{"display": view === 0 ? "block" : "none"}}>
        <ClassroomBanner classroom={props.classroom} user={props.user} />
        <ClassroomFeed classroom={props.classroom} user={props.user} />
      </div>
      <div style={{"display": view === 1 ? "block" : "none"}}>
      </div>
      <div style={{"display": view === 2 ? "block" : "none"}}>
        <ClassroomPeople classroom={props.classroom} />
      </div>
    </div>
  );
}

export default ClassroomContainer;
