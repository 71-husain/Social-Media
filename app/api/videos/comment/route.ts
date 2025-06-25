import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest){
    try {

        await connectToDatabase();

        const session = await getServerSession(authOptions);
        if(!session?.user.id){
            return NextResponse.json(
                { error : "Unauthorized" },
                { status : 401 }
            )
        }

        const {videoId , text} = await req.json();

        if(!videoId || !text){
            return NextResponse.json(
                {
                    error : "Missing Fields"
                },
                {
                    status : 400
                }
            )
        }
        
        const video = await Video.findById(videoId)
        
        if(!video){
            return NextResponse.json(   
                {
                    error : "Video not Found"
                },
                {
                    status : 404
                }
            )
        }

        const newComment = {
            user : new Types.ObjectId(session.user.id),
            text ,
            createdAt : Date.now()
        }

        //saving comment to videos 
        video.comments.unshift(newComment);  //add at top
        await video.save(); 

        await video.populate("comments.user", "username");

        const populatedComment = video.comments[0]; // because you unshifted


        return NextResponse.json(
            {
                message : "Comments added successfully",
                comment : populatedComment
            },
            {
                status : 200
            }
        )

    } catch (error) {
        return NextResponse.json(
            {
                error : "Error in Comments on video"
            },
            {
                status : 403
            }
        )
    }
}