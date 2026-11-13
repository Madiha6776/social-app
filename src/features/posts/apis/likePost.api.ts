import axios from "axios";

export async function likePost({ postId }: { postId: string }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/like`,
    {},
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );
  return data;
}