import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./apis/posts.api";
import { PostItem } from "./PostItem";
import Loading from "../../../components/ui/Loading";
import CreatePost from "../../posts/componets/CreatePost";
import type { Post } from "../../../interfaces/post.interface";
import FollowSuggestions from "../../users/FollowSuggestions";
import { Helmet } from "react-helmet-async";

export default function Feed() {
  const { isLoading, data, isError } = useQuery({
    refetchInterval: 5000,
    refetchOnMount: false,
    staleTime: 3000,
    refetchOnWindowFocus: false,
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <p className="text-center text-rose-600 py-10">Something went wrong</p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,42rem)_1fr] gap-6">
      <Helmet>
        <title>Feed | Route Posts</title>
        <meta
          name="description"
          content="See the latest posts from people you follow"
        />
      </Helmet>

      <div className="hidden lg:block" />

      <main className="min-w-0">
        <CreatePost />
        {data?.data?.posts?.map((post: Post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </main>

      <aside className="hidden lg:block">
        <div className="w-full max-w-80">
          <FollowSuggestions />
        </div>
      </aside>
    </div>
  );
}
