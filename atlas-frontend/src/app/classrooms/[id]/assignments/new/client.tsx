"use client"

import { ClassroomDTO } from "@/api/classrooms/dto";
import { UserDTO } from "@/api/users/dto";
import style from "./new.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { createNewAnnouncement } from "@/api/announcements/announcement";
import { createNewAssignment } from "@/api/assignments/assignment";
import Popup from "@/components/popup/popup";
import { UnitDTO } from "@/api/units/dto";
import { createNewCourseUnit, getAllUnitsFromIds, getCourseUnitFromID } from "@/api/units/unit";

const NewAssignmentClient = (props: {
  classroom: ClassroomDTO,
  user: UserDTO
}) => {
  const [view, setView] = useState<string>("assignment");
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [show_units, setShowUnits] = useState<boolean>(false);
  const [selected_unit, setSelectedUnit] = useState<UnitDTO | null>(null);
  const [show_new_unit, setShowNewUnit] = useState<boolean>(false);
  const [new_unit_name, setNewUnitName] = useState<string>("");
  const [existing_units, setExistingUnits] = useState<UnitDTO[]>([]);
  const [selected_unit_id, setSelectedUnitID] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const units = await getAllUnitsFromIds(props.classroom.unit_ids);
      setExistingUnits(units);

      const selected_unit = await getCourseUnitFromID(selected_unit_id);
      setSelectedUnit(selected_unit);
    })();
  }, [props.classroom, selected_unit_id]);

  const newAnnouncement = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const creation = await createNewAnnouncement(content, props.classroom.id);
    if (creation !== null) {
      window.location.href = `/classrooms/${props.classroom.id}/announcements/${creation}`;
      return;
    }
  }

  const newAssignment = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const date = new Date();
    const creation = await createNewAssignment(name, content, props.classroom.id, selected_unit_id, 0, date.toISOString(), []);
    if (creation !== null) {
      window.location.href = `/classrooms/${props.classroom.id}/assignments/${creation}`;
      return;
    }
  }

  const newUnit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const creation = await createNewCourseUnit(new_unit_name, "No description provided.", props.classroom.id);
    if (creation !== null) {
      const units = await getAllUnitsFromIds(props.classroom.unit_ids);
      setExistingUnits(units);
      setSelectedUnitID(creation);
      setShowUnits(false);
      return;
    }
  }

  return (
    <>
      {show_units &&
        <Popup close={() => setShowUnits(false)}>
          <h1>Choose a Unit</h1>
          <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem", "marginBottom": "1rem"}}>
            {existing_units.map((unit: UnitDTO, index: number) => {
              return (<button style={{"padding": "0.5rem 1rem", "opacity": "1"}} onClick={() => {
                setSelectedUnitID(unit.id);
                setShowUnits(false);
              }} key={index}>{unit.name}</button>)
            })}
          </div>
          <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem", "width": "100%"}}>
            <button style={{"padding": "0.5rem 1rem", "opacity": "1", "width": "100%"}} onClick={() => setShowNewUnit(!show_new_unit)}>Create a New Unit</button>
            <section style={{"display": show_new_unit ? "flex" : "none", "gap": "1rem"}}>
              <input type="text" placeholder="Unit name" onChange={(e: BaseSyntheticEvent) => setNewUnitName(e.target.value)} />
              <button onClick={newUnit}>Create</button>
            </section>
          </div>
        </Popup>
      }
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
            <section style={{"display": "flex", "gap": "1rem", "alignItems": "center"}}>
              <span>Unit: {selected_unit === null ? "None" : selected_unit.name}</span>
              <button onClick={() => setShowUnits(true)}>Select Unit</button>
            </section>
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
            <label>Unit</label>
            <section style={{"display": "flex", "gap": "1rem", "alignItems": "center"}}>
              <span>Unit: {selected_unit === null ? "None" : selected_unit.name}</span>
              <button onClick={() => setShowUnits(true)}>Select Unit</button>
            </section>
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
