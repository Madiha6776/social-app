import axios from "axios";

type registerPayload = {
  name: string;
  username?: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  password: string;
  rePassword: string;
};

export async function signUp(payload: registerPayload) {
  const { data } = await axios.post(
    "https://route-posts.routemisr.com/users/signup",
    payload,
  );
  return data;
}