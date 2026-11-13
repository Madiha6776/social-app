
import axios from "axios";

export async function updatePrivacy({
  postId,
  privacy,
  body,
}: {
  postId: string;
  privacy: string;
  body?: string;
}) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("privacy", privacy);
  if (body) formData.append("body", body); // السيرفر بيرفض body فاضي

  const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, formData, {
    headers: {
      AUTHORIZATION: `Bearer ${token}`,
    },
  });
  return data;
}