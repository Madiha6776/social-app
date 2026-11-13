import { useContext, useState } from "react";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";
import type { Comment } from "../../interfaces/comment.interface";
import { getAvatar } from "../../utilitis/get-avatar";
import { timeAgo } from "../../utilitis/time-ago";
import { deleteComment, updateComment, likeComment } from "./apis/comments.api";
import { authContext } from "../../context/AuthContext";
import Replies from "./Replies";

export default function CommentCard({
  comment,
  isReply = false,
}: {
  comment: Comment;
  isReply?: boolean;
}) {
  const context = useContext(authContext);
  const myId = context?.user?._id;
  const isMyComment = comment.commentCreator?._id === myId;
  const isLiked = myId ? comment.likes.includes(myId) : false;
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);

  // ===== DELETE =====
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: ["comment", comment.post] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // ===== UPDATE =====
  const { mutate: updateMutate, isPending } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      toast.success("Comment updated");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["comment", comment.post] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
  });

  // ===== LIKE =====
  const { mutate: likeMutate, isPending: likePending } = useMutation({
    mutationFn: likeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment", comment.post] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  function handleDelete() {
    if (confirm("Delete this comment?")) {
      deleteMutate({ postId: comment.post, commentId: comment._id });
    }
  }

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;
    const formData = new FormData();
    formData.append("content", content);
    updateMutate({ formData, postId: comment.post, commentId: comment._id });
  }

  function handleCancel() {
    setContent(comment.content);
    setIsEditing(false);
  }

  function handleLike() {
    likeMutate({ postId: comment.post, commentId: comment._id });
  }

  return (
    <div>
      <div className="flex gap-2 group">
        <img
          src={getAvatar(comment.commentCreator)}
          alt=""
          className={`${isReply ? "h-7 w-7" : "h-8 w-8"} rounded-full object-cover shrink-0`}
        />

        <div className="min-w-0">
          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <input
                autoFocus
                dir="auto"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && handleCancel()}
                className="w-80 max-w-full bg-slate-100 border-0 rounded-2xl px-3 py-2 text-sm outline-none focus:ring-0"
              />
              <p className="text-xs text-slate-500 mt-1 ml-3">
                {isPending ? (
                  "Saving..."
                ) : (
                  <>
                    Press Esc to{" "}
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-[#1877f2] hover:underline cursor-pointer"
                    >
                      cancel
                    </button>
                  </>
                )}
              </p>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-1">
                {/* الفقاعة */}
                <div className="relative bg-slate-100 rounded-2xl px-3 py-2">
                  <p className="text-[13px] font-semibold text-slate-900">
                    {comment.commentCreator?.name}
                  </p>
                  <p
                    dir="auto"
                    className="text-[15px] text-slate-900 whitespace-pre-line wrap-break-word"
                  >
                    {comment.content}
                  </p>

                  {/*عدد اللايكات */}
                  {comment.likes.length > 0 && (
                    <span className="absolute -bottom-2 -right-2 flex items-center gap-0.5 bg-white rounded-full shadow px-1.5 py-0.5 text-xs text-slate-600">
                      👍 {comment.likes.length}
                    </span>
                  )}
                </div>

                {/* ⋯ hover */}
                {isMyComment && (
                  <div className="opacity-0 group-hover:opacity-100 transition">
                    <Dropdown
                      inline
                      arrowIcon={false}
                      placement="bottom-start"
                      className="rounded-lg shadow-lg py-1 min-w-32"
                      label={
                        <span className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 flex">
                          <HiOutlineEllipsisHorizontal className="text-lg" />
                        </span>
                      }
                    >
                      <DropdownItem
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-semibold"
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        onClick={handleDelete}
                        className="text-sm font-semibold"
                      >
                        Delete
                      </DropdownItem>
                    </Dropdown>
                  </div>
                )}
              </div>

              {comment.image && (
                <img
                  src={comment.image}
                  alt=""
                  className="mt-1 max-h-48 rounded-2xl object-cover"
                />
              )}

              {/* 2h · Like · Reply */}
              <div
                className={`flex items-center gap-4 ml-3 text-xs font-bold text-slate-500 ${comment.likes.length > 0 ? "mt-2.5" : "mt-0.5"}`}
              >
                {" "}
                <span className="font-normal">
                  {timeAgo(comment.createdAt)}
                </span>
                <button
                  onClick={handleLike}
                  disabled={likePending}
                  className={`hover:underline cursor-pointer disabled:opacity-50 ${isLiked ? "text-[#1877f2]" : ""}`}
                >
                  Like
                </button>
                {!isReply && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="hover:underline cursor-pointer"
                  >
                    Reply
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* الردود */}
      {showReplies && <Replies comment={comment} />}
    </div>
  );
}
