import axios from "axios";
import { API_URL } from "../resources";
import { getCookie } from "@/utils/cookies";
import { ClassroomDTO } from "./dto";

export const createNewClassroom = async (classroom_name: string): Promise<number | null> => {
  try {
    const create_request = await axios({
      "url": API_URL + "/classrooms",
      "method": "POST",
      "data": {
        "name": classroom_name
      },
      "headers": {
        "Authorization": getCookie("token") || ""
      }
    });
    return create_request.data.classroom_id;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getClassroom = async (classroom_id: number, token: string = ""): Promise<ClassroomDTO | null> => {
  try {
    const fetch_request = await axios({
      "url": API_URL + "/classrooms",
      "method": "GET",
      "headers": {
        "Authorization": token === "" ? (getCookie("token") || "") : token
      },
      "params": {
        "classroom_id": classroom_id
      }
    });
    return fetch_request.data.classroom;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getAllClassesFromIDs = async (classroom_ids: number[]): Promise<ClassroomDTO[]> => {
  try {
    const classes: ClassroomDTO[] = [];
    for (let i = 0; i < classroom_ids.length; i++) {
      const temp_classroom = await getClassroom(classroom_ids[i]);
      if (temp_classroom === null) continue;
      classes.push(temp_classroom);
    }
    return classes;
  } catch (ex) {
    console.log(ex);
    return [];
  }
}

export const joinClassroomFromCode = async (classroom_code: string): Promise<number | null> => {
  try {
    const join_request = await axios({
      "url": API_URL + "/classrooms/join",
      "method": "POST",
      "headers": {
        "Authorization": getCookie("token") || ""
      },
      "data": {
        "classroom_code": classroom_code
      }
    });
    return join_request.data.classroom_id;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}
