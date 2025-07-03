import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const result = await Video.updateMany(
      {}, // ✅ Match ALL videos
      {
        $set: { user: "6862b646c269b0f0c7c36c91" }
      }
    );

    return NextResponse.json({
      message: "User assigned to all videos",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error initializing DB:", error);
    return NextResponse.json({ error: "Failed to assign user" }, { status: 500 });
  }
}
