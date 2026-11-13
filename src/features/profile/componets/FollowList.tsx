import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { HiOutlineUsers } from "react-icons/hi2";
import { getUserProfile } from "../../users/apis/users.api";
import type { FollowUser } from "../../../interfaces/followUser.interface";
import { getAvatar } from "../../../utilitis/get-avatar";
import FollowButton from "../../users/FollowButton";
import Loading from "../../../components/ui/Loading";

export default function FollowList({
  userId,
  type,
}: {
  userId: string;
  type: "followers" | "following";
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });

  const users: FollowUser[] = data?.data?.user?.[type] ?? [];

  if (isLoading) return <Loading />;

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-500">
        <HiOutlineUsers className="text-5xl mx-auto text-slate-300 mb-2" />
        {type === "followers"
          ? "No followers yet"
          : "You're not following anyone yet"}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
      {users.map((person) => (
        <div
          key={person._id}
          className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition"
        >
          <Link
            to={`/profile/${person._id}`}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <img
              src={getAvatar(person)}
              alt=""
              className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate hover:underline">
                {person.name}
              </p>
              <p className="text-xs text-slate-500">View profile</p>{" "}
            </div>
          </Link>

          {type === "following" && (
            <FollowButton userId={person._id} isFollowing={true} />
          )}
        </div>
      ))}
    </div>
  );
}
