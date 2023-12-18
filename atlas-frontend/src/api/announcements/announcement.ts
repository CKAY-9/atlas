import axios from "axios";
import { AnnouncementDTO } from "./dto";
import { API_URL } from "../resources";
import { getCookie } from "@/utils/cookies";

export const getAnnouncementFromID = async (announcement_id: number, token: string = ""): Promise<AnnouncementDTO | null> => {
  try {
    const fetch_request = await axios({
      "url": API_URL + "/announcements",
      "method": "GET",
      "params": {
        "announcement_id": announcement_id 
      },
      "headers": {
        "Authorization": token === "" ? (getCookie("token") || "") : token
      }
    });
    return fetch_request.data.announcement;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getAllAnnouncementsFromIDs = async (ids: number[]): Promise<AnnouncementDTO[]> => {
  console.log(ids);
  try {
    const temp_announcements: AnnouncementDTO[] = [];
    for (let i = 0; i < ids.length; i++) {
      const temp_announcement = await getAnnouncementFromID(ids[i]);
      if (temp_announcement === null) continue;
      temp_announcements.push(temp_announcement);
    }
    return temp_announcements.reverse();
  } catch (ex) {
    console.log(ex);
    return [];
  }
}

export const createNewAnnouncement = async (content: string, classroom_id: number): Promise<number | null> => {
  try {
    const create_request = await axios({
      "url": API_URL + "/announcements",
      "method": "POST",
      "data": {
        "content": content,
        "classroom_id": classroom_id
      },
      "headers": {
        "Authorization": getCookie("token") || ""
      }
    });
    return create_request.data.announcement_id;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}
