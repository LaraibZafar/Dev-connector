const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require('../../middleware/auth');

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require('../../models/Post');

//@route   POST api/post
//@desc    Create a post
//@access  Private
router.post("/",[auth,[
    check('text','Text is required').not().isEmpty()
]] ,async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try{
    const user = await User.findById(req.user.id).select('-password');
    const newPost = {
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar
    }
    const post = new Post(newPost);
    await post.save();
    res.json(post);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send('Server Error : Post Post');
    }
});

//@route   GET api/post
//@desc    Get all posts
//@access  Private
router.get('/',auth, async(req,res)=>{
    try {
        const posts = await Post.find().sort({date: -1});//ascending
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error : Get all Posts');
    }
});

//@route   GET api/post/:post_id
//@desc    Get a post
//@access  Private
router.get('/:post_id',auth, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post){
            return res.status(404).json({msg:"Post not found"});
        }
        res.json(post);
    } catch (error) {
        if(error.kind === 'ObjectId'){ //incase Object ID is not of the proper format
            return res.status(404).json({msg:"Post not found"});
        }
        console.error(error.message);
        res.status(500).send('Server Error : Get a Post');
    }
});

module.exports = router;
