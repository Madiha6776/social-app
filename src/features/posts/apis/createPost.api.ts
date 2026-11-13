import axios from "axios";


export async function createPost(formData: FormData) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts`,
    formData,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return data;
}