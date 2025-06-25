import { NextRequest , NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request : NextRequest){

    try{
       const {username,name,email,password} =await request.json()

       if(!username || !name || !email || !password){
           return NextResponse.json(
              {error : "username ,name ,email and password are required"},
              {status :401}
           )
       }
        
        await connectToDatabase();

        const existingUser = await User.findOne({email});
        

        if(existingUser){
            return NextResponse.json(
                {error : "User already registered with this email"},
                {status : 400}
            )
        }
  
       const createdUser =  await User.create({
            username,
            name,
            email,
            password
        });

        console.log(createdUser)

        return NextResponse.json(
            {
                message: "User Registered Successfully",
                user: {
                    _id: createdUser._id,
                    email: createdUser.email,
                    createdAt: createdUser.createdAt,
                }
            },
            { status: 201 }
        );
    } catch(error){
        return NextResponse.json(
            { error : "Failed to register User" },
            {status : 500}
        )
    }
} 