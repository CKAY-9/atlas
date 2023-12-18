import { cookies } from "next/headers"

export const getStoredToken = () => {
  let temp_token = cookies().get("token")?.value; 
  if (temp_token === undefined)
    return "";
  return temp_token;
}
