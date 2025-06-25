import mongoose, { model, models, Schema, Types } from "mongoose";

export const VIDEO_DIMENSIONS = {
    height : 1080,
    width : 1920
} as const

export interface IComment {
    _id? : Types.ObjectId;
    user : Types.ObjectId;
    text : string,
    createdAt? : Date;
}

export interface IVideo {
    _id? : Schema.Types.ObjectId;
    title : string;
    description : string;
    videoUrl : string;
    thumbnailUrl : string;
    user : Types.ObjectId;
    controls? : boolean;
    transformation? :{
        height : number;
        width : number;
        quality? :number
    }
    comments : IComment[];
    likes : Types.ObjectId[];
    dislikes : Types.ObjectId[];
    createdAt? : Date;
    updatedAt? : Date
}

const videoSchema = new Schema<IVideo>({
    title : {type : String, required : true},   
    description : {type : String, required : true},   
    videoUrl : {type : String, required : true},   
    thumbnailUrl : {type : String, required : true},
    user : {type : Schema.Types.ObjectId , ref :"User",required : true},   
    controls : {type : Boolean, default : true},   
    transformation :{
        height : {type : Number, default : VIDEO_DIMENSIONS.height},
        width : {type : Number , default : VIDEO_DIMENSIONS.width},
        quality :{type : Number, min : 1 , max : 100}
    },
    comments : [{
        user : { type : Types.ObjectId, required : true , ref : "User" },
        text : { type : String , required : true},
        createdAt : {  type : Date , default : Date.now , index : true}
    }],
    likes : [{ type : Types.ObjectId , ref : "User" , default :[]}],
    dislikes : [{ type : Types.ObjectId , ref : "User" , default : []}]
},{
    timestamps : true
})

const Video = models?.Video || model<IVideo>("Video",videoSchema);

export default Video;