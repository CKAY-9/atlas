export interface AssignmentEntryDTO {
  id: number,
  student_id: number,
  assignment_id: number,
  grade: number,
  submitted: string,
  turned_in: boolean,
  attachments: string[]
}
