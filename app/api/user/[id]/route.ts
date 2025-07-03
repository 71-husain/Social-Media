import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET route to fetch user profile info
export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        await connectToDatabase();

        const { id } = context.params

        const user = await User.findById(id)
            .select("-password")
            .populate("posts")
            .populate("videos");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { error: "Error in Finding User information" },
            { status: 404 }
        );
    }
}

// ✅ PUT route to update user profile info
export async function PUT(req: NextRequest, context: { params: { id: string } }) {

    try {
        await connectToDatabase();

        const {id} = context.params;

        const session = await getServerSession(authOptions);

        console.log("Received PUT for user:", id);
        console.log("Session:", session?.user.id);
 


        // 🔒 Auth verification
        if (!session || session.user.id !== id) {
            return NextResponse.json(
                { error: "UnAuthorized user" },
                { status: 403 } // Correct status for forbidden
            );
        }
 
        const {data} = await req.json();
        console.log("Request body:", data);


        // 🛠 Update user info
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name: data.name,
                username: data.username,
                userProfileUrl: data.userProfileUrl, // or userProfileUrl in some older versions
            },
            { new: true }
        ).select("-password");

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(
            { error: "Error in Updating the user information" },
            { status: 500 }
        );
    }
}
