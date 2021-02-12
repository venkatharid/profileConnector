const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../module/User');
const Post = require('../../module/Post');
const Profile = require('../../module/Profile')




// @route  Post api/users
// @desc   Test route
//@access  Public
router.post('/', [auth
    ,check('text','Text not provided').not().isEmpty()],
    async(req,res) =>{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
            profilepic: user.profilepic
        });

        const post = await newPost.save();
        res.json(post);
            
        } catch (error) {
            res.status(500).send('server error');
        }

    });

    //get all post
    router.get('/', auth, async(req,res) => {
        try {
            const posts = await Post.find().sort({date: -1});  // showing in descending order as per dates
            res.json(posts);
        } catch (error) {
            res.status(500).send('sever error');
        }
    });

    //get post by id
    router.get('/:id', auth, async(req,res) => {
        try {
            const posts = await Post.findById(req.params.id);  
            if(!posts) {
                return res.status(400).json({msg: 'Post not Found'})
            }
            res.json(posts);
        } catch (error) {
            console.error(error)
            if(error.kind == 'ObjectId') {
                return res.status(400).json({msg: 'Post not Found'})
            }
            res.status(500).send('sever error');
        }
    });

    //remove post by id
    
    router.delete('/:id', auth, async(req,res) => {
        try {
            const posts = await Post.findById(req.params.id); 
            //check user
            if(posts.user.toString() !== req.user.id){
                res.status(400).json({msg:'you are not athporised to delete the post'})
            }

            await posts.remove();

            res.json({msg:'Post removed'});
        } catch (error) {
            console.error(error)
            res.status(500).send('sever error');
        }
    });

    //add like to particular post

router.put('/like/:id', auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check if user already liked that post

        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {  //post.user will return objectid from mongodb,, so converting it into string 
            return res.status(400).json({msg: "Post already liked!!!"});
        }

        let usernamefromdb = await User.findById(req.user.id).select('name');

        post.likes.unshift({user: req.user.id, name: usernamefromdb.name});
        await post.save();
        res.json(post.likes);
    } catch (error) {
        res.status(500).send('sever error');
    }
});


//unlike to particular post

router.put('/unlike/:id', auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check if user liked that post or not 

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {  //post.user will return objectid from mongodb,, so converting it into string 
            return res.status(400).json({msg: "post has not been liked yet"});
        }

        //getting array which will include our user id who disliked post
        let usersarray = post.likes.map(like => {
            if(like.user.toString() === req.user.id){
                return like.user.toString()
            }
        });

        const removeIndex = usersarray.indexOf(req.user.id);
        post.likes.splice(removeIndex,1);
        
        await post.save();
        res.json(post.likes);
    } catch (error) {
        res.status(500).send('sever error');
    }
});


//add comment on post 

router.post('/comment/:id', [auth,
    check('comment', 'text cant be empty!!!').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = { 
            text: req.body.comment,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();
        res.json(post.comments);
    }
    catch(error){
        console.error(error)
        res.status(500).send('sever error');
    }
});

//delete comment from post
//:id - refers to post id
//:comment_id - refers to comment id that we are going to delete

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        //find out that comment

        const comment = post.comments.find(comment => comment.id === req.params.comment_id);  // find() returns value of first array element that satisfies the condition
    
        if(!comment){
           return res.status(404).json({msg: 'Comment does not found!!!'});
        }

        //check logged in user is author of that post... if so then only delete

        if(comment.user.toString() !== req.user.id){
           return res.status(401).json({msg: 'You are not authorized to delete this comment!!!'});
        }

        //get index to remove comment

        const removeIndex = post.comments.map(comment => comment.user.toString() === req.user.id).indexOf(req.user.id);
        post.comments.splice(removeIndex,1);

        await post.save();
        res.json(post.comments);
    } catch (error) {
        res.status(500).send('sever error1');
    }

});

module.exports = router;