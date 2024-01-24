"use client"

import { BaseSyntheticEvent, useState } from "react";
import style from "./new.module.scss";
import Popup from "@/components/popup/popup";
import { QuizQuestionDTO } from "@/api/quizzes/dto";
import Image from "next/image";
import { createNewPopQuiz } from "@/api/quizzes/quiz";

const NewQuizClient = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showing_questions, setShowingQuestions] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestionDTO[]>([]);
  const [current_question, setCurrentQuestion] = useState<QuizQuestionDTO | null>(null);
  const [current_options, setCurrentOptions] = useState<string[]>([]);

  const createQuiz = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const creation = await createNewPopQuiz(name, description, questions);
    if (creation !== null) {
      window.location.href = `/quizzes/${creation}`;
      return;
    }
  }

  return (
    <>
      {showing_questions &&
        <Popup close={() => setShowingQuestions(false)}>
          <h1>Questions</h1> 
          <div className={style.questions_container}>
            <div className={style.questions}>
              {questions.map((question: QuizQuestionDTO, index: number) => {
                return (
                  <button onClick={() => {
                    setCurrentQuestion(questions[index]);
                    setCurrentOptions(questions[index].options);
                  }}>{question.question}</button>
                );
              })}
              <button onClick={() => {
                setQuestions((old) => [...old, {
                  question: "Question #" + (old.length + 1),
                  options: ["Option #1", "Option #2", "Option #3", "Option #4"],
                  correct_answer: 0
                }])
              }}>New Question</button>
              <button onClick={() => {
                setShowingQuestions(false)
              }}>Update</button>
            </div>
            {current_question !== null &&
              <div className={style.question}> 
                <section>
                  <label>Question: </label>
                  <input type="text" placeholder="Question" defaultValue={current_question.question} />
                </section>
                <section>
                  <label>Options: </label>
                  <div className={style.options}>
                    {current_options.map((option: string, index: number) => {
                      return (
                        <div className={style.option}>
                          <input type="text" placeholder="Option" defaultValue={option} onChange={(e: BaseSyntheticEvent) => current_question.options[index] = e.target.value} />
                          <button className={style.delete} onClick={() => setCurrentOptions(current_options.filter((entry) => entry !== option))}>
                            <Image 
                              src="/icons/delete.svg"
                              alt="Delete"
                              sizes="100%"
                              width={0}
                              height={0}
                            />
                          </button>
                        </div>
                      );
                    })}
                    {current_options.length < 4 && 
                      <button onClick={() => setCurrentOptions((old) => [...old, "Option #" + (current_options.length + 1)])}>New Option</button>
                    }
                  </div>
                </section>
                <section>
                  <label>Current Answer: </label>
                  <input type="number" min={0} max={current_options.length} defaultValue={current_question.correct_answer} /> 
                </section>
              </div>
            }
          </div>
        </Popup>
      }
      <div className={style.new_quiz}>
        <label>Name</label>
        <input type="text" placeholder="Quiz Name" onChange={(e: BaseSyntheticEvent) => setName(e.target.value)}/>
        <label>Description</label>
        <textarea placeholder="Quiz Description" rows={10} cols={30} onChange={(e: BaseSyntheticEvent) => setDescription(e.target.value)} />
        <label>Questions</label>
        <button onClick={() => setShowingQuestions(true)}>View Questions</button>
        <button onClick={createQuiz}>Create</button>
      </div>
    </>
  );
}

export default NewQuizClient;
