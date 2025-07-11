"use client";

import { Heart, MessageCircle, MoreVertical, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

type postCardProps = {
  postTitle: string;
  postUrl: string;
  description: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  userProfileUrl: string;
  username: string;
  isliked: boolean;
  isDisliked: boolean;
  onLike: () => void;
  onDislike: () => void;
  onComment: () => void;
};

function PostCard({
  postTitle,
  postUrl,
  description,
  likes,
  dislikes,
  commentsCount,
  username,
  userProfileUrl,
  isliked,
  isDisliked,
  onLike,
  onDislike,
  onComment,
}: postCardProps) {


  return (
    <div className="bg-white dark:bg-zinc-900  shadow-md overflow-hidden mb-6 max-w-md mx-auto">
      {/* Top: User Info */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-zinc-300 rounded-full">
            <a href={`/profile/${username}`}>
              <img
                src={
                  userProfileUrl ||
                  "https://static.vecteezy.com/system/resources/previews/032/176/191/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
                }
                alt="profile"
                className="rounded-full object-cover"
              />
            </a>
          </div>
          <span className="font-semibold text-gray-800 dark:text-white">
            @{username}
          </span>
        </div>
        <MoreVertical className="text-gray-500" size={20} />
      </div>

      {/* Image */}
      <div className="w-full overflow-hidden ">
        <img
          src={postUrl}
          alt="Post"
          className="w-full max-h-[600px] object-cover "
        />
      </div>

      {/* Bottom: Title + Description */}
      <div className="px-4 py-3">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
          {postTitle}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="flex justify-around items-center px-4 py-2 border-t text-zinc-700 dark:text-zinc-300">
        <button
          onClick={onLike}
          className={`transition font-semibold flex items-center gap-1 ${isliked ? "text-pink-600" : "text-zinc-700 dark:text-zinc-300"
            }`}
        >
          <ThumbsUp />{likes}
        </button>
        <button
          onClick={onDislike}
          className={`transition font-semibold flex items-center gap-1 ${isDisliked ? "text-blue-600" : "text-zinc-700 dark:text-zinc-300"
            }`}
        >
          <ThumbsDown />
          {dislikes}
        </button>
        <button
          onClick={onComment}
          className="hover:text-green-600 transition font-semibold"
        >
          <MessageCircle />{commentsCount}
        </button>
      </div>
    </div>
  );
}

export default PostCard;
