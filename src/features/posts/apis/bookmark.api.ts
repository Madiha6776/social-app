import axios from "axios";

export async function bookmarkPost({ postId }: { postId: string }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/bookmark`,
    {},
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );
  return data;
}