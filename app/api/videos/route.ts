import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const videos = await Video.find({}).populate("comments.user", "username userProfileUrl").populate("user","username userProfileUrl");
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "error fetching data" }, { status: 500 });
  }
} 

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "UnAuthorized User" }, { status: 401 });
    }

    await connectToDatabase();

    const body: IVideo = await req.json();

    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing Required Fields" },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);

    //pushing video to user database
    await User.findByIdAndUpdate(
      session.user.id,
      { $push: { videos: newVideo._id } } // or videos
    );

    return NextResponse.json(newVideo);
  } catch (error) {
    return NextResponse.json(
      { error: "Error while creating new Video" },
      { status: 401 }
    );
  }
}
