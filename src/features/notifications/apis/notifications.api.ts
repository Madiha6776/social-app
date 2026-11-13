import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export async function getNotifications({ unread }: { unread: boolean }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${baseUrl}/notifications?unread=${unread}&page=1&limit=10`, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}

export async function getUnreadCount() {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${baseUrl}/notifications/unread-count`, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}

export async function markAsRead({ notificationId }: { notificationId: string }) {
  const token = localStorage.getItem("token");
  const { data } = await axios.patch(`${baseUrl}/notifications/${notificationId}/read`, {}, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}

export async function markAllAsRead() {
  const token = localStorage.getItem("token");
  const { data } = await axios.patch(`${baseUrl}/notifications/read-all`, {}, {
    headers: { AUTHORIZATION: `Bearer ${token}` },
  });
  return data;
}