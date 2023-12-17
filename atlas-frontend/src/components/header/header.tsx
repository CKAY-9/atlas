import Link from "next/link";
import style from "./header.module.scss";

const Header = () => {
  return (
    <header className={style.header}>
      <section>
      </section>
      <section>
        <Link href="/users/login">Login</Link>
      </section>
    </header>
  );
}

export default Header;
