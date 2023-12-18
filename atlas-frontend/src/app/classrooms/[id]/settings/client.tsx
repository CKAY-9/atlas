"use client"

import { ClassroomDTO } from "@/api/classrooms/dto"
import style from "./settings.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import { updateClassroomFromID } from "@/api/classrooms/classroom";

const ClassroomSettingsClient = (props: {
  classroom: ClassroomDTO
}) => {
  const [name, setName] = useState<string>(props.classroom.name);
  const [description, setDescription] = useState<string>(props.classroom.description);

  const update = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const update_results = await updateClassroomFromID(props.classroom.id, name, description);
    if (update_results !== null) {
      window.location.reload();
      return;
    }
  }

  return (
    <div className={style.settings}>
      <section>
        <label>Course Name</label>
        <input type="text" placeholder="Course Name" defaultValue={name} onChange={(e: BaseSyntheticEvent) => setName(e.target.value)} />
      </section>
      <section>
        <label>Course Description</label>
        <input type="text" placeholder="Course Description" defaultValue={description} onChange={(e: BaseSyntheticEvent) => setDescription(e.target.value)} />
      </section>
      <button onClick={update} style={{"width": "fit-content"}}>Update</button>
    </div>
  );
}

export default ClassroomSettingsClient;
