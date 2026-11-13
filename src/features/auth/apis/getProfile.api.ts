import axios from "axios";

export async function getProfile(token: string) {
  const { data } = await axios.get(
    "https://route-posts.routemisr.com/users/profile-data",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}