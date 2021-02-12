const express = require("express")
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../module/Profile');
const User = require('../../module/User')
const {check,validationResult} = require('express-validator');

// @route  get api/profile/me
// @desc   get current user profile
//@access  Private
router.get('/me', auth,async (req,res) => {

    try{
    const profile = await Profile.findOne({user : req.user.id}).populate(
    'user',
    ['name','avatar']
    );
    if(!profile){
        return res.status(400).json({msg : 'There is no profile found'})
    }
    res.json(profile)
    }
    catch (err){
        console.log(err)
        res.status(500).send('server error')
    }

} );

// @route  Post api/profile
// @desc   Create or update user profile
//@access  Private

router.post('/',[
    auth,
    [
       check('status','Status is required')
       .not().isEmpty(),
       check('skills', 'Skill is required').not().isEmpty() 
    ]],async(req , res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;
    
        //building profile object 
    
        const profilefields = {};
        profilefields.user = req.user.id;
        if(company) profilefields.company = company;
        if(website) profilefields.website = website;
        if(location) profilefields.location = location;
        if(bio) profilefields.bio = bio;
        if(status) profilefields.status = status;
        if(skills) {
            profilefields.skills = skills.split(',').map(skill => skill.trim());
        }
    
        //building social object
        profilefields.social = {};
        if(youtube) profilefields.social.youtube = youtube;
        if(facebook) profilefields.social.facebook = facebook;
        if(twitter) profilefields.social.twitter = twitter;
        if(instagram) profilefields.social.instagram = instagram;
        if(linkedin) profilefields.social.linkedin = linkedin;
    
        try {
            let profile = await Profile.findOne({user: req.user.id});
    
            if(profile){
                //if already there then update
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id},        // query to match to update data
                    {$set: profilefields},      // set/ update data to that user id
                    {new: true}                 // Return the updated document instead of the original document
                );
    
                return res.json(profile);
    
            }
    
            //create new if its not there
            profile = new Profile(profilefields);
            await profile.save();
            res.json(profile);
    
        } catch (error) {
            res.status(500).send('server error');
        }
    });



    //get all user profiles
router.get('/', async (req,res) => {
    try {
       const profiles = await Profile.find().populate('user',['name','avatar']);   //user is name of collection from which we will refer name & avatar
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error profile');
    }
    });

    //get user profile with userid
router.get('/user/:user_id', async(req,res) => {
    try {
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user',['name','avatar']);   //user is name of collection from which we will refer name & avatar
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'})
        }
        res.json(profile);
     } catch (error) {
         if(error.kind == 'ObjectId'){
             return res.status(400).json({msg : 'Profile not found'})
         }
        console.error(error.message);
        res.status(500).send('server error profile');
     }
})


//profile delete profile,user,posts

router.delete('/', auth,async(req,res) => {
    try {
        //Remove profile
        await Profile.findOneAndRemove({user : req.user.id})

        //Remove user
        await User.findByIdAndRemove({user : req.user.id})

        res.json({msg : 'User deleted'});
     } catch (error) {
        res.status(500).send('server error profile');
     }
})


// adding/replacing experience
router.put('/experience', [auth,
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()

],async (req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        //get profile of user whose experience we are going to update
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newExperience);  // unshift will add data from starting position & push add data at last
        // create/update experience
        await profile.save();
        res.send(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }

});


//delete profilr experience :/exp_id

router.delete('/experence/:exp_id', auth, async (req , res)=>{
    try {
        
        const profile = await Profile.findOne({user: req.user.id});

    // get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.param.exp_id);

    await profile.save();
    res.json(profile);

    } catch (err) {
        console.error(error.message);
        res.status(500).send('server error');   
    }
})

// adding Education

router.put('/education', [auth,
    check('school', 'school is required').not().isEmpty(),
    check('deegree', 'deegree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()


],async (req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array() });
    }

    const {
        school,
        deegree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEducaction = {
        school,
        deegree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        //get profile of user whose experience we are going to update
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(newEducaction);  // unshift will add data from statring position & push add data at last
        // create/update experience
        await profile.save();
        res.send(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }

});

//delete educations that user added... one can add 2 3 experieces, so we can delete those one by one

router.delete('/education/:edu_id', auth, async (req,res) => {
    try {
         //get profile of user whose experience we are going to update
         const profile = await Profile.findOne({ user: req.user.id });
        
        //  get index of experience to delete
         const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);   // finding index of profile to be delete
        
         profile.education.splice(removeIndex,1);  //remove the experience

         await profile.save();
         res.send(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});


module.exports = router;