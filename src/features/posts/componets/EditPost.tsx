import { useRef, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HiOutlinePhoto, HiXMark } from "react-icons/hi2";
import { updatePost } from "../apis/updatePost.api";

export default function EditPost({
  postId,
  body = "",
  image,
  show,
  onClose,
}: {
  postId: string;
  body?: string;
  image?: string;
  show: boolean;
  onClose: () => void;
}) {
  const query = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState(body);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(image ?? null);
  const [deleteOldImage, setDeleteOldImage] = useState(false);

  // ===== UPDATE =====
  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Post updated");
      onClose();
      query.invalidateQueries({ queryKey: ["posts"] });
      query.invalidateQueries({ queryKey: ["post", postId] });
      query.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
    setDeleteOldImage(false);
  }

  function removeImage() {
    setImgFile(null);
    setImgPreview(null);
    if (image) setDeleteOldImage(true);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleCancel() {
    setContent(body);
    setImgFile(null);
    setImgPreview(image ?? null);
    setDeleteOldImage(false);
    onClose();
  }

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim() && !imgPreview) {
      toast.error("Post can't be empty");
      return;
    }

    const formData = new FormData();
    if (content.trim()) formData.append("body", content);
    if (imgFile) formData.append("image", imgFile);
    if (deleteOldImage) formData.append("removeImage", "true");

    mutate({ formData, postId });
  }

  return (
    <Modal show={show} onClose={handleCancel} size="lg" dismissible>
      <ModalHeader>Edit post</ModalHeader>
      <ModalBody>
        <form onSubmit={handleUpdate}>
          <textarea
            dir="auto"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:bg-white focus:border-[#00298d] focus:ring-2 focus:ring-blue-100"
          />

          {/* الصورة */}
          {imgPreview && (
            <div className="relative mt-3 rounded-xl overflow-hidden border border-slate-200">
              <img src={imgPreview} alt="" className="w-full max-h-72 object-contain bg-slate-100" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow cursor-pointer"
                title="Remove image"
              >
                <HiXMark className="text-lg" />
              </button>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-emerald-600 font-semibold px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <HiOutlinePhoto className="text-xl" />
              {imgPreview ? "Change photo" : "Add photo"}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="bg-[#00298d] hover:bg-[#001f6b] text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}