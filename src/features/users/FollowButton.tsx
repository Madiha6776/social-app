import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HiUserPlus, HiCheck } from "react-icons/hi2";
import { followUser } from "./apis/users.api";

export default function FollowButton({
  userId,
  isFollowing = false,
  size = "sm",
}: {
  userId: string;
  isFollowing?: boolean;
  size?: "sm" | "lg";
}) {
  const query = useQueryClient();

  const { mutate, data, isPending } = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["userProfile"] });
      query.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const following = data ? data.data.following : isFollowing;

  function handleFollow() {
    mutate({ userId });
  }

  const sizes = size === "lg" ? "px-6 py-2.5 text-base" : "px-3 py-1.5 text-sm";
  const colors = following
    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
    : size === "lg"
      ? "bg-[#00298d] text-white hover:bg-[#001f6b]"
      : "bg-blue-50 text-[#00298d] hover:bg-blue-100";

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`flex items-center gap-1.5 rounded-lg font-semibold transition cursor-pointer disabled:opacity-50 shrink-0 ${sizes} ${colors}`}
    >
      {following ? (
        <HiCheck className="text-base" />
      ) : (
        <HiUserPlus className="text-base" />
      )}
      {following ? "Following" : "Follow"}
    </button>
  );
}
