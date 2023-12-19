import axios from "axios";
import { API_URL } from "../resources";
import { getCookie } from "@/utils/cookies";
import { AssignmentDTO } from "./dto";

export const createNewAssignment = async (
  name: string,
  description: string,
  classroom_id: number,
  unit_id: number,
  rubric_id: number,
  deadline: string,
  attachments: string[]
): Promise<number | null> => {
  try {
    const create_request = await axios({
      "url": API_URL + "/assignments",
      "method": "POST",
      "data": {
        name,
        description,
        classroom_id,
        unit_id,
        rubric_id,
        deadline,
        attachments
      },
      "headers": {
        "Authorization": getCookie("token") || ""
      }
    });
    return create_request.data.assignment_id;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getAssignmentFromID = async (
  assignment_id: number, 
  token: string = ""
): Promise<AssignmentDTO | null> => {
  try {
    const fetch_request = await axios({
      "url": API_URL + "/assignments",
      "method": "GET",
      "params": {
        "assignment_id": assignment_id
      },
      "headers": {
        "Authorization": token === "" ? (getCookie("token") || "") : token
      }
    });
    return fetch_request.data.assignment;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getAllAssignmentsFromIDs = async (ids: number[]): Promise<AssignmentDTO[]> => {
  try {
    const temp_assignments: AssignmentDTO[] = [];
    for (let i = 0; i < ids.length; i++) {
      const assignment = await getAssignmentFromID(ids[i]);
      if (assignment === null) continue;
      temp_assignments.push(assignment);
    }
    return temp_assignments;
  } catch (ex) {
    console.log(ex);
    return [];
  }
}
