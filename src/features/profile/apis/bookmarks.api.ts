import axios from "axios";

export async function getBookmarks() {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/bookmarks`, {
    headers: {
      AUTHORIZATION: `Bearer ${token}`,
    },
  });
  return data;
}