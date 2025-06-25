import { IPost } from "@/models/Post";
import { IVideo } from "@/models/Video";
import { ObjectId } from "mongoose";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

export type VideoFormData = Omit<IVideo, "_id">;
export type PostFormData = Omit<IPost,"_id">;

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

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
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

  async getPosts(){
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

  async likePost(postId :string,action: string){
    return this.fetch("/posts/like",{
      method :"POST",
      body :{postId,action}
    });
  }

  async commentOnPost(postId : string , text : string){
    return this.fetch("/posts/comment",{
      method : "POST",
      body : {postId,text}
    })
  }
}

export const apiClient = new ApiClient();
