import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest ,NextResponse} from "next/server";

export async function POST(req : NextRequest){
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);

        if(!session?.user.id){
            return NextResponse.json(
                {error : "UnAuthorized user"},
                {status : 401}
            )
        }
        
        const {postId ,text} = await req.json();

        if(!postId || !text){
            return NextResponse.json(
                {error : "Missing required Fields"},
                {status : 400}
            )
        };

        const post = await Post.findById(postId);

        if(!post){
            return NextResponse.json(
                {error : "Post Not Found"},
                {
                    status : 403
                }
            )
        }

        const newComment = {
            user : new Types.ObjectId(session.user.id),
            text ,
            createdAt : Date.now(),
        }

        //append the comment at the top of post comment array 
        post.comments.unshift(newComment);
        await post.save();

        await post.populate("comments.user","username userProfileUrl")

        const populatedComment = post.comments[0];

        return NextResponse.json(
            {
                message : "Comment added successfully to the post",
                comment : populatedComment
            },
            {
                status : 200
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                error : "Error in Comments on post" 
            },
            {
                status : 403
            }
        )
    }
}