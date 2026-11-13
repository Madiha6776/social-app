import axios from "axios";

export async function uploadPhoto(formData: FormData) {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/upload-photo`, formData, {
    headers: {
      AUTHORIZATION: `Bearer ${token}`,
    },
  });
  return data;
}