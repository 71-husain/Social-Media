"use client";

import { IPost } from "@/models/Post";
import { IVideo } from "@/models/Video";
import { useEffect, useRef, useState } from "react";
import { apiClient } from "./api/api-client";
import PostCard from "./components/PostCard";
import VideoCard from "./components/VideoCard";
import { useSession } from "next-auth/react";
import { Types } from "mongoose";
import CommentCard from "./components/CommentCard";
import { IUserProfile } from "./profile/page";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function page() {
  const [feed, setFeed] = useState<
    ((IVideo & { type: "video" }) | (IPost & { type: "post" }))[]
  >([]);

  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const router = useRouter();
  const [showComment, setShowComment] = useState(false);
  const [activeItem, setActiveItem] = useState<IVideo | IPost | null>(null);
  const [activeType, setActiveType] = useState<"video" | "post">("post");
 


  const { data: session } = useSession();
  const userId = session?.user.id;
  const objectUserId = new Types.ObjectId(userId);


  useEffect(() => {
    if(!session){
        router.push("/login")
    }
    const fetchingDatas = async () => {
      try {
        const fetchedVideos = await apiClient.getVideos();
        const fetchedPosts = await apiClient.getPosts();

        const videoItems = fetchedVideos.map((video) => ({
          ...video,
          type: "video" as const,
        }));

        const postItems = fetchedPosts.map((post) => ({
          ...post,
          type: "post" as const,
        }));

        //combining post and video items array based on their creating date
        const combinedfeed = [...postItems, ...videoItems].sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );

        setFeed(combinedfeed);
      } catch (error: any) {
        toast.error(error.message || "Error while fetching data on homepage");
      }
    };

    fetchingDatas();
  }, []);
  return (
    <div className="lg:ml-80 lg:max-w-[430px]">
      {feed.map((item, index) =>
        item.type == "post" ? (
          <PostCard
            key={String(item._id)}
            postTitle={item.title}
            postUrl={item.postUrl}
            description={item.description}
            username={(item.user as any).username}
            likes={item.likes.length}
            dislikes={item.dislikes.length}
            commentsCount={item.comments.length}
            userProfileUrl={(item.user as any).userProfileUrl}
            isliked={item.likes.includes(userId)}
            isDisliked={item.dislikes.includes(userId)}
            onLike={async () => {
              const postId = item._id;
              const updated = feed.map((p) => {
                if (p._id !== postId || p.type !== "post") return p;

                const alreadyliked = p.likes.includes(userId);

                const updatedlikes = alreadyliked
                  ? p.likes.filter((id) => id.toString() !== userId)
                  : [...p.likes, userId];
                const updateddislikes = p.dislikes.filter(
                  (id) => id.toString() !== userId
                );

                return {
                  ...p,
                  likes: updatedlikes,
                  dislikes: updateddislikes,
                  type: "post", //ensures the correct type is retained
                } as IPost & { type: "post" };
              });

              setFeed(updated);

              try {
                await apiClient.likePost(String(item._id), "like");
              } catch (error: any) {
                toast.error(error.message || "Error in liking post");
              }
            }}
            onDislike={async () => {
              const postId = item._id;
              const updated = feed.map((p) => {
                if (p._id !== postId || p.type !== "post") return p;

                const alreadydisliked = p.dislikes.includes(userId);

                const updatedDislikes = alreadydisliked
                  ? p.dislikes.filter((id) => id.toString() !== userId)
                  : [...p.dislikes, userId];
                const updatedLikes = p.likes.filter(
                  (id) => id.toString() !== userId
                );

                return {
                  ...p,
                  dislikes: updatedDislikes,
                  likes: updatedLikes,
                  type: "post", //ensures the correct type is retained
                } as IPost & { type: "post" };
              });

              setFeed(updated);
              try {
                await apiClient.likePost(String(item._id), "dislike");
              } catch (error: any) {
                toast.error(error.message || "Error in disliking post");
              }
            }}
            onComment={() => {
              setActiveItem(item);
              setActiveType(item.type);
              setShowComment(true);
            }}
          />
        ) : (
          <VideoCard
            key={String(item._id)}
            videoTitle={item.title}
            videoKey={String(item._id)}
            videoUrl={item.videoUrl}
            description={item.description}
            thumbnail={item.thumbnailUrl}
            likes={item.likes.length}
            dislikes={item.dislikes.length}
            commentsCount={item.comments.length}
            username={(item.user as any).username}
            userProfileUrl={(item.user as any).userProfileUrl}
            isliked={item.likes.includes(userId)}
            isDisliked={item.dislikes.includes(userId)}
            onLike={async () => {
              const videoId = item._id;
              const updated = feed.map((v) => {
                if (v._id !== videoId || v.type !== "video") return v;

                const alreadyliked = v.likes.includes(userId);

                const updatedlikes = alreadyliked
                  ? v.likes.filter((id) => id.toString() !== userId)
                  : [...v.likes, userId];
                const updateddislikes = v.dislikes.filter(
                  (id) => id.toString() !== userId
                );

                return {
                  ...v,
                  likes: updatedlikes,
                  dislikes: updateddislikes,
                  type: "video", //ensures the correct type is retained
                } as IVideo & { type: "video" };
              });

              setFeed(updated);

              try {
                await apiClient.likeVideo(String(item._id), "like");
              } catch (error: any) {
                toast.error(error.message || "Error in liking video");
              }
            }}
            onDislike={async () => {
              const videoId = item._id;
              const updated = feed.map((v) => {
                if (v._id !== videoId || v.type !== "video") return v;

                const alreadydisliked = v.dislikes.includes(userId);

                const updatedDislikes = alreadydisliked
                  ? v.dislikes.filter((id) => id.toString() !== userId)
                  : [...v.dislikes, userId];
                const updatedLikes = v.likes.filter(
                  (id) => id.toString() !== userId
                );

                return {
                  ...v,
                  dislikes: updatedDislikes,
                  likes: updatedLikes,
                  type: "video", //ensures the correct type is retained
                } as IVideo & { type: "video" };
              });

              setFeed(updated);
              try {
                await apiClient.likeVideo(String(item._id), "dislike");
              } catch (error: any) {
                toast.error(error.message || "Error in disliking video");
              }
            }}
            onComment={() => {
              setActiveItem(item);
              setActiveType(item.type);
              setShowComment(true);
            }}
            refCallback={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            onPlay={() => {
              console.log("Playing video at index:", index);

              videoRefs.current.forEach((vid, i) => {
                if (i !== index && vid && !vid.paused) {
                  vid.pause();
                }
              });
            }}
          />
        )
      )}

      {showComment && activeItem && (
        <CommentCard
          showComment={showComment}
          setShowComment={setShowComment}
          item={activeItem}
          type={activeType}
          updateItem={setActiveItem}
          updateFeed={setFeed}
        />
      )}
    </div>
  );
}

export default page;
