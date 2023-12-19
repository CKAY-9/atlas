"use client"

import { getAllAssignmentsFromIDs } from "@/api/assignments/assignment";
import { AssignmentDTO } from "@/api/assignments/dto";
import { ClassroomDTO } from "@/api/classrooms/dto";
import { UserDTO } from "@/api/users/dto";
import AssignmentPreview from "@/components/assignment-preview/assignment";
import LoadingWheel from "@/components/loading/loading";
import Link from "next/link";
import { useEffect, useState } from "react";

const AssignmentsClient = (props: {
  user: UserDTO,
  classroom: ClassroomDTO
}) => {
  const [assignments, setAssignments] = useState<AssignmentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const temp_assignments = await getAllAssignmentsFromIDs(props.classroom.assignment_ids);
      setAssignments(temp_assignments);
      setLoading(false);
    })();
  }, [props.classroom.assignment_ids]);

  return (
    <>
      {props.classroom.assignment_ids.length <= 0
        ? <span>There are no assignments to do.</span>
        : <div>
          {loading 
            ? <LoadingWheel size_in_rems={5} />
            : <>
              {assignments.map((assignment: AssignmentDTO, index: number) => {
                return (
                  <Link href={`/classrooms/${props.classroom.id}/assignments/${assignment.id}`} key={index}>
                    <AssignmentPreview assignment={assignment} />
                  </Link>
                );
              })}
            </>
          } 
        </div>
      }
    </>
  );
}

export default AssignmentsClient;
