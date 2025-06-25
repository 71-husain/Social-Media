import { connectToDatabase } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username");

    if (!posts || posts.length == 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "error fetching posts from database" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    //checking authrization of user
    if (!session) {
      return NextResponse.json(
        { error: "UnAuthorized Error ,Login first" },
        { status: 400 }
      );
    }

    //connecting to database if authorized
    await connectToDatabase();

    //retrieving data from request
    const PostData = await req.json();

    //validating required post data
    if (!PostData.title || !PostData.description || !PostData.postUrl) {
      return NextResponse.json(
        { error: "Missing Required Fields" },
        { status: 403 }
      );
    }

    //creating post
    const newPost = await Post.create({
      title: PostData.title,
      description: PostData.description,
      postUrl: PostData.postUrl,
      user: session.user.id,
      likes: [],
      dislikes: [],
      comments: [],
    });

    //pushing post id to user database to keep track his posts
    await User.findByIdAndUpdate(session.user.id, {
      $push: { posts: newPost._id },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Error while Creating a Post" },
      { status: 403 }
    );
  }
}
