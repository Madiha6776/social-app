import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HiOutlinePhoto, HiXMark } from "react-icons/hi2";
import { addComment } from "./apis/comments.api";

export default function AddComment({ postId }: { postId: string }) {

  // --------------(على حسب صورتي ـ gender) --------------
  const me = JSON.parse(localStorage.getItem("user") || "null");
  const myAvatar =
    !me?.photo || me.photo.includes("default-profile")
      ? me?.gender === "female"
        ? "/img/female.png"
        : "/img/male.png"
      : me.photo;

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      handleCancel();
      toast.success("Comment added");
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["comment", postId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function handleContent(e: React.ChangeEvent<HTMLInputElement>) {
    setContent(e.target.value);
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImgPreview(URL.createObjectURL(file));
  }

  function handleComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    if ((!content.trim() && !image) || isPending) return;

    const formData = new FormData();
    if (content.trim()) formData.append("content", content);
    if (image) formData.append("image", image);

    mutate({ formData, postId });
  }

  function removeImage() {
    setImage(null);
    setImgPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleCancel() {
    removeImage();
    setContent("");
  }

  return (
    <div className="px-4 pb-4 pt-3 border-t border-slate-100">


      <form onSubmit={handleComment} className="flex items-center gap-2">
        <img src={myAvatar} alt="Your Avatar" className="w-8 h-8 rounded-full object-cover" />

        <div className="flex-1 flex items-center bg-slate-100 rounded-full pr-2 focus-within:ring-2 focus-within:ring-[#00298d]/20">
          <input
            type="text"
            dir="auto"
            value={content}
            onChange={handleContent}
            placeholder="Write a comment..."
            className="flex-1 bg-transparent border-0 px-4 py-2 text-sm outline-none focus:ring-0"
          />

          {/* زرار صورة الكومنت */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 cursor-pointer"
          >
            <HiOutlinePhoto className="text-lg" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />
        </div>

        <button
          type="submit"
          disabled={(!content.trim() && !image) || isPending}
          className="text-sm font-bold text-[#00298d] hover:text-[#001f6b] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? "..." : "Post"}
        </button>
      </form>

      {/* معاينة صورة الكومنت */}
      {imgPreview && (
        <div className="relative inline-block mt-2 ml-10">
          <img src={imgPreview} alt="" className="h-20 rounded-lg object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow cursor-pointer"
          >
            <HiXMark className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}