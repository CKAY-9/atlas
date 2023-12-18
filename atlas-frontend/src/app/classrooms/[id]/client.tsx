"use client"

import { ClassroomDTO } from "@/api/classrooms/dto"
import { UserDTO } from "@/api/users/dto"
import style from "./classroom.module.scss";
import UserChip from "@/components/user-chip/user-chip";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { getAllUsersFromIDs } from "@/api/users/user";
import LoadingWheel from "@/components/loading/loading";
import Link from "next/link";
import Image from "next/image";
import Popup from "@/components/popup/popup";
import { createNewAnnouncement, getAllAnnouncementsFromIDs } from "@/api/announcements/announcement";
import { AnnouncementDTO } from "@/api/announcements/dto";
import { AssignmentDTO } from "@/api/assignments/dto";
import AnnouncementPreview from "@/components/announcement-preview/announcement";

export const ClassroomContainer = (props: {
  user: UserDTO,
  classroom: ClassroomDTO
}) => {
  const [show_code, setShowCode] = useState<boolean>(false);
  const [announcment_content, setAnnouncmentContent] = useState<string>("");
  const [announcements, setAnnouncements] = useState<AnnouncementDTO[]>([]);
  const [feed, setFeed] = useState<any[]>([]);

  const is_teacher = props.classroom.teacher_ids.includes(props.user.id);

  useEffect(() => {
    (async () => {
      const temp_announcements = await getAllAnnouncementsFromIDs(props.classroom.announcement_ids);
      setAnnouncements(temp_announcements);
    })();
  }, [props.classroom]);

  const createAnnouncement = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const creation = await createNewAnnouncement(announcment_content, props.classroom.id);
    if (creation !== null) {
      window.location.href = `/classrooms/${props.classroom.id}/announcements/${creation}`;
      return;
    }
  }
  
  return (
    <>
      {show_code &&
        <Popup>
          <button style={{"textAlign": "left"}} onClick={() => setShowCode(false)}>X</button>
          <div style={{"textAlign": "center"}}>
            <h2>Classroom Code</h2>
            <h1>{props.classroom.code}</h1>
          </div>
        </Popup>
      }
      <div className={style.classroom_container}>
        <div className={style.side_bar}>
          {is_teacher && 
            <section style={{"textAlign": "center"}}>
              <button className="minimal" onClick={() => setShowCode(true)}>
                <Image 
                  src="/icons/open.svg"
                  alt="Open"
                  sizes="100%"
                  width={0}
                  height={0}
                  style={{"width": "1rem", "height": "1rem", "filter": "invert(1)"}}
                />
              </button>
              <h2>Code</h2>
              <span>{props.classroom.code}</span>
            </section>
          }
          <section>
            <Link href={`/classrooms/${props.classroom.id}/assignments`}>View Assignments</Link>
            <Link href={`/classrooms/${props.classroom.id}/announcements`}>View Announcements</Link>
          </section>
        </div>
        <div className={style.feeds}>
          <div className={style.create_announcment}>
            <input minLength={1} type="text" placeholder="Announce something to your class!" onChange={(e: BaseSyntheticEvent) => setAnnouncmentContent(e.target.value)} />
            <button onClick={createAnnouncement} style={{"opacity": announcment_content.length <= 0 ? "0.5" : "1"}} disabled={announcment_content.length <= 0}>Post</button>
          </div>
          {(props.classroom.announcement_ids.length <= 0 && props.classroom.assignment_ids.length <= 0)
            ? <div style={{
              "opacity": "0.5", 
              "display": "flex", 
              "flexDirection": "column",
              "alignItems": "center", 
              "textAlign": "center", 
              "justifyContent": 
              "center", 
              "padding": "2rem 0"
            }}>
              <Image 
                src="/icons/sad.svg"
                alt="Nothing"
                sizes="100%"
                width={0}
                height={0}
                style={{"width": "5rem", "height": "5rem", "filter": "invert(1)"}}
              />
              <h2>This class is empty.</h2>
            </div>
            : <div className={style.feed}>
              {announcements.map((announcement: AnnouncementDTO, index: number) => {
                return (
                  <Link key={index} href={`/classrooms/${announcement.classroom_id}/announcements/${announcement.id}`}>
                    <AnnouncementPreview announcement={announcement} /> 
                  </Link>
                );
              })}
            </div>
          }
        </div>
      </div>
    </>
  )
}

export const ClassroomBanner = (props: {
  user: UserDTO,
  classroom: ClassroomDTO
}) => {
  const [teachers, setTeachers] = useState<UserDTO[]>([]);
  const [loading_teachers, setLoadingTeachers] = useState<boolean>(false);
  const [showing_description, setShowingDescription] = useState<boolean>(false);

  const is_teacher = props.classroom.teacher_ids.includes(props.user.id);

  useEffect(() => {
    (async () => {
      const temp_teachers = await getAllUsersFromIDs(props.classroom.teacher_ids);
      setTeachers(temp_teachers);
    })();
  }, [props.classroom]);

  return (
    <>
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
            <button className="minimal">
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
