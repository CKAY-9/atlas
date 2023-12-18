import Link from "next/link";
import style from "./nav-bar.module.scss";
import Image from "next/image";
import { ClassroomDTO } from "@/api/classrooms/dto";
import { AssignmentDTO } from "@/api/assignments/dto";
import { Classrooms, CurrentClassroom } from "./client";
import { UserDTO } from "@/api/users/dto";

const NavigationBar = (props: {
  current_classroom: ClassroomDTO | null,
  current_assignment: AssignmentDTO | null,
  user: UserDTO | null
}) => {
  return (
    <nav className={style.nav_bar}>
      <div className={style.nav_bar_container}>
        <section>
          <Link className={style.link} href="/">
            <Image 
              src="/icons/home.svg"
              alt="Home"
              sizes="100%"
              width={0}
              height={0}
            />
            <span>Home</span>
          </Link>
          <Link className={style.link} href="/announcments">
            <Image 
              src="/icons/announcment.svg"
              alt="Announcment"
              sizes="100%"
              width={0}
              height={0}
            />
            <span>Announcments</span>
          </Link>
          <Link className={style.link} href="/assignments">
            <Image 
              src="/icons/assignment.svg"
              alt="Assignment"
              sizes="100%"
              width={0}
              height={0}
            />
            <span>Assignments</span>
          </Link>
        </section>
        <div className={style.seperator}></div>
        {props.current_classroom !== null && <CurrentClassroom classroom={props.current_classroom} /> }
        <section>
          <Classrooms user={props.user} />   
        </section>
      </div>
    </nav>
  );
}

export default NavigationBar;
