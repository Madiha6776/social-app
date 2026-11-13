import axios from "axios";

export async function getMyProfile() {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/users/profile-data`,
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );
  return data;
}


