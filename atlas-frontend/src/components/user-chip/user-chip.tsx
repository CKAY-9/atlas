import { UserDTO } from "@/api/users/dto"
import style from "./user-chip.module.scss";
import Image from "next/image";

const UserChip = (props: {
  user: UserDTO | null
}) => {
  if (props.user === null) return;

  return (
    <div className={style.user}>
      <Image 
        src={props.user.avatar}
        alt="Avatar"
        sizes="100%"
        width={0}
        height={0}
        className={style.icon}
      />
      <span className={style.name}>{props.user.username}</span>
    </div>
  )
}

export default UserChip;
