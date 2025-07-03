import { IPost } from "@/models/Post";
import { IVideo } from "@/models/Video";
import { ObjectId } from "mongoose";
import { IUserProfile } from "../profile/page";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

export type VideoFormData = Omit<IVideo, "_id">;
export type PostFormData = Omit<IPost, "_id">;

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof data === "string" ? data : data?.error || "Something went wrong";
      throw new Error(message);
    }

    return data as T;
  }

  async getVideos() {
    return this.fetch<IVideo[]>("/videos");
  }

  async getAVideo(id: string) {
    return this.fetch<IVideo>(`/videos/${id}`);
  }

  async createVideo(videoData: VideoFormData) {
    return this.fetch("/videos", {
      method: "POST",
      body: videoData,
    });
  }

  async createPost(postData: PostFormData) {
    return this.fetch("/posts", {
      method: "POST",
      body: postData,
    });
  }

  async getPosts() {
    return this.fetch<IPost[]>("/posts")
  }

  async likeVideo(videoId: string, action: string) {
    return this.fetch("/videos/like", {
      method: "POST",
      body: { videoId, action },
    });
  }

  async commentOnVideo(videoId: string, text: string) {
    return this.fetch("/videos/comment", {
      method: "POST",
      body: { videoId, text },
    });
  }

  async likePost(postId: string, action: string) {
    return this.fetch("/posts/like", {
      method: "POST",
      body: { postId, action }
    });
  }

  async followUser(targetUserId: string) {
    return this.fetch("/user/actions/follow", {
      method: "POST",
      body: { targetUserId }
    })
  }

  async commentOnPost(postId: string, text: string) {
    return this.fetch("/posts/comment", {
      method: "POST",
      body: { postId, text }
    })
  }

  async getUserProfileData(id: string) {
    return this.fetch(`/user/${id}`)
  }

  async updateUserProfile(id: string, data: IUserProfile) {
    return this.fetch(`/user/${id}`, {
      method: "PUT",
      body: { data }
    })
  }

  async getUserNameData(username: string) {
    return this.fetch(`/user/profile/${username}`)
  }
}

export const apiClient = new ApiClient();
