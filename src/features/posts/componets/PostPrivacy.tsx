import { useState } from "react";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HiOutlineGlobeAmericas, HiOutlineUsers, HiLockClosed, HiCheck } from "react-icons/hi2";
import { updatePrivacy } from "../apis/updatePrivacy.api";

const options = [
  { value: "public", label: "Public", desc: "Anyone can see this post", Icon: HiOutlineGlobeAmericas },
  { value: "following", label: "Followers", desc: "Only your followers", Icon: HiOutlineUsers },
  { value: "only_me", label: "Only me", desc: "Only you can see this post", Icon: HiLockClosed },
];

export default function PostPrivacy({
  postId,
  privacy,
  isMyPost,
  body,
}: {
  postId: string;
  privacy: string;
  isMyPost: boolean;
  body?: string;
}) {
  const query = useQueryClient();
  const [current, setCurrent] = useState(privacy);

  const selected = options.find((o) => o.value === current) ?? options[0];
  const { Icon } = selected;

  const { mutate, isPending } = useMutation({
    mutationFn: updatePrivacy,
    onSuccess: () => {
      toast.success("Privacy updated");
      query.invalidateQueries({ queryKey: ["posts"] });
      query.invalidateQueries({ queryKey: ["post", postId] });
      query.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error: any) => {
      setCurrent(privacy); // رجّعها زي ما كانت
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function handlePrivacy(value: string) {
    if (value === current) return;
    setCurrent(value); // تتغيّر على طول قبل ما السيرفر يرد
    mutate({ postId, privacy: value, body });
  }

  // بوست حد تاني ← الأيقونة بس
  if (!isMyPost) {
    return <Icon className="text-sm" title={selected.label} />;
  }

  // بوستي ← dropdown
  return (
    <Dropdown
      inline
      arrowIcon={false}
      placement="bottom-start"
      className="rounded-2xl border border-slate-200 shadow-lg py-2 min-w-64"
      label={
        <span
          className={`flex items-center p-0.5 rounded hover:bg-slate-100 ${isPending ? "opacity-50" : ""}`}
          title={selected.label}
        >
          <Icon className="text-sm" />
        </span>
      }
    >
      <p className="px-4 pb-2 pt-1 text-sm font-bold text-slate-900">Who can see this post?</p>

      {options.map(({ value, label, desc, Icon: OptionIcon }) => (
        <DropdownItem key={value} onClick={() => handlePrivacy(value)} className="gap-3 px-4 py-2.5">
          <span className="bg-slate-100 p-2 rounded-full">
            <OptionIcon className="text-lg text-slate-700" />
          </span>
          <span className="flex-1 text-left">
            <span className="block text-sm font-semibold text-slate-900">{label}</span>
            <span className="block text-xs text-slate-500">{desc}</span>
          </span>
          {current === value && <HiCheck className="text-lg text-[#00298d]" />}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}