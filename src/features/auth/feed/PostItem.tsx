import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../../interfaces/post.interface";
import AddComment from "../../comments/AddComment";
import PostMenu from "../../posts/componets/PostMenu";
import SharePost from "../../posts/componets/SharePost";
import PostPrivacy from "../../posts/componets/PostPrivacy";
import { likePost } from "../../posts/apis/likePost.api";
import { authContext } from "../../../context/AuthContext";
import {
  HiOutlineHandThumbUp,
  HiHandThumbUp,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineShare,
} from "react-icons/hi2";
import { timeAgo } from "../../../utilitis/time-ago";
import { getAvatar } from "../../../utilitis/get-avatar";

export function PostItem({ post }: { post: Post }) {
  const context = useContext(authContext);
  if (!context) throw new Error();
  const { user } = context;

  const query = useQueryClient();
  const [openShare, setOpenShare] = useState(false);

  // ===== LIKE =====
  const { mutate, data, isPending } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["posts"] });
      query.invalidateQueries({ queryKey: ["post", post._id] });
      query.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const isMyPost = post.user?._id === user?._id;
  const isLiked = data ? data.data.liked : user ? post.likes?.includes(user._id) : false;

  function handleLike() {
    mutate({ postId: post._id });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-4">
      {/* ===== الهيدر ===== */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to={isMyPost ? "/profile" : `/profile/${post.user?._id}`}>
            <img
              src={getAvatar(post.user)}
              alt={post.user?.name}
              className="h-11 w-11 rounded-full object-cover border border-slate-200"
            />
          </Link>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">
              <Link to={isMyPost ? "/profile" : `/profile/${post.user?._id}`} className="hover:underline">
                {post.user?.name}
              </Link>
              {post.isShare && <span className="font-normal text-slate-500"> shared a post</span>}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Link to={`/postdetails/${post._id}`} className="hover:underline">
                {timeAgo(post.createdAt)}
              </Link>
              <span>·</span>
              <PostPrivacy postId={post._id} privacy={post.privacy} isMyPost={isMyPost} body={post.body} />
            </div>
          </div>
        </div>

        <PostMenu postId={post._id} isMyPost={isMyPost} body={post.body} image={post.image} />
      </div>

      {/* ===== الكلام ===== */}
      {post.body && (
        <p dir="auto" className="px-4 pb-3 text-slate-800 whitespace-pre-line">
          {post.body}
        </p>
      )}

      {/* ===== الصورة ===== */}
      {post.image && (
        <div className="bg-slate-100 border-y border-slate-200">
          <img src={post.image} alt="" className="w-full max-h-125 object-contain mx-auto" />
        </div>
      )}

      {/* ===== البوست المتشير ===== */}
      {post.isShare &&
        (post.sharedPost ? (
          <Link
            to={`/postdetails/${post.sharedPost._id}`}
            className="block mx-4 mb-3 border border-slate-200 rounded-xl overflow-hidden hover:bg-slate-50 transition"
          >
            {post.sharedPost.image && (
              <img src={post.sharedPost.image} alt="" className="w-full max-h-96 object-contain bg-slate-100" />
            )}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <img src={getAvatar(post.sharedPost.user)} alt="" className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{post.sharedPost.user?.name}</p>
                  <p className="text-xs text-slate-500">{timeAgo(post.sharedPost.createdAt)}</p>
                </div>
              </div>
              {post.sharedPost.body && (
                <p dir="auto" className="text-sm text-slate-700 whitespace-pre-line line-clamp-4">
                  {post.sharedPost.body}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="mx-4 mb-3 border border-slate-200 rounded-xl p-4 bg-slate-50 text-sm text-slate-500">
            <p className="font-semibold text-slate-700">This content isn't available</p>
            The original post may have been deleted.
          </div>
        ))}

      {/* ===== الأرقام ===== */}
      <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          {post.likesCount > 0 && (
            <>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00298d] text-white">
                <HiHandThumbUp className="text-xs" />
              </span>
              <span>{post.likesCount}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/postdetails/${post._id}`} className="flex items-center gap-1 hover:underline">
            <HiOutlineChatBubbleOvalLeft />
            {post.commentsCount} {post.commentsCount === 1 ? "comment" : "comments"}
          </Link>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* ===== الأزرار ===== */}
      <div className="grid grid-cols-3 border-t border-slate-200 mx-4 py-1">
        <button
          onClick={handleLike}
          disabled={isPending}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg font-semibold hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 ${
            isLiked ? "text-[#00298d]" : "text-slate-600"
          }`}
        >
          {isLiked ? <HiHandThumbUp className="text-xl" /> : <HiOutlineHandThumbUp className="text-xl" />}
          Like
        </button>

        <Link
          to={`/postdetails/${post._id}`}
          className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
        >
          <HiOutlineChatBubbleOvalLeft className="text-xl" />
          Comment
        </Link>

        <button
          onClick={() => setOpenShare(true)}
          className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <HiOutlineShare className="text-xl" />
          Share
        </button>
      </div>

      {/* ===== أول كومنت ===== */}
      {post.topComment && (
        <div className="flex gap-2 px-4 pb-2 pt-2 border-t border-slate-100">
          <img
            src={getAvatar(post.topComment.commentCreator)}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="bg-slate-100 rounded-2xl px-3 py-2">
            <p className="text-sm font-bold text-slate-900">{post.topComment.commentCreator?.name}</p>
            <p dir="auto" className="text-sm text-slate-700">{post.topComment.content}</p>
          </div>
        </div>
      )}

      {post.commentsCount > 1 && (
        <div className="px-4 pb-2">
          <Link to={`/postdetails/${post._id}`} className="text-sm text-slate-500 hover:underline font-medium">
            View all {post.commentsCount} comments
          </Link>
        </div>
      )}

      {/* ===== مودال الشير ===== */}
      <SharePost
        post={(post.sharedPost ?? post) as Post}
        show={openShare}
        onClose={() => setOpenShare(false)}
      />

      {/* ===== إضافة كومنت ===== */}
      <AddComment postId={post._id} />
    </div>
  );
}