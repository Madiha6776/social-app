import { useContext, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Post } from "../../../interfaces/post.interface";
import { sharePost } from "../apis/sharePost.api";
import { authContext } from "../../../context/AuthContext";
import { getAvatar } from "../../../utilitis/get-avatar";

export default function SharePost({
  post,
  show,
  onClose,
}: {
  post: Post;
  show: boolean;
  onClose: () => void;
}) {
  const context = useContext(authContext);
  if (!context) throw new Error();
  const { user } = context;

  const query = useQueryClient();
  const [body, setBody] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      toast.success("Post shared");
      setBody("");
      onClose();
      query.invalidateQueries({ queryKey: ["posts"] });
      query.invalidateQueries({ queryKey: ["post", post._id] });
      query.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function handleShare(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ postId: post._id, body });
  }

  return (
    <Modal show={show} onClose={onClose} size="lg" dismissible>
      <ModalHeader>Share post</ModalHeader>
      <ModalBody>
        <form onSubmit={handleShare}>
          {/* أنا */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={getAvatar(user ?? undefined)}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-bold text-slate-900">{user?.name}</span>
          </div>

          {/* الكلام */}
          <textarea
            dir="auto"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Say something about this..."
            rows={3}
            className="w-full resize-none border-0 bg-transparent text-lg outline-none focus:ring-0 placeholder:text-slate-400"
          />

          {/* معاينة البوست الأصلي */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
            {post.image && (
              <img
                src={post.image}
                alt=""
                className="w-full max-h-48 object-cover"
              />
            )}
            <div className="p-3">
              <p className="text-sm font-bold text-slate-900">
                {post.user?.name}
              </p>
              {post.body && (
                <p dir="auto" className="text-sm text-slate-600 line-clamp-2">
                  {post.body}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#00298d] text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Sharing..." : "Share now"}
          </button>
        </form>
      </ModalBody>
    </Modal>
  );
}
