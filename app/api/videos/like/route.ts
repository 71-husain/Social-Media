import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/Video";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";

export async function POST(req : NextRequest){

    try {
 
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if(!session?.user.id){
        return NextResponse.json(
            {
                error : "Unauthorized "
            },
          { 
            status :401
          }
        )
    }

    const {videoId , action } = await req.json()
    if(!videoId || !action){
        return NextResponse.json({error : "missing field"},{status : 201});
    }

    const userId = new Types.ObjectId(session.user.id)
    const video =await  Video.findById(videoId)
    if(!video) {
        return NextResponse.json({
            error : "video not found"
        },
        {status : 400}
       )
    }

    if(action ==='like'){
        //check weather video already likes or not 
        if(video.likes.includes(userId)){
            //unlike the video 
            video.likes = video.likes.filter((id : Types.ObjectId)=>!id.equals(userId));
        } else {
            //like
            video.likes.push(userId);  

            //remove from dislikes if previously have
            video.dislikes = video.dislikes.filter((id : Types.ObjectId)=>!id.equals(userId))
        }
    }

    if(action === "dislike"){
        if(video.dislikes.includes(userId)){
            //undislike 
            video.dislikes = video.dislikes.filter((id:Types.ObjectId)=>!id.equals(userId));
        } else{
            //dislike
            video.dislikes.push(userId);

            //unlike the video if already have
            video.likes = video.likes.filter((id :Types.ObjectId)=> !id.equals(userId));
        }
    }

    await video.save();

    return NextResponse.json(
        {
            message :"VIDEO UPDATED SUCCESSFULLY",
            likesCount : video.likes.length,
            dislikesCount : video.dislikes.length
        },
        {
            status : 200
        }
    )
        
    } catch (error) {
        return NextResponse.json(
            {
                error : "Error in liking/disliking video"
            },
            {
                status : 401
            }
        )
        
    }
}
