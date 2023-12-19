"use client"

import { UserDTO } from "@/api/users/dto"
import LogoutButton from "@/components/logout/logout-button";
import style from "./settings.module.scss";
import DeleteButton from "@/components/delete-button/delete";
import { deleteUser } from "@/api/users/user";

const SettingsClient = (props: {
  user: UserDTO
}) => {
  return (
    <>
      <h1>User Settings</h1>
      <div className={style.settings}>
      <LogoutButton />
      <DeleteButton on_click={deleteUser} text="Delete Account" />
      </div>
    </>
  );
}

export default SettingsClient;
