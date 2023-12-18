"use client"

import { ClassroomDTO } from "@/api/classrooms/dto";
import { UserDTO } from "@/api/users/dto";

const AssignmentsClient = (props: {
  user: UserDTO,
  classroom: ClassroomDTO
}) => {
  return (
    <>
      {props.classroom.assignment_ids.length <= 0
        ? <span>There are no assignments to do.</span>
        : <div>
        </div>
      }
    </>
  );
}

export default AssignmentsClient;
