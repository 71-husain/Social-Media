import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,context:{params:{username:string}}){
    try {
        await connectToDatabase();
        const {username} = context.params;

        const user = await User.findOne({username}).select("-password").populate("posts").populate("videos");

        if(!user){
            return NextResponse.json(
                {error : `User not found with ${username}`},
                {status:404}
            )
        }

        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json(
            {error : "Error in finding User information"},
            {status : 404}
        )
    }
}