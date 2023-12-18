"use client"

import Image from "next/image";
import style from "./logout.module.scss";
import { setCookie } from "@/utils/cookies";

export const logout = () => {
  setCookie("token", "", 0);
  window.location.href = "/users/login";
}

const LogoutButton = () => {
  return (
    <button onClick={logout} className={style.logout}>
      <Image 
        src="/icons/exit.svg"
        alt="Logout"
        sizes="100%"
        height={0}
        width={0}
      />
      <span>Logout</span>
    </button>
  )
}

export default LogoutButton;
