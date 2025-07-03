import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);

        if (!session?.user.id) {
            return NextResponse.json(
                { error: "UnAuthorized Error" },
                { status: 404 }
            )
        }

        const { targetUserId } = await req.json();
        const userId = new Types.ObjectId(session.user.id);
        if (!targetUserId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 401 }
            )
        }

        const targetUser = await User.findById(targetUserId);
        const sourceUser = await User.findById(userId);

        if (!targetUser || !sourceUser) {
            return NextResponse.json(
                { error: "User Not found" },
                { status: 400 }
            )
        }


        //check weather already followed 
        if (targetUser.followers.includes(userId)) {
            //unfollow
            targetUser.followers = targetUser.followers.filter((id: Types.ObjectId) => !id.equals(userId));
            sourceUser.followings = sourceUser.followings.filter((id: Types.ObjectId) => !id.equals(targetUserId));
        } else {
            targetUser.followers.push(userId);   //updating followers array of target
            sourceUser.followings.push(targetUserId);    //updating followings array of source
        }


        await targetUser.save();
        await sourceUser.save();

        return NextResponse.json(
            {
                message: "folllow/unfollow SUCCESSFULLY",
                followersCount: targetUser.followers.length,
                followingsCount: sourceUser.followings.length,
            },
            {
                status: 200
            }
        )
    } catch (error) {

        return NextResponse.json(
            {
                error: "Error in following/unfollowing user"
            },
            {
                status: 401
            }
        )

    }
}