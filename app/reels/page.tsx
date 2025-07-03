"use client";
import { use, useEffect, useRef, useState } from "react";
import { apiClient } from "../api/api-client";
import { IVideo } from "@/models/Video";
import VideoCard from "../components/VideoCard";
import { useSession } from "next-auth/react";
import { ObjectId, Types } from "mongoose";
import CommentCard from "../components/CommentCard";
import toast from "react-hot-toast";

export default function HomePage() {
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComment, setShowComment] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<ObjectId>();
  const [activeVideo, setActiveVideo] = useState<IVideo | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await apiClient.getVideos();
        setVideos(videoData);
        console.log(videoData);
      } catch (error:any) {
        toast.error(error.message || "Error Fetching Videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.6, // Only play when 80% is visible
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  return (
    <div className=" relative h-screen snap-y snap-mandatory overflow-y-scroll no-scrollbar">
      {videos.map((video, index) => (
        <VideoCard
          key={String(video._id)}
          videoTitle={video.title}
          description={video.description}
          videoUrl={video.videoUrl}
          thumbnail={video.thumbnailUrl}
          videoKey={""}
          likes={video.likes.length}
          dislikes={video.dislikes.length}
          commentsCount={video.comments.length}
          username={(video.user as any).username}
          userProfileUrl={(video.user as any).userProfileUrl}
          onLike={async () => {
            const videoId = video._id;

            const updated = videos.map((v) => {
              if (v._id !== videoId) return v;

              const alreadyliked = v.likes.includes(userId);

              const updatedlikes = alreadyliked
                ? v.likes.filter((id) => id.toString() !== userId)
                : [...v.likes, userId];
              const updateddislikes = v.dislikes.filter((id) => id.toString()!==userId);

              return {
                ...v,
                likes: updatedlikes,
                dislikes: updateddislikes,
              };
            });

            setVideos(updated as any);

            try {
              await apiClient.likeVideo(String(video._id), "like");
            } catch (error) {
              console.error(error);
            }
          }}
          onDislike={async () => {
            const videoId = video._id;

            const updated = videos.map((v) => {
              if (v._id !== videoId) return v;

              const alreadydisliked = v.dislikes.includes(userId);

              const updateddislikes = alreadydisliked
                ? v.dislikes.filter((id) => id.toString() !== userId)
                : [...v.dislikes, userId];
              const updatedlikes = v.likes.filter((id) => id.toString() !== userId);

              return {
                ...v,
                dislikes: updateddislikes,
                likes: updatedlikes,
              };
            });

            setVideos(updated as any);

            try {
              await apiClient.likeVideo(String(video._id), "dislike");
            } catch (error) {
              console.error(error);
            }
          }}
          onComment={async () => {
            setActiveVideoId(video._id);
            setActiveVideo(video);
            setShowComment(true);
          }}
          refCallback={(el) => {
            if (el) videoRefs.current[index] = el;
          }}
          onPlay={() => {
            videoRefs.current.forEach((vid, i) => {
              if (i !== index && vid && !vid.paused) {
                vid.pause();
              }
            });
          }}
        />
      ))}
      {showComment && (
        <CommentCard
          item={activeVideo as IVideo}
          type ="video"
          updateItem={(item) => setActiveVideo(item as IVideo)}
          setShowComment={setShowComment}
          updateFeed={(item)=>setVideos}
          showComment={showComment}
        />
      )}
    </div>
  );
}
