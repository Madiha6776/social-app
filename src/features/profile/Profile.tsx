import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineUserPlus,
  HiOutlineEnvelope,
  HiOutlineCake,
  HiOutlineUser,
  HiOutlineCalendarDays,
  HiOutlineBookmark,
  HiOutlineUsers,
  HiOutlineCamera,
} from "react-icons/hi2";
import { getMyProfile } from "./apis/profile.api";
import { getUserPosts } from "./apis/getUserPosts";
import { PostItem } from "../auth/feed/PostItem";
import CreatePost from "../posts/componets/CreatePost";
import Loading from "../../components/ui/Loading";
import type { Post } from "../../interfaces/post.interface";
import SavedPosts from "./componets/SavedPosts";
import ProfilePhoto from "./componets/ProfilePhoto";
import FollowList from "./componets/FollowList";

const tabs = [
  { key: "posts", label: "Posts", Icon: HiOutlineDocumentText },
  { key: "followers", label: "Followers", Icon: HiOutlineUserCircle },
  { key: "following", label: "Following", Icon: HiOutlineUsers },
  { key: "saved", label: "Saved", Icon: HiOutlineBookmark },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");

  // ===== بياناتي =====
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });
  const user = profileData?.data?.user;

  // ===== بوستاتي =====
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", user?._id],
    queryFn: () => getUserPosts(user._id),
    enabled: !!user?._id,
  });
  const posts: Post[] = postsData?.data?.posts ?? [];

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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Helmet>
        <title>{`${user?.name ?? "Profile"} | Route Posts`}</title>
        <meta
          name="description"
          content="Your profile, posts and saved posts"
        />
      </Helmet>

      {/* ================= الهيدر ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cover */}
        <div className="relative h-48 md:h-72 bg-linear-to-br from-[#123dec] via-[#a5b4fc] to-[#818cf8]">
          {user?.cover && <img src={user.cover} alt="" className="w-full h-full object-cover" />}

          <button className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 hover:bg-white text-slate-800 font-semibold px-4 py-2 rounded-xl shadow-sm backdrop-blur cursor-pointer transition">
            <HiOutlineCamera className="text-lg" />
            Edit cover photo
          </button>
        </div>

        {/* الصورة + الأرقام + الأزرار */}
        <div className="relative px-6 pb-6 md:min-h-40">
          {/* الصورة والاسم (نص) */}
          <div className="flex flex-col items-center -mt-16 md:absolute md:left-1/2 md:-translate-x-1/2">
            <ProfilePhoto user={user} />
            <h1 className="mt-3 text-xl font-bold text-slate-900">
              {user?.name}
            </h1>
            <p className="text-sm text-slate-500">@{user?.username}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
            {/* الأرقام (شمال) */}
            <div className="flex gap-10">
              {stats.map(({ label, value, Icon }) => (
                <div key={label} className="text-center">
                  <Icon className="text-2xl text-slate-500 mx-auto" />
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {value.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* التابات */}
        <div className="bg-[#eef2ff] flex justify-center md:justify-end gap-2 px-4 overflow-x-auto">
          {tabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === key
                  ? "border-[#00298d] text-[#00298d]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="text-lg" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= تحت الهيدر ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Introduction (شمال) */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:sticky md:top-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Introduction
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Hello, I am {user?.name}. Welcome to my profile 👋
            </p>

            <ul className="mt-5 flex flex-col gap-4 text-sm font-medium text-slate-800">
              <li className="flex items-center gap-3">
                <HiOutlineEnvelope className="text-xl text-slate-500" />
                {user?.email}
              </li>
              {user?.dateOfBirth && (
                <li className="flex items-center gap-3">
                  <HiOutlineCake className="text-xl text-slate-500" />
                  {new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </li>
              )}
              {user?.gender && (
                <li className="flex items-center gap-3 capitalize">
                  <HiOutlineUser className="text-xl text-slate-500" />
                  {user.gender}
                </li>
              )}
              <li className="flex items-center gap-3">
                <HiOutlineCalendarDays className="text-xl text-slate-500" />
                Joined{" "}
                {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </li>
            </ul>
          </div>
        </aside>

        {/* البوستات (يمين) */}
        <main className="md:col-span-2">
          {activeTab === "posts" ? (
            <>
              <CreatePost />
              {postsLoading ? (
                <p className="text-center text-slate-400 py-6">
                  Loading posts...
                </p>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
                  No posts yet ✍️
                </div>
              ) : (
                posts.map((post) => <PostItem key={post._id} post={post} />)
              )}
            </>
          ) : activeTab === "saved" ? (
            <SavedPosts />
          ) : activeTab === "followers" ? (
            <FollowList userId={user._id} type="followers" />
          ) : (
            <FollowList userId={user._id} type="following" />
          )}
        </main>
      </div>
    </div>
  );
}
