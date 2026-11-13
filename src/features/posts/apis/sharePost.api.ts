import axios from "axios";

export async function sharePost({ postId, body }: { postId: string; body: string }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/share`,
    body.trim() ? { body } : {},
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );
  return data;
}