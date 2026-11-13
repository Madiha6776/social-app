import { useQuery } from "@tanstack/react-query";
import { getPostComment } from "./apis/comments.api";
import Loading from "../../components/ui/Loading";
import type { Comment } from "../../interfaces/comment.interface";
import CommentCard from "./CommentCard";

export default function Comments({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comment", id],
    queryFn: () => getPostComment(id),
  });

  if (isLoading) return <Loading />;

  if (isError)
    return <h2 className="text-rose-600 text-center py-4">{error.message}</h2>;

const comments: Comment[] = data?.data?.comments ?? [];

return (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
    {/* العنوان + العدد */}
    <div className="flex items-center gap-2 mb-4">
      <h3 className="font-bold text-slate-900">Comments</h3>
      <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
        {comments.length}
      </span>
    </div>

    {/* لو مفيش كومنتات */}
    {comments.length === 0 && (
      <p className="text-sm text-slate-500 text-center py-6">
        No comments yet. Be the first! 💬
      </p>
    )}

    {/* الكومنتات */}
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <CommentCard comment={comment} key={comment._id} />
      ))}
    </div>
  </div>
);}