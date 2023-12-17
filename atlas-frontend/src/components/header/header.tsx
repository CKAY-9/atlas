import Link from "next/link";
import style from "./header.module.scss";
import Image from "next/image";

const Header = () => {
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
        <Link href="/users/login">Login</Link>
      </section>
    </header>
  );
}

export default Header;
