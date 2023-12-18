"use client"

import { getAllAnnouncementsFromIDs } from "@/api/announcements/announcement"
import { AnnouncementDTO } from "@/api/announcements/dto"
import { ClassroomDTO } from "@/api/classrooms/dto"
import { UserDTO } from "@/api/users/dto"
import AnnouncementPreview from "@/components/announcement-preview/announcement"
import LoadingWheel from "@/components/loading/loading"
import Link from "next/link"
import { useEffect, useState } from "react"
import style from "./announcements.module.scss";

const AnnouncementsClient = (props: {
  user: UserDTO,
  classroom: ClassroomDTO
}) => {
  const [announcements, setAnnouncements] = useState<AnnouncementDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const temp_announcements = await getAllAnnouncementsFromIDs(props.classroom.announcement_ids);
      setAnnouncements(temp_announcements);
      setLoading(false);
    })();
  }, [props.classroom]);

  if (loading) {
    return (<LoadingWheel size_in_rems={5} />);
  }

  return (
    <>
      {props.classroom.announcement_ids.length <= 0 
      ? <span>There are no announcements to see.</span>
      : <div className={style.announcements}>
          {announcements.map((announcement: AnnouncementDTO, index: number) => {
            return (
              <Link href={`/classrooms/${announcement.classroom_id}/announcements/${announcement.id}`}>
                <AnnouncementPreview announcement={announcement} />
              </Link>
            );
          })}
        </div>
      }
    </>
  );
}

export default AnnouncementsClient;
