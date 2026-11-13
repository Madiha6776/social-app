import axios from "axios";

export async function getUserPosts(userId: string) {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/users/${userId}/posts`,
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );
  return data;
}