import axios from "axios";

export async function updatePost({
  formData,
  postId,
}: {
  formData: FormData;
  postId: string;
}) {
  const token = localStorage.getItem("token");

  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
    formData,
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );

  return data;
}   