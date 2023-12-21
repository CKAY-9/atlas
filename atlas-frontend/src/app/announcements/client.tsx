"use client"

import { getAllAnnouncementsFromIDs } from "@/api/announcements/announcement";
import { AnnouncementDTO } from "@/api/announcements/dto";
import { getAllClassesFromIDs } from "@/api/classrooms/classroom";
import { ClassroomDTO } from "@/api/classrooms/dto";
import { UnitDTO } from "@/api/units/dto";
import { UserDTO } from "@/api/users/dto";
import LoadingWheel from "@/components/loading/loading";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import style from "./announcements.module.scss";
import AnnouncementPreview from "@/components/announcement-preview/announcement";

const Classroom = (props: {
  classroom: ClassroomDTO
}) => {
  const [announcements, setAnnouncements] = useState<AnnouncementDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showing, setShowing] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const all_announcements = await getAllAnnouncementsFromIDs(props.classroom.announcement_ids);
      setAnnouncements(all_announcements);
      setLoading(false);
    })();
  })

  if (loading) {
    return (<LoadingWheel size_in_rems={2} />)
  }

  return (
    <div>
      <button onClick={() => setShowing(!showing)} className={style.expand}>
        <h2>{props.classroom.name}</h2>
        <Image 
          src="/icons/expand.svg"
          alt="Expand"
          sizes="100%"
          width={0}
          height={0}
          style={{"transform": showing ? "rotate(180deg)" : "rotate(0deg)"}}
        />
      </button>
      <div className={style.content} style={{"display": showing ? "flex" : "none"}}>
      {announcements.map((announcement: AnnouncementDTO, index: number) => {
        return (
          <Link key={index} href={`/classrooms/${announcement.classroom_id}/announcements/${announcement.id}`}>
            <AnnouncementPreview announcement={announcement} />
          </Link>
        );
      })}
      </div>
    </div>
  )
}

const GlobalAnnouncementsClient = (props: {
  user: UserDTO
}) => {
  const [classes, setClasses] = useState<ClassroomDTO[]>([]);
  const [loading_classes, setLoadingClasses] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const all_classes = await getAllClassesFromIDs(props.user.enrolled_classes);
      setClasses(all_classes);
      setLoadingClasses(false);
    })();
  }, []);

  if (loading_classes) {
    return (<LoadingWheel size_in_rems={5} />);
  }

  if (classes.length <= 0) {
    return (<span>You aren't enrolled in any classes.</span>);
  }

  return (
    <div className={style.content}>
      {classes.map((classroom: ClassroomDTO, index: number) => {
        return (<Classroom key={index} classroom={classroom} />);
      })}
    </div>
  );
}

export default GlobalAnnouncementsClient;
