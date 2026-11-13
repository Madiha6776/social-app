import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dropdown, DropdownItem } from "flowbite-react";
import EmojiPicker from "emoji-picker-react";
import {
  HiOutlinePhoto,
  HiOutlineFaceSmile,
  HiOutlinePaperAirplane,
  HiXMark,
  HiOutlineGlobeAmericas,
  HiOutlineUsers,
  HiOutlineLockClosed,
  HiChevronDown,
} from "react-icons/hi2";
import { createPost } from "../apis/createPost.api";



// اختيارات الخصوصية
const privacyOptions = [
  { value: "public", label: "Public", Icon: HiOutlineGlobeAmericas },
  { value: "following", label: "Followers", Icon: HiOutlineUsers },
  { value: "only_me", label: "Only me", Icon: HiOutlineLockClosed },
];

export default function CreatePost() {
  const me = JSON.parse(localStorage.getItem("user") || "null");
  const myAvatar =
    !me?.photo || me.photo.includes("default-profile")
      ? me?.gender === "female"
        ? "/img/female.png"
        : "/img/male.png"
      : me.photo;

  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState("");
  const [showFeelings, setShowFeelings] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const current = privacyOptions.find((o) => o.value === privacy) ?? privacyOptions[0];

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      if (body.trim()) formData.append("body", body);
      if (image) formData.append("image", image);
      formData.append("privacy", privacy);
      return createPost(formData);
    },

    
    onSuccess: () => {
      handleCancel();
      setPrivacy("public");
      toast.success("Post created");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function handleSubmit() {
    if ((!body.trim() && !image) || isPending) return;
    mutate();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImgPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImage(null);
    setImgPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleCancel() {
    removeImage();
    setBody("");
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">
      <div className="flex gap-3">
        <img src={myAvatar} alt="" className="h-11 w-11 rounded-full object-cover" />

        <div className="flex-1">
          {/* ===== الاسم + الخصوصية ===== */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-slate-900">{me?.name}</span>
            <span className="text-slate-400">·</span>

            <Dropdown
              inline
              arrowIcon={false}
              placement="bottom-start"
              className="rounded-2xl border border-slate-200 shadow-lg py-2 min-w-48"
              label={
                <span className="flex items-center gap-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg px-2 py-1">
                  <current.Icon className="text-base" />
                  {current.label}
                  <HiChevronDown className="text-xs" />
                </span>
              }
            >
              {privacyOptions.map(({ value, label, Icon }) => (
                <DropdownItem
                  key={value}
                  onClick={() => setPrivacy(value)}
                  className={`gap-3 px-5 py-3 text-base ${
                    privacy === value ? "text-[#00298d] font-semibold" : "text-slate-700"
                  }`}
                >
                  <Icon className="text-xl" />
                  {label}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          {/* ===== الخانة ===== */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            dir="auto"
            placeholder={`What's on your mind, ${me?.name ?? ""}?`}
            rows={2}
            className="w-full resize-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-[#00298d]/20"
          />
        </div>
      </div>

      {/* ===== معاينة الصورة ===== */}
      {imgPreview && (
        <div className="relative mt-3">
          <img
            src={imgPreview}
            alt=""
            className="w-full max-h-80 object-contain rounded-xl bg-slate-100"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow cursor-pointer"
          >
            <HiXMark className="text-lg" />
          </button>
        </div>
      )}

      {/* ===== الأزرار ===== */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition cursor-pointer"
          >
            <HiOutlinePhoto className="text-2xl text-emerald-600" />
            Photo/video
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFeelings(!showFeelings)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition cursor-pointer"
            >
              <HiOutlineFaceSmile className="text-2xl text-amber-500" />
              Feeling/activity
            </button>

            {showFeelings && (
              <div className="absolute left-0 bottom-full mb-2 z-20">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setBody(body + emojiData.emoji);
                    setShowFeelings(false);
                  }}
                />
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImage}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={(!body.trim() && !image) || isPending}
          className="flex items-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold px-6 py-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? "Posting..." : "Post"}
          <HiOutlinePaperAirplane className="text-lg" />
        </button>
      </div>
    </div>
  );
}