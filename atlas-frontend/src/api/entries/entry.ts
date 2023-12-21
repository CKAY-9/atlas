import axios from "axios";
import { API_URL } from "../resources";
import { getCookie } from "@/utils/cookies";
import { AssignmentEntryDTO } from "./dto";

export const createNewAssignmentEntry = async (student_id: number, assignment_id: number, attachments: string[]): Promise<number | null> => {
  try {
    const create_request = await axios({
      "url": API_URL + "/entries",
      "method": "POST",
      "data": {
        assignment_id,
        student_id,
        attachments
      },
      "headers": {
        "Authorization": getCookie("token") || ""
      }
    });
    return create_request.data.entry_id;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getAssignmentEntry = async (entry_id: number, token: string = ""): Promise<AssignmentEntryDTO | null> => {
  try {
    const fetch_request = await axios({
      "url": API_URL + "/entries",
      "method": "GET",
      "params": {
        entry_id
      },
      "headers": {
        "Authorization": token === "" ? (getCookie("token") || "") : token
      }
    });
    return fetch_request.data.entry;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getStudentAssignmentEntry = async (student_id: number, assignment_id: number, token: string = ""): Promise<AssignmentEntryDTO | null> => {
  try {
    const fetch_request = await axios({
      "url": API_URL + "/entries/student",
      "method": "GET",
      "params": {
        student_id,
        assignment_id
      },
      "headers": {
        "Authorization": token === "" ? (getCookie("token") || "") : token
      }
    });
    return fetch_request.data.entry;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const updateStudentAssignmentEntry = async (
  entry_id: number, 
  grade: number, 
  submitted: string, 
  turned_in: boolean, 
  attachments: string[]
): Promise<AssignmentEntryDTO | null> => {
  try {
    const update_request = await axios({
      "url": API_URL + "/entries",
      "method": "PUT",
      "data": {
        entry_id,
        grade,
        submitted,
        turned_in,
        attachments
      },
      "headers": {
        "Authorization": getCookie("token") || null
      }
    });
    return update_request.data.entry;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}
