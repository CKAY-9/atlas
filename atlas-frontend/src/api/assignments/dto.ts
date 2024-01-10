export interface AssignmentDTO {
  id: number,
  name: string,
  description: string,
  classroom_id: number,
  teacher_id: number,
  unit_id: number,
  posted: string,
  rubric_id: number,
  deadline: string,
  attachments: string[]
}

export interface AssignmentMessageDTO {
  id: number,
  content: string,
  assignment_id: number,
  sender_id: number,
  receiver_id: number
}
