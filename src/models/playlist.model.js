import mongoose ,{Schema} from "mongoose";

const playlistSchema=new Schema({
    name:{
        type:String,
        request:true
    },
    description:{
        type:String,
        request:true
    },
    videos:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true
})

export const Playlist=mongoose.model("Playlist",playlistSchema)