"use client";

import { Heart, MessageCircle, MoreVertical, ThumbsDown, ThumbsUp } from "lucide-react";

type postCardProps = {
  postTitle: string;
  postUrl: string;
  description: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  username: string;
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
  onLike,
  onDislike,
  onComment,
}: postCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden mb-6 max-w-md mx-auto">
      {/* Top: User Info */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-zinc-300 rounded-full" />
          <span className="font-semibold text-gray-800 dark:text-white">
            @{username}
          </span>
        </div>
        <MoreVertical className="text-gray-500" size={20} />
      </div>

      {/* Image */}
      <div className="w-full">
        <img
          src={postUrl}
          alt="Post"
          className="w-full object-cover max-h-[400px] aspect-video"
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
          className="hover:text-pink-600 transition font-semibold"
        >
        <ThumbsUp/>{likes}
        </button>
        <button
          onClick={onDislike}
          className="hover:text-blue-600 transition font-semibold"
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
