import { useState } from "react";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  HiOutlineEllipsisHorizontal,
  HiOutlineBookmark,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import { deletePost } from "../apis/deletePost.api";
import { bookmarkPost } from "../apis/bookmark.api";
import EditPost from "./EditPost";

export default function PostMenu({
  postId,
  isMyPost,
  body,
  image,
}: {
  postId: string;
  isMyPost: boolean;
  body?: string;
  image?: string;
}) {
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);

  // ===== DELETE =====
  const { mutate: removePost, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  // ===== BOOKMARK =====
  const { mutate: bookmarkMutate, isPending: isSaving } = useMutation({
    mutationFn: bookmarkPost,
    onSuccess: (data) => {
      toast.success(data?.data?.bookmarked ? "Post saved" : "Post removed from saved");
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  function handleDelete() {
    if (confirm("Are you sure you want to delete this post?")) removePost();
  }

  function handleBookmark() {
    bookmarkMutate({ postId });
  }

  return (
    <>
      <Dropdown
        inline
        arrowIcon={false}
        placement="bottom-end"
        className="rounded-2xl border border-slate-200 shadow-lg py-2 min-w-56"
        label={
          <span className="p-2 rounded-full hover:bg-slate-100 text-slate-500 flex">
            <HiOutlineEllipsisHorizontal className="text-xl" />
          </span>
        }
      >
        <DropdownItem
          onClick={handleBookmark}
          disabled={isSaving}
          className="gap-3 px-5 py-3 text-base text-slate-700"
        >
          <HiOutlineBookmark className="text-xl" />
          {isSaving ? "Saving..." : "Save post"}
        </DropdownItem>

        {isMyPost && (
          <>
            <DropdownItem
              onClick={() => setOpenEdit(true)}
              className="gap-3 px-5 py-3 text-base text-slate-700"
            >
              <HiOutlinePencilSquare className="text-xl" />
              Edit post
            </DropdownItem>

            <DropdownItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-3 px-5 py-3 text-base text-rose-600 hover:bg-rose-50"
            >
              <HiOutlineTrash className="text-xl" />
              {isDeleting ? "Deleting..." : "Delete post"}
            </DropdownItem>
          </>
        )}
      </Dropdown>

  
      {isMyPost && (
        <EditPost
          postId={postId}
          body={body}
          image={image}
          show={openEdit}
          onClose={() => setOpenEdit(false)}
        />
      )}
    </>
  );
}