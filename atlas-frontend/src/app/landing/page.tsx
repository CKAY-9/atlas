import { Metadata } from "next";
import style from "./landing.module.scss";
import Image from "next/image";
import Link from "next/link";
import { getStoredToken } from "@/utils/token.server";
import { getUserFromToken } from "@/api/users/user";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export const generateMetadata = (): Metadata => {
  return {
    "title": "Welcome to Atlas",
    "description": "Learn about what Atlas has to offer"
  }
}

const LandingPage = async () => {
  const user_token = getStoredToken();
  const user = await getUserFromToken(user_token);

  return (
    <>
      <Header user={user} />
      <main className={style.container}>
        <div className={style.splash}>
          <section>
            <h1>Atlas</h1>
            <span>Empowering education, one classroom at a time.</span>
          </section>
          <section>
            <Image 
              src="/marks/atlas-mark-white.png"
              alt="Atlas"
              sizes="100%"
              width={0}
              height={0}
              className={style.logo}
            />
          </section>
        </div>
        <section style={{"display": "flex", "gap": "1rem"}}>
          <Link className={style.interact} href="/users/login">Get Started</Link>
          <Link className={style.interact} style={{"backgroundColor": "rgb(var(--danger))"}} href="#learn">Learn More</Link>
        </section>
        <section style={{"marginTop": "5rem"}}>
          <h2>Learn More</h2>
          <p id="learn">
            Atlas is a web platform dedicated to making sure education is accessible to everyone. Atlas includes features that allows educators
            and students to interact and engage online. These features are meant to empower students and teachers to make sure they have the
            best expierence learning and teaching.
          </p>
        </section>
      </main>
      <Footer user={user} />
    </>
  );
}

export default LandingPage;
