export interface QuizQuestionDTO {
  question: string,
  options: string[],
  correct_answer: number
}

export interface QuizDTO {
  id: number,
  name: string,
  description: string,
  questions: string,
  creator: number,
  posted: string
}
