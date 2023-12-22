import axios, { AxiosResponse } from "axios";
import { UploadFileResponse } from "./dto";
import { API_URL } from "../resources";

export const uploadFile = async (
  file_data: File | undefined, data: {
    previous_file_dest: string
}): Promise<UploadFileResponse | null> => {
  try {
    if (file_data === undefined) {
      return null;
    }

    if (file_data.size > (1024 * 1024 * 10) /* 10MB */) {
      return null;
    }

    const form = new FormData();
    form.append("previous_file", data.previous_file_dest)
    form.append("file", file_data);

    const req: AxiosResponse<UploadFileResponse> = await axios({
      "url": API_URL + "/files/upload",
      "method": "POST",
      "data": form  
    });

    return req.data;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}
