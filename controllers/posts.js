import postMessage from "../models/postMessage.js";
import mongoose from "mongoose";
export const getPosts = async (req, res) => {
    const {page}=req.query;
    try {
         const LIMIT=8;
         const startIndex=(Number(page)-1)*LIMIT;
         //get the starting index of evvery page
         const total=await postMessage.countDocuments({});
        const posts = await postMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex)
        res.status(200).json({data:posts,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)});
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}
export const getPostsBySearch=async(req,res)=>{

    const {searchQuery,tags}=req.query;
    console.log(req.query);
   
    try {
        const title = new RegExp(searchQuery, 'i');
        
        let tagsArray = [];
        if (tags) {
            // Parsing tags from comma-separated string to array
            tagsArray = tags.split(',');
            // Convert tags array to regular expressions
            tagsArray = tagsArray.map(tag => new RegExp(tag.trim(), 'i'));
        }

        const posts = await postMessage.find({
            $or: [
                { title },
                { tags: { $in: tagsArray } } // Using the tagsArray with $in operator
            ]
        });
    
      res.json({data:posts});
    }catch(err){
        res.status(404).json({message:err.message});
    }

}
export const createPosts = async (req, res) => {
    const post = req.body;
    const newPost = new postMessage({...post,creator:req.userId,createdAt:new Date().toISOString()});
    try {
        await newPost.save();
        res.status(200).json(newPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}
export const updatePost = async (req, res) => {
    try {
        const { id: _id } = req.params;
        const post = req.body;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send('No post with that ID');
        }

        const updatedPost = await postMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

        if (!updatedPost) {
            return res.status(404).send('Post not found');
        }

        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
export const deletePost=async(req,res)=>{
    try{
        const {id:_id}=req.params;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send('No post with that ID');
        }
        await postMessage.findOneAndDelete(_id);
        res.json({message:'Post deleted successfully'});

      
    }catch(err){
        console.log(err);
    }
}
export const likePost=async(req,res)=>{
    try{
        const {id:_id}=req.params;
    //middleware req.userId is available in here
       if(!req.userId)return res.json({message:'Unauthenticated'});
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send('No post with that ID');
        }
        const post=await postMessage.findById(_id);
        const index=post.likes.findIndex((id)=>id==String(req.userId));
        if(index==-1){
            post.likes.push(req.userId);
            //like 
        }else{
            post.likes=post.likes.filter((id)=>id!=String(req.userId));

        }
        const updatedPost=await postMessage.findByIdAndUpdate(_id,post,{new:true});
        res.json(updatedPost);

    }catch(err){

    }
}
// export const updatePost = async (req, res) => {
//     try {
//         const { id: _id } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(_id)) {
//             return res.status(404).send("No post with that id")
//         }
//         postMessage.findByIdAndUpdate(mongoose.Types.ObjectId
//     }
//     catch (err) {

//     }


// }