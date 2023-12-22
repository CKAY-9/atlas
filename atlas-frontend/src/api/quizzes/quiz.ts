import axios from "axios";
import { QuizDTO, QuizQuestionDTO } from "./dto";
import { API_URL } from "../resources";
import { getCookie } from "@/utils/cookies";

export const createNewPopQuiz = async (name: string, description: string, questions: QuizQuestionDTO[]): Promise<number | null> => {
  try {
    const questions_to_string = JSON.stringify(questions);
    const create_request = await axios({
      "url": API_URL + "/quizzes",
      "method": "POST",
      "data": {
        name,
        description,
        "questions": questions_to_string
      },
      "headers": {
        "Authorization": getCookie("token") || ""
      }
    });
    return create_request.data.quiz_id;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export const getPopQuiz = async (quiz_id: number, token: string = ""): Promise<QuizDTO | null> => {
  try {
    const fetch_request = await axios({
      "url": API_URL + "/quizzes",
      "method": "GET",
      "params": {
        quiz_id
      },
      "headers": {
        "Authorization": token === "" ? (getCookie("token") || "") : token
      }
    });
    return fetch_request.data.quiz;
  } catch (ex) {
    console.log(ex);
    return null;
  }
}
