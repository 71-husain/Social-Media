"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { apiClient } from "../api/api-client";
import FileUpload from "../components/FileUpload";
import { FiLogOut } from "react-icons/fi";
import { CiHome } from "react-icons/ci";
import Link from "next/link";
import toast from "react-hot-toast";

export type IUserProfile = {
  _id: string;
  name: string;
  username: string;
  email?: string;
  userProfileUrl?: string;
  followers: any[]
  followings: any[]
  posts: any[]; // ideally: IPost[]
  videos: any[]; // ideally: IVideo[]
};


export default function ProfilePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [userData, setUserData] = useState<IUserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);


  // local state for editing
  const [editData, setEditData] = useState({
    name: "",
    username: "",
    userProfileUrl: ""
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const data = await apiClient.getUserProfileData(userId);
        setUserData(data as IUserProfile);
      } catch (error: any) {
        toast.error(error.message || "Error Fetching User Data");

      }
    };

    fetchUser();
  }, [userId]);



  // Handle upload progress
  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  // Handle successful upload
  const handleUploadSuccess = async (res: any) => {
    console.log("Upload Success:", res);

    if (!res.url || !res.fileId) {
      console.error("No URL or FileId recieved from imagekit");
      return;
    }

    console.log(res.url)
    setEditData(prev => ({ ...prev, userProfileUrl: res.url }))
    setUploadProgress(null)
  };

  const handleUpdate = async () => {
    try {
      console.log(editData)
      const updatePayload = {
        ...(editData.name && { name: editData.name }),
        ...(editData.username && { username: editData.username }),
        ...(editData.userProfileUrl && { userProfileUrl: editData.userProfileUrl }),
      };

      const updated = await apiClient.updateUserProfile(userId!, updatePayload as IUserProfile);
      setUserData(updated as IUserProfile);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Error Updating Profile");
    }
  };

  //handle signout

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      toast.error(error.message || "Error SignIn Out");
    }
  };

  if (!userData) return <p className="p-4">Loading...</p>;
  return (
    <div className="h-screen max-w-md mx-auto">
      {/* If editing: Show full-screen edit form */}
      {isEditing ? (
        <div className="h-full p-4 flex flex-col justify-center space-y-4">
          <h2 className="text-xl font-bold">Edit Profile</h2>

          <input
            type="text"
            placeholder="Name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="border p-2 rounded w-full text-black bg-gray-300"
          />
          <input
            type="text"
            placeholder="Username"
            value={editData.username}
            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
            className="border p-2 rounded w-full text-black bg-gray-300"
          />

          <label className="text-sm font-medium">Upload Profile Picture</label>
          <FileUpload
            fileType="image"
            onSuccess={handleUploadSuccess}
            onProgress={handleUploadProgress}
          />
          {uploadProgress !== null && (
            <p className="text-sm text-zinc-400 mt-1">Uploading: {uploadProgress}%</p>
          )}

          <div className="flex gap-3 mt-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-gray-400 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
       // Show Profile Page
        <div className="space-y-6 h-full overflow-y-auto">
          {/* Top Half - Profile Info */}
          <div className="flex flex-col items-center p-4 h-[40%] pt-10 border-b-2  border-black lg:flex justify-center ">
            <div className="w-full px-5 flex justify-between mb-2 ">
              <Link href="/">
                <CiHome size={28} />
              </Link>
              <button onClick={handleSignOut} className="text-black hover:text-red-600">
                <FiLogOut size={28} />
              </button>
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

            {userId === userData._id && (
              <button
                onClick={() => {
                  setEditData({
                    name: userData.name || "",
                    username: userData.username || "",
                    userProfileUrl: userData.userProfileUrl || "",
                  });
                  setIsEditing(true);
                }}
                className="mt-2 px-4 py-2 bg-gray-600 hover:bg-green-600 text-white rounded"
              >
                Edit Profile
              </button>
            )}
            <div className="flex gap-6 mt-5">
              <div className="">
                <h4 className="text-xl text-semibold">Posts</h4>
                <h5 className="flex justify-center">{userData.posts.length}</h5>
              </div>
              <div>
                <h4 className="text-xl text-semibold">Videos</h4>
                <h5 className="flex justify-center">{userData.videos.length}</h5>

              </div>
              <div>
                <h4 className="text-xl text-semibold">Followers</h4>
                <h5 className="flex justify-center">{userData.followers.length}</h5>

              </div>
              <div>
                <h4 className="text-xl text-semibold">Followings</h4>
                <h5 className="flex justify-center">{userData.followings.length}</h5>

              </div>
            </div>

          </div>

          {/* Bottom Half - Posts & Videos */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Your Posts</h3>
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

            <h3 className="font-semibold text-lg mt-6 mb-2">Your Videos</h3>
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
      )}
    </div>
  );

}
