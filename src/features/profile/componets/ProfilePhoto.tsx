import { useContext, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HiOutlineCamera } from "react-icons/hi2";
import { uploadPhoto } from "../apis/uploadPhoto.api";
import { getMyProfile } from "../apis/profile.api";
import { authContext } from "../../../context/AuthContext";
import { getAvatar } from "../../../utilitis/get-avatar";

export default function ProfilePhoto({ user }: { user: any }) {
  const context = useContext(authContext);
  if (!context) throw new Error();
  const { setUser } = context;

  const query = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: async () => {
      toast.success("Profile photo updated");
      setPreview(null);

      // Navbarتعديل صورتي في الـ
      const res = await getMyProfile();
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      query.invalidateQueries({ queryKey: ["profile"] });
      query.invalidateQueries({ queryKey: ["posts"] });
      query.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error: any) => {
      setPreview(null);
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function handleUploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("photo", file);
    mutate(formData);

    e.target.value = "";
  }

  return (
    <div className="relative">
      <img
        src={preview ?? getAvatar(user)}
        alt={user?.name}
        className={`h-32 w-32 rounded-full object-cover border-4 border-white shadow-md bg-white ${
          isPending ? "opacity-50" : ""
        }`}
      />

      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-8 w-8 border-4 border-white border-t-[#00298d] rounded-full animate-spin" />
        </span>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUploadPhoto}
      />

      <button
        onClick={() => fileRef.current?.click()}
        disabled={isPending}
        className="absolute bottom-1 right-1 bg-[#00298d] text-white p-2 rounded-full shadow hover:bg-[#001f6b] cursor-pointer disabled:opacity-50"
        title="Change photo"
      >
        <HiOutlineCamera className="text-lg" />
      </button>
    </div>
  );
}
