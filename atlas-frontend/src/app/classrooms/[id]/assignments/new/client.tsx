"use client"

import { ClassroomDTO } from "@/api/classrooms/dto";
import { UserDTO } from "@/api/users/dto";
import style from "./new.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import { setConfig } from "next/config";
import { createNewAnnouncement } from "@/api/announcements/announcement";

const NewAssignmentClient = (props: {
  classroom: ClassroomDTO,
  user: UserDTO
}) => {
  const [view, setView] = useState<string>("assignment");
  const [content, setContent] = useState<string>("");

  const newAnnouncement = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const creation = await createNewAnnouncement(content, props.classroom.id);
    if (creation === null) {
      window.location.href = `/classrooms/${props.classroom.id}/announcements/${creation}`;
      return;
    }
  }

  return (
    <div className={style.new_container}>
      <label>Type</label>
      <select onChange={(e: BaseSyntheticEvent) => setView(e.target.value)}>
        <option value="assignment">Assignment</option>
        <option value="material">Material</option>
        <option value="announcement">Announcement</option>
      </select>
      {view === "assignment" &&
        <>
          <label>Description</label>
          <textarea cols={30} rows={10} onChange={(e: BaseSyntheticEvent) => setContent(e.target.value)} />
          <label>Rubric</label>
          <span>TODO: Add rubrics</span>
          <label>Attachments</label>
          <span>TODO: Add attachments</span>
          <button style={{"width": "fit-content"}}>Create Assignment</button>
        </>
      }
      {view === "material" &&
        <>
          <label>Description</label>
          <textarea cols={30} rows={10} onChange={(e: BaseSyntheticEvent) => setContent(e.target.value)} />
          <label>Attachments</label>
          <span>TODO: Add attachments</span>
          <button style={{"width": "fit-content"}}>Create Material</button>
        </>
      }
      {view === "announcement" &&
        <>
          <label>Content</label>
          <textarea cols={30} rows={10} onChange={(e: BaseSyntheticEvent) => setContent(e.target.value)} />
          <button onClick={newAnnouncement} style={{"width": "fit-content"}}>Create Announcement</button>
        </>
      }
    </div>
  );
}

export default NewAssignmentClient
