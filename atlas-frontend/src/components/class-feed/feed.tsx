import { createNewAnnouncement, getAllAnnouncementsFromIDs } from "@/api/announcements/announcement";
import { AnnouncementDTO } from "@/api/announcements/dto";
import { ClassroomDTO } from "@/api/classrooms/dto";
import { UserDTO } from "@/api/users/dto";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import Popup from "../popup/popup";
import style from "./feed.module.scss";
import Image from "next/image";
import Link from "next/link";
import AnnouncementPreview from "../announcement-preview/announcement";
import { getAllAssignmentsFromIDs } from "@/api/assignments/assignment";
import { AssignmentDTO } from "@/api/assignments/dto";
import AssignmentPreview from "../assignment-preview/assignment";

const ClassroomFeed = (props: {
  user: UserDTO,
  classroom: ClassroomDTO 
}) => {
  const [show_code, setShowCode] = useState<boolean>(false);
  const [announcment_content, setAnnouncmentContent] = useState<string>("");
  const [announcements, setAnnouncements] = useState<AnnouncementDTO[]>([]);
  const [assignments, setAssignments] = useState<AssignmentDTO[]>([]);
  const [feed, setFeed] = useState<(AssignmentDTO | AnnouncementDTO)[]>([]);

  const is_teacher = props.classroom.teacher_ids.includes(props.user.id);

  useEffect(() => {
    (async () => {
      const temp_announcements = await getAllAnnouncementsFromIDs(props.classroom.announcement_ids);
      setAnnouncements(temp_announcements);
      const temp_assignments = await getAllAssignmentsFromIDs(props.classroom.assignment_ids);
      setAssignments(temp_assignments);

      let temp_array: (AssignmentDTO | AnnouncementDTO)[] = [];
      temp_array = temp_array.concat(temp_announcements);
      temp_array = temp_array.concat(temp_assignments);
      temp_array.sort((a, b) => {
        return (new Date(a.posted).getTime()) > (new Date(b.posted).getTime()) ? 1 : -1;
      });
      temp_array = temp_array.reverse();
      setFeed(temp_array);
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
        <Popup close={() => setShowCode(false)}>
          <div style={{"textAlign": "center"}}>
            <h2>Classroom Code</h2>
            <h1>{props.classroom.code}</h1>
          </div>
        </Popup>
      }
      <div className={style.classroom_feed}>
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
              {feed.map((feed_entry: (AssignmentDTO | AnnouncementDTO), index: number) => {
                if (Object.keys(feed_entry).includes("name")) {
                  return (
                    <Link key={index} href={`/classrooms/${feed_entry.classroom_id}/assignments/${feed_entry.id}`}>
                      <AssignmentPreview assignment={feed_entry as AssignmentDTO} /> 
                    </Link>
                  );
                } else {
                  return (
                    <Link key={index} href={`/classrooms/${feed_entry.classroom_id}/announcements/${feed_entry.id}`}>
                      <AnnouncementPreview announcement={feed_entry as AnnouncementDTO} /> 
                    </Link>
                  );
                }
              })}
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default ClassroomFeed;
