import axios from "axios";

export async function addComment({
  formData,
  postId,
}: {
  formData: FormData;
  postId: string;
}) {
  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`,
    formData,
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );

  return data;
}

export async function getPostComment(postId: string) {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments?page=1&limit=10`,
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );

  return data;
}

export async function deleteComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const token = localStorage.getItem("token");
  const { data } = await axios.delete(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );

  return data;
}


export async function updateComment({
  postId,
  commentId,
  formData,
}: {
  postId: string;
  commentId: string;
  formData: FormData;
}) {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
    formData,
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );

  return data;
}

export async function likeComment({ postId, commentId }: { postId: string; commentId: string }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}/like`,
    {},
    {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    }
  );
  return data;
}