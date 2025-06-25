import mongoose, { Schema, Types ,model ,models} from "mongoose";

export interface IComment {
    _id? : Types.ObjectId;
    user : Types.ObjectId;
    text : string,
    createdAt? : Date;
}

export interface IPost {
    _id? : Schema.Types.ObjectId;
    title : string;
    description : string;
    postUrl : string;
    user : Types.ObjectId;
    comments : IComment[];
    likes : Types.ObjectId[];
    dislikes : Types.ObjectId[];
    createdAt? : Date;
    updatedAt? : Date;
}

const postSchema = new Schema<IPost>({
    title : {type : String, required : true},   
    description : {type : String, required : true},   
    postUrl : {type : String, required : true},   
    user : {type : Schema.Types.ObjectId , ref :"User",required : true},   
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

const Post = models?.Post || model<IPost>("Post",postSchema);

export default Post;