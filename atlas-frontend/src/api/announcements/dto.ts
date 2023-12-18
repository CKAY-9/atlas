export interface AnnouncementDTO {
  id: number,
  sender_id: number,
  content: string,
  classroom_id: number,
  seen_by: number[],
  posted: string
}
