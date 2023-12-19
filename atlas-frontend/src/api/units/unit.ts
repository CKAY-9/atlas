import axios from "axios";
import { API_URL } from "../resources";
import { getCookie } from "@/utils/cookies";
import { UnitDTO } from "./dto";

export const createNewCourseUnit = async (name: string, description: string, classroom_id: number): Promise<number | null> => {
  try {
    const create_request = await axios({
      "url": API_URL + "/units",
      "method": "POST",
      "headers": {
        "Authorization": getCookie("token") || ""
      },
      "data": {
        name,
        description,
        classroom_id
      }
    });
    return create_request.data.unit_id;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getCourseUnitFromID = async (unit_id: number, token: string = ""): Promise<UnitDTO | null> => {
  try {
    const fetch_request = await axios({
      "url": API_URL + "/units",
      "method": "GET",
      "headers": {
        "Authorization": token === "" ? (getCookie("token") || "") : token
      },
      "params": {
        "unit_id": unit_id
      }
    });
    return fetch_request.data.unit;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getAllUnitsFromIds = async (unit_ids: number[]): Promise<UnitDTO[]> => {
  try {
    const units: UnitDTO[] = [];
    for (let i = 0; i < unit_ids.length; i++) {
      const unit = await getCourseUnitFromID(unit_ids[i]);
      if (unit === null) continue;
      units.push(unit);
    }
    return units;
  } catch (ex) {
    console.log(ex);
    return [];
  }
}
