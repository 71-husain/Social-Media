"use client";

import { ThumbsUp, ThumbsDown, MessageCircle, MoreVertical } from "lucide-react";

type VideoCardProps = {
  videoKey: string;
  videoTitle: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  username : string;
  userProfileUrl : string;
  onLike: () => void;
  onDislike: () => void;
  onComment: () => void;
  refCallback?: (el: HTMLVideoElement | null) => void;
  onPlay?: () => void;
};

function VideoCard({
  videoKey,
  videoTitle,
  description,
  thumbnail,
  videoUrl,
  likes,
  dislikes,
  commentsCount,
  username ,
  userProfileUrl,
  onLike,
  onDislike,
  onComment,
  refCallback,
  onPlay
}: VideoCardProps) {
  return (
    <div key={videoKey} className=" relative snap-start h-screen w-full bg-black">
      
      <div className="absolute top-5 left-4 z-10 text-white flex gap-2 items-center">
          <div className="h-10 w-10 bg-zinc-300 rounded-full overflow-hidden">
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
          <div>
            <h3 className="text-lg font-semibold pt-2">{videoTitle}</h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
      </div>
      <video
        ref={refCallback}
        onPlay={onPlay}
        src={videoUrl}
        className="w-full h-[calc(100vh-44px)] object-cover overflow-hidden p-0 m-0"
        controls={true}
        loop
        playsInline
        preload="metadata"
        poster={thumbnail}
      />

      <div className="absolute right-5 bottom-36 flex flex-col items-center gap-6 text-white text-lg z-10">
        <button
          onClick={onLike}
          className="flex flex-col items-center drop-shadow hover:scale-110 transition-transform"
        >
           <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
               <ThumbsUp size={30} className="text-white" />
           </div>
           <span className="text-white text-sm font-medium">{likes}</span>
        </button>
 
        <button
          onClick={onDislike}
          className="lex flex-col items-center drop-shadow hover:scale-110 transition-transform"
        >
           <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
              <ThumbsDown size={30}  className="text-white"/>
           </div>
           <span className="text-white text-sm font-medium">{dislikes}</span>
        </button>

        <button
          onClick={onComment}
          className="flex flex-col items-center drop-shadow hover:scale-110 transition-transform"
        >
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
          <MessageCircle size={30} className="text-white"/>
           </div>
           <span className="text-white text-sm font-medium">{commentsCount}</span>
        </button>
      </div>
    </div>
  );
}

export default VideoCard;
