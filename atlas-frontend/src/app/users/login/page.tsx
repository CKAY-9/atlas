import { Metadata } from "next";
import style from "./login.module.scss";
import { DISCORD_OAUTH_LINK, GITHUB_OAUTH_LINK, GOOGLE_OAUTH_LINK } from "@/api/oauth";
import Link from "next/link";
import Image from "next/image";

export const generateMetadata = (): Metadata => {
  return {
    "title": "Login to Atlas",
    "description": "Login to Atlas using OAuth providers or your email."
  }
}

const LoginPage = async () => {
  return (
    <>
      <main className={style.container}>
        <Link href="/">
          <Image 
            src="/marks/atlas-mark-white.png"
            alt="Atlas"
            sizes="100%"
            width={0}
            height={0}
            style={{"width": "10rem", "height": "10rem", "marginBottom": "1rem"}}
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
          <Link href={GOOGLE_OAUTH_LINK}>
            <Image 
              src="/marks/google-mark-white.svg"
              alt="Google"
              sizes="100%"
              width={0}
              height={0}
              style={{"width": "auto", "height": "3.5rem"}}
            />
          </Link>
        }
      </main>
    </>
  );
}

export default LoginPage;
