import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSinglePost } from "../apis/postDetails.api";
import Loading from "../../../components/ui/Loading";
import { PostItem } from "../../auth/feed/PostItem";
import CommentsList from "../../comments/CommentsList";
import { Helmet } from "react-helmet-async";

export default function PostDetails() {
  const { id } = useParams();

  const { data, isError, error, isLoading } = useQuery({
    refetchOnMount: false,
    queryKey: ["post", id],
    enabled: !!id,
    queryFn: () => getSinglePost(id!),
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <p className="text-center text-rose-600 py-10">
        {(error as any)?.response?.data?.message || error.message}
      </p>
    );

  const post = data?.data?.post;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
            <Helmet>
        <title>
          {post?.body
            ? `${post.user?.name}: "${post.body.slice(0, 40)}" | Route Posts`
            : `${post?.user?.name ?? "Post"} | Route Posts`}
        </title>
        <meta name="description" content={post?.body?.slice(0, 150) ?? "Post on Route Posts"} />
      </Helmet>
      {/* البوست */}
      {post && <PostItem post={post} />}

      {/* CommentsList */}
      <CommentsList id={id!} />
    </div>
  );
}