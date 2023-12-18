"use client"

import { setCookie } from "@/utils/cookies";
import { useSearchParams } from "next/navigation";

const LoginClient = () => {
  const search_params = useSearchParams();
  const token = search_params.get("token");
  if (token !== null) {
    setCookie("token", token, 999);
    window.location.href = "/"
  }

  return (
    <>
    </>
  );
}

export default LoginClient;
