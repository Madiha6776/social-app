import axios from "axios";

type loginPayload = {
  email: string;
  password: string;
};

export async function SignIn(payload: loginPayload) {
  const { data } = await axios.post(
    "https://route-posts.routemisr.com/users/signin",
    payload,
  );
  return data;
}
