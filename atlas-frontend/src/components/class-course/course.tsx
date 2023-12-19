"use client"

import { ClassroomDTO } from "@/api/classrooms/dto"
import { UserDTO } from "@/api/users/dto"
import style from "./course.module.scss"
import { useEffect, useState } from "react"
import { AnnouncementDTO } from "@/api/announcements/dto"
import { AssignmentDTO } from "@/api/assignments/dto"
import { getAllAnnouncementsFromIDs } from "@/api/announcements/announcement"
import { getAllAssignmentsFromIDs } from "@/api/assignments/assignment"
import Link from "next/link"
import Image from "next/image"
import AnnouncementPreview from "../announcement-preview/announcement"
import AssignmentPreview from "../assignment-preview/assignment"
import LoadingWheel from "../loading/loading"

const ClassroomCourse = (props: {
  user: UserDTO,
  classroom: ClassroomDTO
}) => {
  const [announcements, setAnnouncements] = useState<AnnouncementDTO[]>([]);
  const [assignments, setAssignments] = useState<AssignmentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [show_assignments, setShowAssignments] = useState<boolean>(false);
  const [show_announcements, setShowAnnouncements] = useState<boolean>(false);


  useEffect(() => {
    (async () => {
      const temp_announcements = await getAllAnnouncementsFromIDs(props.classroom.announcement_ids);
      const temp_assignments = await getAllAssignmentsFromIDs(props.classroom.assignment_ids);
      setAnnouncements(temp_announcements);
      setAssignments(temp_assignments);
      setLoading(false);
    })();
  }, [props.classroom]);

  if (loading) {
    return (<LoadingWheel size_in_rems={5} />);
  }

  return (
    <div className={style.course}>
      <div className={style.section}>
        <button onClick={() => setShowAssignments(!show_assignments)}>
          <h1>Units / Assignments</h1>
          <Image 
            src="/icons/expand.svg"
            alt="Expand"
            sizes="100%"
            width={0}
            height={0}
            style={{"transform": show_assignments ? "rotate(180deg)" : "rotate(0deg)"}}
          />
        </button>
        {assignments.length <= 0 && <span>There are no assignments to do.</span>} 
       
        <div className={style.list} style={{"display": show_assignments ? "flex" : "none"}}>
          {assignments.map((assignment: AssignmentDTO, index: number) => {
            return (
              <Link key={index} href={`/classrooms/${assignment.classroom_id}/assignments/${assignment.id}`}>
                <AssignmentPreview assignment={assignment} />
              </Link>
            );
          })}
        </div>
      </div>
      <div className={style.section}>
        <button onClick={() => setShowAnnouncements(!show_announcements)}>
          <h1>Announcements</h1>
          <Image 
            src="/icons/expand.svg"
            alt="Expand"
            sizes="100%"
            width={0}
            height={0}
            style={{"transform": show_announcements ? "rotate(180deg)" : "rotate(0deg)"}}
          />
        </button>
        {announcements.length <= 0 && <span>There are no announcements to see.</span>}
        <div className={style.list} style={{"display": show_assignments ? "flex" : "none"}}>
          {announcements.map((announcement: AnnouncementDTO, index: number) => {
            return (
              <Link key={index} href={`/classrooms/${announcement.classroom_id}/assignments/${announcement.id}`}>
                <AnnouncementPreview announcement={announcement} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ClassroomCourse;
