import { useQuery } from "@tanstack/react-query";
import { HiOutlineBookmark } from "react-icons/hi2";
import { getBookmarks } from "../apis/bookmarks.api";
import type { Post } from "../../../interfaces/post.interface";
import { PostItem } from "../../auth/feed/PostItem";
import Loading from "../../../components/ui/Loading";

export default function SavedPosts() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
  });

  const bookmarks: Post[] = data?.data?.bookmarks ?? [];

  if (isLoading) return <Loading />;

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-500">
        <HiOutlineBookmark className="text-5xl mx-auto text-slate-300 mb-2" />
        <p className="font-semibold text-slate-700">No saved posts yet</p>
        <p className="text-sm">Posts you save will appear here</p>
      </div>
    );
  }

  return (
    <>
      {bookmarks.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </>
  );
}