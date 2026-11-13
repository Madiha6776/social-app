import axios from "axios";

export async function getReplies({ postId, commentId }: { postId: string; commentId: string }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
    { headers: { AUTHORIZATION: `Bearer ${token}` } }
  );
  return data;
}

export async function addReply({
  postId,
  commentId,
  formData,
}: {
  postId: string;
  commentId: string;
  formData: FormData;
}) {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
    formData,
    { headers: { AUTHORIZATION: `Bearer ${token}` } }
  );
  return data;
}