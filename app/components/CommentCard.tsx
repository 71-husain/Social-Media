"use client";

import React, { useState } from "react";
import { X, SendHorizontal } from "lucide-react";
import { apiClient } from "../api/api-client";
import { useSession } from "next-auth/react";
import { Types } from "mongoose";
import { IVideo } from "@/models/Video";
import { IComment, IPost } from "@/models/Post";

type CommentCardProps = {
  showComment: boolean;
  setShowComment: (val: boolean) => void;
  item: IVideo | IPost;
  type: "video" | "post";
  updateItem: (item: IVideo | IPost) => void;
  updateFeed?: React.Dispatch<
    React.SetStateAction<
      ((IVideo & { type: "video" }) | (IPost & { type: "post" }))[]
    >
  >;
};

function CommentCard({
  showComment,
  setShowComment,
  item,
  type,
  updateItem,
  updateFeed,
}: CommentCardProps) {
  const [commentText, setCommentText] = useState<string>("");

  const { data: session } = useSession();
  const objectUserId = new Types.ObjectId(session?.user?.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      let savedComment: IComment;

      if (!item._id) {
        console.error("Item has no ID");
        return;
      }

      if (type === "video") {
        const res = await apiClient.commentOnVideo(
          String(item._id),
          commentText
        ) as { comment: IComment };
        savedComment = res.comment;
      }
      if (type === "post") {
        const res = await apiClient.commentOnPost(
          String(item._id),
          commentText
        ) as { comment: IComment };
        savedComment = res.comment;
      }

      const updatedItem = {
        ...item,
        comments: [savedComment, ...item.comments],
      };

      updateItem(updatedItem);

      if (updateFeed) {
        updateFeed((prev) =>
          prev.map((f) =>
            f._id === item._id
              ? { ...f, comments: [savedComment, ...f.comments] }
              : f
          )
        );
      }

      setCommentText("");
    } catch (err) {
      console.error("Error posting comment", err);
    }
  }

  return (
    <div
      className={`fixed bottom-12 w-full h-[60vh] z-50 overflow-y-auto bg-white redius-xl rounded-t-2xl ${showComment ? "translate-y-0" : "translate-y-full"
        } transition-all duration-300`}
    >
      <div className="flex z-10 sticky top-0 bg-white p-2 border-b-[1px] border-black justify-between m-2 pl-2">
        <h2 className="text-2xl">Comments</h2>
        <X
          onClick={() => {
            setShowComment(false);
          }}
          className="sticky top-5 right-5 m-2 h-15"
        />
      </div>

      <div className="flex-1 overflow-y-auto h-[45vh] px-4 pb-20">
        {item.comments.map((comment, index) => (

          <div key={String(comment._id) || index} className="mt-2 ml-5 flex gap-2">
            <div className="h-8 w-8 mt-2 bg-zinc-300 rounded-full overflow-hidden shrink-0">
              <img
                src={
                  (comment.user as any)?.userProfileUrl ||
                  "https://static.vecteezy.com/system/resources/previews/032/176/191/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
                }
                alt="profile"
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg">
                @{(comment.user as any)?.username || "unknown"}
              </h3>
              <p className="text-xl">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex z-10 sticky bottom-0 left-0 w-full p-3 bg-white border-t-[1px] radius-xl border-gray-700 items-center gap-2"
      >
        <input
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
          placeholder="Add a comment..."
          value={commentText}
          className="w-[88%] h-10 flex items-center justify-center bg-gray-200 text-xl px-2 rounded-md"
          type="text"
          name="text"
        />
        <button className="h-10 w-[10%]" type="submit">
          <SendHorizontal size={40} />
        </button>
      </form>
    </div>
  );
}

export default CommentCard;
