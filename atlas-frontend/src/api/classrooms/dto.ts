export interface ClassroomDTO {
  id: number,
  banner: string,
  name: string,
  code: string,
  description: string,
  student_ids: number[],
  teacher_ids: number[],
  unit_ids: number[],
  assignment_ids: number[],
  announcement_ids: number[]
}
