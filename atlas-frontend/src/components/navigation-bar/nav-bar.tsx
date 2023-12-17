import Link from "next/link";
import style from "./nav-bar.module.scss";
import Image from "next/image";

const NavigationBar = () => {
  return (
    <nav className={style.nav_bar}>
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
        <div className={style.seperator}></div>
      </section>
      <section>
      </section>
    </nav>
  );
}

export default NavigationBar;
