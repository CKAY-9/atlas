"use client"

import { AssignmentDTO } from "@/api/assignments/dto"
import style from "./comments.module.scss"
import { BaseSyntheticEvent, useState } from "react"

const AssignmentComments = (props: {
  assignment: AssignmentDTO
}) => {
  const [show_new_comment, setShowNewComment] = useState<boolean>(false);
  const [new_comment_content, setNewCommentContent] = useState<string>("");

  const sendComment = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
  }

  return (
    <div className={style.assignment_comments}>
      <h2>Private Comments</h2>
      <div className={style.comments}>
        <button onClick={() => setShowNewComment(!show_new_comment)}>New Comment</button>
        {show_new_comment &&
          <section className={style.new_comment}>
            <input type="text" placeholder="New Comment" onChange={(e: BaseSyntheticEvent) => setShowNewComment(e.target.value)} />
            <button onClick={sendComment}>Send</button>
          </section>
        }
      </div>
    </div>
  );
}

export default AssignmentComments
