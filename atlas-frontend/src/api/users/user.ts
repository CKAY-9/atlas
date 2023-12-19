import axios from "axios";
import { API_URL } from "../resources";
import { UserDTO } from "./dto";
import { getCookie } from "@/utils/cookies";

export const getUserFromToken = async (token: string): Promise<UserDTO | null> => {
  try {
    const user_request = await axios({
      "url": API_URL + "/users",
      "method": "GET",
      "headers": {
        "Authorization": token
      }
    });
    return user_request.data.user;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getUserFromID = async (user_id: number): Promise<UserDTO | null> => {
  try {
    const user_request = await axios({
      "url": API_URL + "/users/id",
      "method": "GET",
      "params": {
        "user_id": user_id
      }
    });
    return user_request.data.user;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getAllUsersFromIDs = async (user_ids: number[]): Promise<UserDTO[]> => {
  try {
    const temp_users: UserDTO[] = [];
    for (let i = 0; i < user_ids.length; i++) {
      const temp_user = await getUserFromID(user_ids[i]);
      if (temp_user === null) continue;
      temp_users.push(temp_user);
    }
    return temp_users;
  } catch (ex) {
    console.log(ex);
    return [];
  }
}

export const deleteUser = async (): Promise<boolean> => {
  try {
    const delete_request = await axios({
      "url": API_URL + "/users",
      "method": "DELETE",
      "headers": {
        "Authorization": getCookie("token") || ""
      }
    });
    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
}
