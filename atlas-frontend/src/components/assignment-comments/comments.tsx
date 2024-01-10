"use client"

import { AssignmentDTO, AssignmentMessageDTO } from "@/api/assignments/dto"
import style from "./comments.module.scss"
import { BaseSyntheticEvent, useEffect, useState } from "react"
import { createNewAssignmentComment, getPersonalCommentsFromID } from "@/api/assignments/assignment"
import { UserDTO } from "@/api/users/dto"

const AssignmentComments = (props: {
  assignment: AssignmentDTO,
  user: UserDTO
}) => {
  const [show_new_comment, setShowNewComment] = useState<boolean>(false);
  const [new_comment_content, setNewCommentContent] = useState<string>("");
  const [comments, setComments] = useState<AssignmentMessageDTO[]>([]);

  useEffect(() => {
    (async () => {
      const messages = await getPersonalCommentsFromID(props.assignment.id);
    })();
  }, [props.assignment]);

  const sendComment = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const create = await createNewAssignmentComment(new_comment_content, props.assignment.id, props.user.id, 0);
    if (create !== null) {
      setComments((old) => [...old, create.assignment_message]); 
    }
  }

  return (
    <div className={style.assignment_comments}>
      <h2>Private Comments</h2>
      <div className={style.comments}>
        <button onClick={() => setShowNewComment(!show_new_comment)}>New Comment</button>
        {show_new_comment &&
          <section className={style.new_comment}>
            <input type="text" placeholder="New Comment" onChange={(e: BaseSyntheticEvent) => setNewCommentContent(e.target.value)} />
            <button onClick={sendComment}>Send</button>
          </section>
        }
      </div>
    </div>
  );
}

export default AssignmentComments
