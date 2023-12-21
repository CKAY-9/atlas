"use client"

import { getAllAssignmentsFromIDs, getAssignmentFromID } from "@/api/assignments/assignment"
import { AssignmentDTO } from "@/api/assignments/dto"
import { getAllClassesFromIDs } from "@/api/classrooms/classroom"
import { ClassroomDTO } from "@/api/classrooms/dto"
import { UnitDTO } from "@/api/units/dto"
import { getAllUnitsFromIds } from "@/api/units/unit"
import { UserDTO } from "@/api/users/dto"
import AssignmentPreview from "@/components/assignment-preview/assignment"
import { useEffect, useState } from "react"
import Image from "next/image"
import style from "./assignments.module.scss";
import LoadingWheel from "@/components/loading/loading"
import Link from "next/link"

const Unit = (props: {
  unit: UnitDTO
}) => {
  const [assignments, setAssignments] = useState<AssignmentDTO[]>([]);
  const [show_assignments, setShowAssignments] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const assignments_ = await getAllAssignmentsFromIDs(props.unit.assignment_ids);
      setAssignments(assignments_);
    })();
  }, [props.unit]);

  return (
    <div>
      <button onClick={() => setShowAssignments(!show_assignments)} className={style.expand}>
        <h3>{props.unit.name}</h3>
        <Image 
          src="/icons/expand.svg"
          alt="Expand"
          sizes="100%"
          width={0}
          height={0}
          style={{"transform": show_assignments ? "rotate(180deg)" : "rotate(0deg)"}}
        />
      </button>
      <section className={style.content} style={{"display": show_assignments ? "flex" : "none"}}>
        {assignments.map((assignment: AssignmentDTO, index: number) => {
          return (
            <Link href={`/classrooms/${assignment.classroom_id}/assignments/${assignment.id}`}>
            <AssignmentPreview assignment={assignment} key={index} />
            </Link>
          );
        })}
      </section>
    </div>
  );
}

const Classroom = (props: {
  classroom: ClassroomDTO
}) => {
  const [units, setUnits] = useState<UnitDTO[]>([]);
  const [no_unit_assignments, setNoUnitAssignments] = useState<AssignmentDTO[]>([]);
  const [show_content, setShowContent] = useState<boolean>(false);
  
  useEffect(() => {
    (async () => {
      const units_ = await getAllUnitsFromIds(props.classroom.unit_ids);
      setUnits(units_);

      for (let i = 0; i < props.classroom.assignment_ids.length; i++) {
        for (let k = 0; k < units_.length; k++) {
          if (!units_[k].assignment_ids.includes(props.classroom.assignment_ids[i])) {
            const assignment = await getAssignmentFromID(props.classroom.assignment_ids[i]);
            if (assignment === null) continue;
            setNoUnitAssignments((prev) => [...prev, assignment]);
          }
        }
      }
    })();
  }, [props.classroom]);

  return (
    <div className={style.classroom}>
      <button onClick={() => setShowContent(!show_content)} className={style.expand}>
        <h2>{props.classroom.name}</h2>
        <Image 
          src="/icons/expand.svg"
          alt="Expand"
          sizes="100%"
          width={0}
          height={0}
          style={{"transform": show_content ? "rotate(180deg)" : "rotate(0deg)"}}
        />
      </button>
      {props.classroom.assignment_ids.length <= 0 && <span>There are no assignments in this class.</span>}
      <section className={style.content} style={{"display": show_content ? "flex" : "none"}}>
      <div className={style.content}>
        {units.map((unit: UnitDTO, index: number) => {
          return (<Unit unit={unit} key={index} />)
        })}
        </div>
        <div className={style.content}>
          {no_unit_assignments.map((assignment: AssignmentDTO, index: number) => {
            return (<AssignmentPreview assignment={assignment} key={index} />);
          })}
        </div>
      </section>
    </div>
  );
}

const GlobalAssignmentsClient = (props: {
  user: UserDTO
}) => {
  const [classrooms, setClassrooms] = useState<ClassroomDTO[]>([]);
  const [loading_classes, setLoadingClasses] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const classes = await getAllClassesFromIDs(props.user.enrolled_classes);
      setClassrooms(classes);
      setLoadingClasses(false);
    })();
  }, [props.user]);

  if (loading_classes) {
    return (<LoadingWheel size_in_rems={5} />);
  }

  return (
    <>
      {classrooms.length <= 0 && <span>You aren't enrolled in any classes.</span>}
      {classrooms.map((classroom: ClassroomDTO, index: number) => {
        return (<Classroom classroom={classroom} key={index} />);
      })}
    </>
  );
}

export default GlobalAssignmentsClient;
