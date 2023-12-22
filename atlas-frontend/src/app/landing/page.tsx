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
        <section style={{"marginTop": "5rem"}}>
          <h1 style={{"textAlign": "center"}}>Features</h1>
          <div className={style.features}>
            <div className={style.feature}>
              <Image 
                src="/icons/engagement.svg"
                alt="Engagement"
                sizes="100%"
                width={0}
                height={0}
              />
              <h3>Engagement</h3>
              <span>Atlas offers tools and activities that allow students to engage with course material.</span>
            </div>
            <div className={style.feature}>
              <Image 
                src="/icons/bolt.svg"
                alt="Lightning Bolt"
                sizes="100%"
                width={0}
                height={0}
              />
              <h3>Easy-to-Use</h3>
              <span>Atlas ensures that it's platform is easy-to-use for everyone by providing a clean and intuitive design.</span>
            </div>
            <div className={style.feature}>
              <Image 
                src="/icons/unlocked.svg"
                alt="Freedom"
                sizes="100%"
                width={0}
                height={0}
              />
              <h3>Privacy and Freedom</h3>
              <span>Atlas ensures that all users privacy is protected. Atlas uses the <Link href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL-3.0 License</Link> and is open-source on <Link href="https://github.com/CKAY-9/atlas">GitHub</Link>.</span>

            </div>
          </div>
        </section> 
      </main>
      <Footer user={user} />
    </>
  );
}

export default LandingPage;
