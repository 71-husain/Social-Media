"use client";
import { useState, useEffect } from "react";
import FileUpload from "@/app/components/FileUpload"; // Adjust the import path
import { apiClient } from "../api/api-client"; // Import the centralized API
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Types } from "mongoose";
import toast from "react-hot-toast";

export default function UploadPost() {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [postUrl, setPostUrl] = useState<string | null>("");
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { data: session, status } = useSession();
  const router = useRouter();

  const userId = new Types.ObjectId(session?.user.id); //objected userId

  // Handle successful upload
  const handleUploadSuccess = async (res: any) => {
    console.log("Upload Success:", res);

    if (!res.url || !res.fileId) {
      console.error("No URL or FileId recieved from imagekit");
      return;
    }
    setPostUrl(res.url);
    setUploadedFileId(res.fileId);
    console.log(res.fileId);
  };

  // Handle upload progress
  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const saveToDatabase = async () => {
    if (!postUrl) {
      return;
    }

    try {
      await apiClient.createPost({
        title: postTitle,
        description: description,
        postUrl,
        createdAt: new Date(),
        likes: [],
        dislikes: [],
        comments: [],
        user: userId,
      });

      console.log("Post saved to Database");

      //reset all states
      setPostTitle("");
      setPostUrl("");
      setDescription("");

      //pushing router to home page
      router.push("/");
    } catch (error:any) {
        toast.error(error.message || "Error While creating post");
    }
  };

  //cancel upload
  const cancelUpload = async () => {
    if (!uploadedFileId) {
      return;
    }

    try {
      const response = await fetch("/api/delete-imagekit", {
        method: "POST",
        body: JSON.stringify({ fileId: uploadedFileId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("post deleted successfully", data);

      setPostUrl(null);
      setUploadedFileId(null);
      setUploadProgress(null);

      router.push("/");
    } catch (error:any) {
        toast.error(error.message || "Error Deleting from imagekit");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-lg bg-zinc-950 p-6 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Upload a Post</h2>

        {/* Title Input */}
        <input
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Post Title"
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder:text-zinc-400 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Description Input */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a short description..."
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder:text-zinc-400 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Image Upload */}
        <div className="mb-4">
          <FileUpload
            fileType="image"
            onSuccess={handleUploadSuccess}
            onProgress={handleUploadProgress}
          />
          {uploadProgress !== null && (
            <p className="text-sm text-zinc-400 mt-2">
              Uploading: {uploadProgress}%
            </p>
          )}
        </div>

        {/* Preview */}
        {postUrl && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Preview:</h3>
            <img
              src={postUrl}
              alt="Preview"
              className="w-full rounded-lg border border-zinc-700 shadow-md"
            />
          </div>
        )}

        {/* Buttons */}
        {postUrl && (
          <div className="flex justify-between mt-6">
            <button
              onClick={saveToDatabase}
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium transition"
            >
              Submit Post
            </button>
            <button
              onClick={cancelUpload}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
