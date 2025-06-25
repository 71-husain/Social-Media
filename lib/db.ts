import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI!;


if(!MONGODB_URI){
    throw new Error("Define MONGO_URI in the env file first");
}

var cached = global.mongoose;
 
if(!cached){
    cached = global.mongoose = {conn:null,promise:null}
} 

export async function connectToDatabase(){
   if(cached.conn){
    return cached.conn;
   }

   if(!cached.promise){
        const opts = {
            bufferCommands:true,
            maxPoolSize :10,
        }
   

        cached.promise = mongoose.connect(MONGODB_URI,opts).then(()=>mongoose.connection)
    }

    try{
        cached.conn = await cached.promise;
        console.log('database connected successfully')
    }catch(error){
        console.error("Database connection error:", error);
        cached.promise = null;
        throw error; 
    }

    return cached.conn;
}