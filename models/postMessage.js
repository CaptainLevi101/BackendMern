import mongoose from 'mongoose';
const postSchema = mongoose.Schema({
    creator:String,
    name:String,
    title: String,
    message: String,
    tags: String,
    SelectedFile: String,
    likes: {
        type: [String],
        default: []
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
});
const postMessage=mongoose.model('PostMessage',postSchema);
export default postMessage;