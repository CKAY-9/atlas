"use client"

import { ClassroomDTO } from "@/api/classrooms/dto";
import { UserDTO } from "@/api/users/dto";
import style from "./new.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import { createNewAnnouncement } from "@/api/announcements/announcement";
import { createNewAssignment } from "@/api/assignments/assignment";

const NewAssignmentClient = (props: {
  classroom: ClassroomDTO,
  user: UserDTO
}) => {
  const [view, setView] = useState<string>("assignment");
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");

  const newAnnouncement = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const creation = await createNewAnnouncement(content, props.classroom.id);
    if (creation === null) {
      window.location.href = `/classrooms/${props.classroom.id}/announcements/${creation}`;
      return;
    }
  }

  const newAssignment = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const date = new Date();
    const creation = await createNewAssignment(name, content, props.classroom.id, 0, 0, date.toISOString(), []);
    if (creation !== null) {
      window.location.href = `/classrooms/${props.classroom.id}/assignments/${creation}`;
      return;
    }
  }

  return (
    <>
      <div className={style.new_container}>
        <label>Type</label>
        <select onChange={(e: BaseSyntheticEvent) => setView(e.target.value)}>
          <option value="assignment">Assignment</option>
          <option value="material">Material</option>
          <option value="announcement">Announcement</option>
        </select>
        {view === "assignment" &&
          <>
            <label>Title</label>
            <input onChange={(e: BaseSyntheticEvent) => setName(e.target.value)} type="text" minLength={1} placeholder="Assignment Title" />
            <label>Description</label>
            <textarea placeholder="Assignment Description" cols={30} rows={10} onChange={(e: BaseSyntheticEvent) => setContent(e.target.value)} />
            <label>Rubric</label>
            <span>TODO: Add rubrics</span>
            <label>Attachments</label>
            <span>TODO: Add attachments</span>
            <button onClick={newAssignment} style={{"width": "fit-content"}}>Create Assignment</button>
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
    </>
  );
}

export default NewAssignmentClient
