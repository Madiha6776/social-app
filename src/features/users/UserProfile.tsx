import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineUserPlus,
} from "react-icons/hi2";
import { getUserProfile } from "./apis/users.api";
import { getUserPosts } from "../profile/apis/getUserPosts";
import { authContext } from "../../context/AuthContext";
import { PostItem } from "../auth/feed/PostItem";
import { getAvatar } from "../../utilitis/get-avatar";
import type { Post } from "../../interfaces/post.interface";
import Loading from "../../components/ui/Loading";
import FollowButton from "./FollowButton";
import { Helmet } from "react-helmet-async";

export default function UserProfile() {
  const { userId } = useParams();

  const context = useContext(authContext);
  if (!context) throw new Error();
  const { user: me } = context;

  // ===== بياناته =====
  const { data, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });
  
  const user = data?.data?.user;
  const isFollowing = data?.data?.isFollowing ?? false;

  // ===== بوستاته =====
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getUserPosts(userId!),
    enabled: !!userId,
  });
  const posts: Post[] = postsData?.data?.posts ?? [];

  if (userId === me?._id) return <Navigate to="/profile" />;
  if (isLoading) return <Loading />;

  const stats = [
    { label: "Posts", value: posts.length, Icon: HiOutlineDocumentText },
    {
      label: "Followers",
      value: user?.followersCount ?? 0,
      Icon: HiOutlineUserCircle,
    },
    {
      label: "Following",
      value: user?.followingCount ?? 0,
      Icon: HiOutlineUserPlus,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Helmet>
        <title>{`${user?.name ?? "Profile"} | Route Posts`}</title>
        <meta
          name="description"
          content={`See ${user?.name ?? "this user"}'s posts on Route Posts`}
        />
      </Helmet>
      {/* ===== الهيدر ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-48 md:h-64 bg-linear-to-br from-[#123dec] via-[#a5b4fc] to-[#818cf8]">
          {user?.cover && (
            <img
              src={user.cover}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="px-6 pb-6 flex flex-col items-center">
          <img
            src={getAvatar(user)}
            alt={user?.name}
            className="-mt-16 h-32 w-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
          />
          <h1 className="mt-3 text-xl font-bold text-slate-900">
            {user?.name}
          </h1>
          <p className="text-sm text-slate-500">@{user?.username}</p>

          <div className="flex gap-10 my-5">
            {stats.map(({ label, value, Icon }) => (
              <div key={label} className="text-center">
                <Icon className="text-2xl text-slate-500 mx-auto" />
                <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <FollowButton userId={userId!} isFollowing={isFollowing} size="lg" />
        </div>
      </div>

      {/* ===== البوستات ===== */}
      <div className="mt-6">
        {postsLoading ? (
          <Loading />
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
            No posts yet
          </div>
        ) : (
          posts.map((post) => <PostItem key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}
