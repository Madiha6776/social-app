import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiBell } from "react-icons/hi2";
import { toast } from "react-toastify";
import { getNotifications, markAllAsRead } from "./apis/notifications.api";
import type { Notification } from "../../interfaces/notification.interface";
import NotificationItem from "./NotificationItem";
import Loading from "../../components/ui/Loading";
import { Helmet } from "react-helmet-async";

export default function Notifications() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"all" | "unread">("all");

  // ===== GET =====
  const { data, isLoading } = useQuery({
    queryKey: ["notifications", tab],
    queryFn: () => getNotifications({ unread: tab === "unread" }),
  });

  const notifications: Notification[] = data?.data?.notifications ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;

  // ===== Mark all as read =====
  const { mutate, isPending } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  function handleMarkAll() {
    mutate();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
             <Helmet>
        <title>{unread > 0 ? `(${unread}) Notifications | Route Posts` : "Notifications | Route Posts"}</title>
        <meta name="description" content="See who liked, commented on, and shared your posts" />
      </Helmet>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* الهيدر */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
            {unread > 0 && (
              <button
                onClick={handleMarkAll}
                disabled={isPending}
                className="text-sm font-semibold text-[#1877f2] hover:underline disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Marking..." : "Mark all as read"}
              </button>
            )}
          </div>

          {/* التابات */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setTab("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer ${
                tab === "all" ? "bg-blue-100 text-[#1877f2]" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTab("unread")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer ${
                tab === "unread" ? "bg-blue-100 text-[#1877f2]" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* القايمة */}
        {isLoading ? (
          <Loading />
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <HiBell className="text-5xl mx-auto text-slate-300 mb-2" />
            {tab === "unread" ? "You're all caught up 🎉" : "No notifications yet"}
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification._id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
}