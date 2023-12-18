import { UserDTO } from "@/api/users/dto"
import LogoutButton from "@/components/logout/logout-button";

const SettingsClient = (props: {
  user: UserDTO
}) => {
  return (
    <>
      <h1>User Settings</h1>
      <LogoutButton />
    </>
  );
}

export default SettingsClient;
