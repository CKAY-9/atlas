export interface UserDTO {
  id: number,
  oauth: string,
  username: string,
  avatar: string,
  joined: string,
  token: string,
  enrolled_classes: number[],
  teaching_classes: number[]
}
