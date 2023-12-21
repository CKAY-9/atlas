"use client"

import { UserDTO } from "@/api/users/dto";
import style from "./footer.module.scss";
import Image from "next/image";
import Link from "next/link";

const Footer = (props: {
  user: UserDTO | null
}) => {
  return (
    <footer className={style.footer}>
      <section className={style.splash}>
        <Link href="/">
          <Image 
            src="/marks/atlas-mark-white.png"
            alt="Atlas"
            sizes="100%"
            width={0}
            height={0}
            className={style.logo}
          />
        </Link>
        <h2>Atlas</h2>
        <span>Empowering education, one classroom at a time.</span>
        <section className={style.external}>
          <Link href="https://github.com/CKAY-9/atlas">
            <Image 
              src="/marks/github-mark-white.svg"
              alt="GitHub"
              sizes="100%"
              width={0}
              height={0}
            />
          </Link>
        </section>
      </section>
      <nav>
        <strong>General</strong>
        <Link href="/">Home</Link>
        <Link href="/landing">Landing</Link>
      </nav>
      <nav>
        <strong>User</strong>
        <Link href="/users/login">{props.user === null ? "Login" : "Change Account"}</Link>
        {props.user !== null && 
          <>
            <Link href={`/users/${props.user.id}`}>My Profile</Link>
            <Link href={`/users/settings`}>Settings</Link>
          </>
        }
      </nav>
      <nav>
        <strong>Classes</strong>
        <Link href="/announcements">Announcements</Link>
        <Link href="/assignments">Assignments</Link>
      </nav>
    </footer>
  );
}

export default Footer;
