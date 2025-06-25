"use client";
import { useState, useEffect } from "react";
import FileUpload from "@/app/components/FileUpload"; // Adjust the import path
import { apiClient } from "../api/api-client"; // Import the centralized API
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Types } from "mongoose";

export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>("");
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>("");

  const { data: session, status } = useSession();
  const router = useRouter();

  const userId = new Types.ObjectId(session?.user.id);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/upload`);
    }
  }, [status, router]);

  // Handle successful upload
  const handleUploadSuccess = async (res: any) => {
    console.log("Upload Success:", res);

    if (!res.url || !res.fileId) {
      console.error("No URL or FileId recieved from imagekit");
      return;
    }
    setVideoUrl(res.url);
    setUploadedFileId(res.fileId);
    console.log(res.fileId);
  };

  // Handle upload progress
  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  //save to database
  const saveToDatabase = async () => {
    if (thumbnailFile) {
      const thumbnail = await uploadThumbnailToImageKit(thumbnailFile);
      setThumbnailUrl(thumbnail);
    }

    if (!videoUrl || !thumbnailUrl) {
      return;
    }

    try {
      await apiClient.createVideo({
        title: videoTitle,
        description: description,
        videoUrl, 
        thumbnailUrl,
        user: userId,
        createdAt: new Date(),
        likes: [],
        dislikes: [],
        comments: [],
      });

      console.log("Video saved to DB!");

      setVideoUrl(null);
      setUploadedFileId(null);
      setUploadProgress(null);
      setVideoTitle("");
      setDescription("");
      setThumbnailFile(null);
      setThumbnailUrl(null);

      //redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error saving video:", error);
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
      console.log("video deleted successfully", data);

      setVideoUrl(null);
      setUploadedFileId(null);
      setUploadProgress(null);

      router.push("/");
    } catch (error) {
      console.error(" Error deleting from ImageKit:", error);
    }
  };

  const uploadThumbnailToImageKit = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    const res = await fetch("/api/upload-imagekit", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Upload Video</h1>

      <input
        onChange={(e) => {
          setVideoTitle(e.target.value);
        }}
        type="text"
        className="my-2 px-5 w-100 h-10 rounded-lg outline-none text-zinc-600 bg-white border-2 border-zinc-600"
        placeholder="Video Title"
      />
      <input
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        type="text"
        className="my-2 px-5 w-100 h-10 rounded-lg outline-none text-zinc-600 bg-white  border-2 border-zinc-600"
        placeholder="Description"
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Video File
        </label>
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Thumbnail Image
        </label>
        <FileUpload
          fileType="image" //mention the type to store /images
          onSuccess={(res) => {
            if (res.url) {
              setThumbnailUrl(res.url);
            }
          }}
          onProgress={(progress) => {
            setUploadProgress(progress);
          }}
        />
      </div>

      {uploadProgress != null && <p>Uploading: {uploadProgress}%</p>}

      {videoUrl && (
        <div>
          <h3 className="mt-4 font-semibold">Uploaded Video:</h3>
          <video src={videoUrl} controls width="400" className="mt-2"></video>
          <div>
            <button
              className="mx-5 bg-zinc-500 rounded-lg p-2 mt-5"
              onClick={saveToDatabase}
            >
              {" "}
              Complete Upload
            </button>
            <button
              className="mx-5 bg-zinc-500 rounded-lg p-2 mt-5"
              onClick={cancelUpload}
            >
              {" "}
              Cancel
            </button>
          </div>
        </div>
      )}
      {thumbnailUrl && (
        <div className="mt-3">
          <h3 className="font-semibold">Thumbnail Preview:</h3>
          <img
            src={thumbnailUrl}
            alt="Thumbnail"
            className="mt-2 w-64 rounded"
          />
        </div>
      )}
    </div>
  );
}
