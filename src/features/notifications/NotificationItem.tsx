import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { HiHandThumbUp, HiChatBubbleOvalLeft, HiUserPlus, HiBell } from "react-icons/hi2";
import { markAsRead } from "./apis/notifications.api";
import type { Notification } from "../../interfaces/notification.interface";
import { getAvatar } from "../../utilitis/get-avatar";
import { timeAgo } from "../../utilitis/time-ago";

//  الكلام + الأيقونة + اللون
function notificationInfo(type: string) {
  switch (type) {
    case "like_post":
      return { text: "liked your post", Icon: HiHandThumbUp, color: "bg-[#1877f2]" };
    case "comment_post":
      return { text: "commented on your post", Icon: HiChatBubbleOvalLeft, color: "bg-emerald-500" };
    case "follow_user":
      return { text: "started following you", Icon: HiUserPlus, color: "bg-violet-500" };
    default:
      return { text: "interacted with you", Icon: HiBell, color: "bg-slate-500" };
  }
}

export default function NotificationItem({ notification }: { notification: Notification }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { text, Icon, color } = notificationInfo(notification.type);
  const isDeleted = notification.entity?.unavailable;

  // ===== Mark as read =====
  const { mutate } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  function handleOpenNotification() {
    if (!notification.isRead) {
      mutate({ notificationId: notification._id });
    }
    if (notification.entityType === "post" && !isDeleted) {
      navigate(`/postdetails/${notification.entityId}`);
    }
  }

  return (
    <button
      onClick={handleOpenNotification}
      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition cursor-pointer hover:bg-slate-50 ${
        notification.isRead ? "bg-white" : "bg-blue-50/60"
      }`}
    >
      {/* صورة + أيقونة النوع */}
      <div className="relative shrink-0">
        <img src={getAvatar(notification.actor)} alt="" className="h-12 w-12 rounded-full object-cover" />
        <span className={`absolute -bottom-1 -right-1 ${color} text-white rounded-full p-1 border-2 border-white`}>
          <Icon className="text-xs" />
        </span>
      </div>

      {/* الكلام */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800">
          <span className="font-bold">{notification.actor?.name}</span> {text}
          {notification.entity?.body && !isDeleted && (
            <span className="text-slate-500" dir="auto">: "{notification.entity.body.slice(0, 40)}"</span>
          )}
        </p>
        {isDeleted && <p className="text-xs text-slate-400 italic">This post is no longer available</p>}
        <p className={`text-xs mt-0.5 ${notification.isRead ? "text-slate-400" : "text-[#1877f2] font-semibold"}`}>
          {timeAgo(notification.createdAt)}
        </p>
      </div>

      {/* صورة البوست الصغيرة */}
      {notification.entity?.image && !isDeleted && (
        <img src={notification.entity.image} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
      )}

      {/* النقطة الزرقا */}
      {!notification.isRead && <span className="h-3 w-3 rounded-full bg-[#1877f2] shrink-0" />}
    </button>
  );
}