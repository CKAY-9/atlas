import { Metadata } from "next";
import style from "./login.module.scss";
import { DISCORD_OAUTH_LINK, GITHUB_OAUTH_LINK, GOOGLE_OAUTH_LINK } from "@/api/oauth";
import Link from "next/link";
import Image from "next/image";
import LoginClient from "./client";

export const generateMetadata = (): Metadata => {
  return {
    "title": "Login to Atlas",
    "description": "Login to Atlas using OAuth providers or your email."
  }
}

const LoginPage = async () => {
  return (
    <>
      <div className={style.vignette}></div>
      <main className={style.container}>
        <Link href="/" style={{"margin": "0 auto 1rem auto"}}>
          <Image 
            src="/marks/atlas-mark-white.png"
            alt="Atlas"
            sizes="100%"
            width={0}
            height={0}
            style={{"width": "10rem", "height": "10rem", "zIndex": "10000", "position": "relative"}}
          />
        </Link>
        {DISCORD_OAUTH_LINK !== undefined &&
          <Link href={DISCORD_OAUTH_LINK} className={style.oauth} style={{"backgroundColor": "#5865F2"}}>
            <Image 
              src="/marks/discord-mark-white.svg"
              alt="Discord"
              sizes="100%"
              width={0}
              height={0}
            />
            <span>Sign in with Discord</span>
          </Link>
        }
        {GITHUB_OAUTH_LINK !== undefined &&
          <Link href={GITHUB_OAUTH_LINK} className={style.oauth} style={{"backgroundColor": "#181818"}}>
            <Image 
              src="/marks/github-mark-white.svg"
              alt="Discord"
              sizes="100%"
              width={0}
              height={0}
            />
            <span>Sign in with GitHub</span>
          </Link>
        }
        {GOOGLE_OAUTH_LINK !== undefined &&
          <Link href={GOOGLE_OAUTH_LINK} className={style.oauth} style={{"backgroundColor": "#ffffff"}}>
            <Image 
              src="/marks/google-mark-white.png"
              alt="Google"
              sizes="100%"
              width={0}
              height={0}
            />
            <span style={{"color": "#000000"}}>Sign in with Google</span>
          </Link>
        }
      </main>
      <LoginClient />
    </>
  );
}

export default LoginPage;
