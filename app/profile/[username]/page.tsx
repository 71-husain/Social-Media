"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { apiClient } from "@/app/api/api-client";
import { FiLogOut } from "react-icons/fi";
import { CiHome } from "react-icons/ci";
import Link from "next/link";
import { use } from "react"
import toast from "react-hot-toast";

export type IUserProfile = {
  _id: string;
  name: string;
  username: string;
  email?: string;
  userProfileUrl?: string;
  posts: any[];
  videos: any[];
  followers?: string[];
  followings?: string[];
};

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {

  const { username } = use(params);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [userData, setUserData] = useState<IUserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiClient.getUserNameData(username);
        setUserData(data as IUserProfile);
      } catch (error:any) {
        toast.error(error.message || "Error Fetching User Data");
      }
    };

    fetchUser();
  }, [username]);

  const isFollowing = userData?.followers?.some(
    (id) => id.toString() === userId
  );

  if (!userData) return <p className="p-4">Loading...</p>;

  return (
    <div className="h-screen max-w-md mx-auto">
      <div className="space-y-6 h-full overflow-y-auto">
        <div className="flex flex-col items-center p-4 h-[40%] pt-10 border-b-2 border-black">
          <div className="w-full px-5 flex justify-between mb-2">
            <Link href="/">
              <CiHome size={28} />
            </Link>
            <Link href="/">
              <FiLogOut size={28} />
            </Link>
          </div>

          <img
            src={
              userData.userProfileUrl ||
              "https://static.vecteezy.com/system/resources/previews/032/176/191/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
            }
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <h2 className="text-xl font-bold mt-2">{userData.name}</h2>
          <p className="text-gray-600">@{userData.username}</p>

          {userId === userData._id ? (
            <Link
              href="/profile"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit Profile
            </Link>
          ) : (
            <button
              onClick={async () => {

                try {
                  await apiClient.followUser(String(userData._id))
                  const updatedUser = await apiClient.getUserNameData(username)
                  setUserData(updatedUser as IUserProfile)
                } catch (error:any ) {
                   toast.error(error.message || "Something went wrong while following user");
                }
              }}
              className={`mt-2 px-4 py-2 rounded text-white ${isFollowing ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
                }`}

            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          <div className="flex gap-6 mt-5">
            <div>
              <h4 className="text-xl font-semibold">Posts</h4>
              <h5 className="flex justify-center">{userData.posts.length}</h5>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Videos</h4>
              <h5 className="flex justify-center">{userData.videos.length}</h5>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Followers</h4>
              <h5 className="flex justify-center">
                {userData.followers?.length}
              </h5>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Followings</h4>
              <h5 className="flex justify-center">
                {userData.followings?.length}
              </h5>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-400" />

        {/* Bottom - Posts & Videos */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">Posts</h3>
          <div className="grid grid-cols-3 gap-2">
            {userData.posts.map((post) => (
              <img
                key={post._id}
                src={post.postUrl}
                alt="post"
                className="w-full h-24 object-cover rounded-md"
              />
            ))}
          </div>

          <h3 className="font-semibold text-lg mt-6 mb-2">Videos</h3>
          <div className="grid grid-cols-3 gap-2">
            {userData.videos.map((video) => (
              <video
                key={video._id}
                src={video.videoUrl}
                className="w-full h-24 object-cover rounded-md"
                controls
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
