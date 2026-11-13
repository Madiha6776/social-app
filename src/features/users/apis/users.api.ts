import axios from "axios";

export async function getSuggestions() {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/suggestions?limit=5`, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}

export async function getUserProfile(userId: string) {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${userId}/profile`, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}

export async function followUser({ userId }: { userId: string }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/${userId}/follow`, {}, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}