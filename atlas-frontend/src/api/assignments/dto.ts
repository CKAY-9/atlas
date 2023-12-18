export interface AssignmentDTO {
  id: number,
  name: string,
  description: string,
  classroom_id: number,
  unit_id: number,
  posted: string,
  rubric_id: number,
  deadline: string,
  attachments: string[]
}
