import { NextRequest,NextResponse } from "next/server";

export async function POST(req : NextRequest){
    try {
        const {fileId} = await req.json();

        if(!fileId){
            return NextResponse.json({error : "fileId is required "},{status:400})
        }

        const response = await fetch("https://api.imagekit.io/v1/files/" + fileId,{
            method :"DELETE",
            headers :{
                Authorization: `Basic ${Buffer.from(process.env.PRIVATE_KEY + ":").toString("base64")}`,
            }
        });

        if(!response.ok){
            throw new Error("Failed to delete videos from imagekit")
        }

        return NextResponse.json({message : "Video Deleted successfully"});
    } catch (error) {
        return NextResponse.json({ error: "Error deleting from ImageKit" }, { status: 500 });
    }
}