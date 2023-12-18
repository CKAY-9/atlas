import Link from "next/link";
import style from "./header.module.scss";
import Image from "next/image";
import { UserDTO } from "@/api/users/dto";
import HeaderClient from "./client";
import UserChip from "../user-chip/user-chip";

const Header = (props: {
  user: UserDTO | null
}) => {
  return (
    <header className={style.header}>
      <section>
        <Link href="/">
          <Image 
            src="/marks/atlas-mark-white.png"
            alt="Atlas Logo"
            sizes="100%"
            width={0}
            height={0}
            className={style.logo}
          />
        </Link>
      </section>
      <section>
        {props.user === null 
          ? <>
            <Link href="/users/login">Login</Link>
          </> 
          : <>
            <HeaderClient user={props.user} />
            <Link className={style.nav_link} href={"/users/settings"}>
              <Image 
                src="/icons/settings.svg"
                alt="Settings"
                sizes="100%"
                width={0}
                height={0}
                className={style.nav_icon}
              />
            </Link>
            <Link className={style.user} href={`/users/${props.user.id}`}>
              <UserChip user={props.user} />
            </Link>
          </>
        }
      </section>
    </header>
  );
}

export default Header;
