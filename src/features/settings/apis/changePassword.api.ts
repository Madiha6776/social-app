import axios from "axios";

export async function changePassword({ password, newPassword }: { password: string; newPassword: string }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/users/change-password`,
    { password, newPassword },
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );
  return data;
}
