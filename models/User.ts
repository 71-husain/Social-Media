import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    username : string;
    name : string;
    email :string;
    password :string;
    videos : mongoose.Schema.Types.ObjectId[];
    posts : mongoose.Schema.Types.ObjectId[];
    _id? : mongoose.Schema.Types.ObjectId;
    createdAt? :Date;
    updatedAt? :Date;
}

const userSchema = new Schema<IUser>({
    username : {type : String , required : true , unique : true},
    name : {type : String, required : true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    videos: [{ type: Schema.Types.ObjectId, ref: "Video", default: [] }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }]

},{
    timestamps:true
});

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const User = models?.User || model<IUser>("User",userSchema);

export default User;