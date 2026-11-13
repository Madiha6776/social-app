import axios from "axios";

export async function deletePost(postId: string) {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return data;
}