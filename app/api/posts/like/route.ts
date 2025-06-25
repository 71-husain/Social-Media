import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST( req : NextRequest){
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        const userId = new Types.ObjectId(session?.user.id);

        if(!session?.user.id){
            return NextResponse.json(
                { error : "UnAuthorized User"},
                {status : 200}
            )
        }

        const {postId , action} = await req.json();

        if(!postId || !action){
            return NextResponse.json({ error : "missing required fields"},{status :400})
        }

        const post = await Post.findById(postId);
        if(!post){
            return NextResponse.json(
                {error : "Post not found"},
                {status : 200}
            )
        }

        if(action === "like"){
            //check weather post already liked by user or not 
            if(post.likes.includes(userId)){
                //unlike the post 
               post.likes = post.likes.filter((id :Types.ObjectId)=>!id.equals(userId))
            } else {
                //like the post
                post.likes.push(userId);

                //undislike the post if disliked 
                post.dislikes = post.dislikes.filter((id : Types.ObjectId)=>!id.equals(userId))
            }
        }

        if(action === "dislike"){
            //check weather already disliked or not 
            if(post.dislikes.includes(userId)){
                post.dislikes = post.dislikes.filter((id : Types.ObjectId)=>!id.equals(userId));
            } else {
                //dislike the post
                post.dislikes.push(userId)

                //unlike the post if liked 
                post.likes = post.likes.filter((id : Types.ObjectId)=>!id.equals(userId))
            }
        }

        //save the changes in posts
        await post.save();

        return NextResponse.json(
            {message : `${action}d the post`},
            {status : 200}
        )
    } catch (error) {
        return NextResponse.json(
            {error : `Error in liking/disliking the post`}
        )
    }
}