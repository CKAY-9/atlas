"use client"

import { getAllClassesFromIDs } from "@/api/classrooms/classroom";
import { ClassroomDTO } from "@/api/classrooms/dto";
import { UserDTO } from "@/api/users/dto";
import LoadingWheel from "@/components/loading/loading";
import style from "./home.module.scss";
import { useEffect, useState } from "react";
import ClassPreview from "@/components/class-preview/class-preview";

const HomeClient = (props: {
  user: UserDTO
}) => {
  const [enrolled_classrooms, setEnrolledClassrooms] = useState<ClassroomDTO[]>([]);
  const [teaching_classrooms, setTeachingClassrooms] = useState<ClassroomDTO[]>([]);
  const [loading_classrooms, setLoadingClassrooms] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const teaching = await getAllClassesFromIDs(props.user.teaching_classes);
      const enrolled = await getAllClassesFromIDs(props.user.enrolled_classes);
      setTeachingClassrooms(teaching);
      setEnrolledClassrooms(enrolled);
      setLoadingClassrooms(false);
    })();
  }, [props.user]);

  return (
    <div className={style.sections}>
      <section>
        <h2>Announcments</h2>
        <span>You have no announcments to see.</span>
      </section>
      <section>
        <h2>Assignments</h2>
        <span>You have no assignments to do.</span>
      </section>
      <section>
        <h2>Classes</h2>
        {loading_classrooms 
          ? <>
            <LoadingWheel size_in_rems={5} />
            <span>Loading classes...</span>
          </>
          : <>
            <h3>Teaching</h3>
            {teaching_classrooms.length <= 0
              ? <span>You aren't teaching any classes.</span>
              : <div className={style.classes}>
                {teaching_classrooms.map((classroom: ClassroomDTO, index: number) => {
                  return (<ClassPreview class={classroom} key={index} />);
                })} 
              </div>
            }
            <h3>Enrolled</h3>
            {enrolled_classrooms.length <= 0
              ? <span>You aren't enrolled in any classes.</span>
              : <div className={style.classes}>
                {enrolled_classrooms.map((classroom: ClassroomDTO, index: number) => {
                  return (<ClassPreview class={classroom} key={index} />);
                })}
              </div>
            }
          </>
        }
      </section>
    </div>
  );
}

export default HomeClient;
