import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { HiOutlinePhoto, HiOutlineFaceSmile, HiOutlinePaperAirplane, HiXMark } from "react-icons/hi2";
import type { Comment } from "../../interfaces/comment.interface";
import { getReplies, addReply } from "./apis/replies.api";
import { getAvatar } from "../../utilitis/get-avatar";
import CommentCard from "./CommentCard";

export default function Replies({ comment }: { comment: Comment }) {
  const me = JSON.parse(localStorage.getItem("user") || "null");
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ===== جلب الردود =====
  const { data, isLoading } = useQuery({
    queryKey: ["replies", comment._id],
    queryFn: () => getReplies({ postId: comment.post, commentId: comment._id }),
  });
  const replies: Comment[] = data?.data?.replies ?? [];

  // ===== إضافة رد =====
  const { mutate, isPending } = useMutation({
    mutationFn: addReply,
    onSuccess: () => {
      handleCancel();
      toast.success("Reply added");
      queryClient.invalidateQueries({ queryKey: ["replies", comment._id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImgPreview(URL.createObjectURL(file));
  }

  function handleReply() {
    if ((!content.trim() && !image) || isPending) return;
    const formData = new FormData();
    if (content.trim()) formData.append("content", content);
    if (image) formData.append("image", image);
    mutate({ postId: comment.post, commentId: comment._id, formData });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  }

  function handleCancel() {
    setContent("");
    setImage(null);
    setImgPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="ml-14 mt-2 border-l-2 border-slate-200 pl-4">
      {/* الردود */}
      {isLoading ? (
        <p className="text-sm text-slate-400">Loading replies...</p>
      ) : replies.length === 0 ? (
        <p className="text-sm text-slate-500">No replies yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {replies.map((reply) => (
            <CommentCard key={reply._id} comment={reply} isReply />
          ))}
        </div>
      )}

      {/* Replying to */}
      <p className="text-sm text-slate-500 mt-3 mb-2">
        Replying to <span className="font-semibold">{comment.commentCreator?.name}</span>
      </p>

      {/* خانة الرد */}
      <div className="flex gap-2">
        <img src={getAvatar(me)} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            dir="auto"
            rows={2}
            placeholder="Write a reply..."
            className="w-full resize-none bg-transparent border-0 p-0 text-sm outline-none focus:ring-0"
          />

          {imgPreview && (
            <div className="relative inline-block mt-2">
              <img src={imgPreview} alt="" className="h-20 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImgPreview("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow cursor-pointer"
              >
                <HiXMark className="text-sm" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3 text-slate-500 relative">
              <button type="button" onClick={() => fileRef.current?.click()} className="hover:text-slate-700 cursor-pointer">
                <HiOutlinePhoto className="text-xl" />
              </button>
              <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="hover:text-slate-700 cursor-pointer">
                <HiOutlineFaceSmile className="text-xl" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />

              {showEmoji && (
                <div className="absolute left-0 bottom-full mb-2 z-20">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setContent(content + emojiData.emoji);
                      setShowEmoji(false);
                    }}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleReply}
              disabled={(!content.trim() && !image) || isPending}
              className="h-11 w-11 flex items-center justify-center rounded-full bg-[#1877f2] text-white hover:bg-[#166fe5] disabled:opacity-40 cursor-pointer"
            >
              <HiOutlinePaperAirplane className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}