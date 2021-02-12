const express = require("express")
const router = express.Router();   //express router to route the urls
const gravatar = require('gravatar'); //to create link of email
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require("express-validator");
const User = require("../../module/User");

// @route  Post api/users
// @desc   Register User
//@access  Public

router.post('/', [
    check('name', "Name is required").not().isEmpty(),
    check('email','please include a valid email').isEmail(),
    check('password', "Please enter Password").isLength({min:6})
],
async (req,res) => { 
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {name, email, password} = req.body;
    try{
        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({error : ['user is already present']});
        }
        const avatar = gravatar.url(email, {
            s:"200",
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload,config.get('jsonToken'),{expiresIn:36000},
            (err,token)=>{
                if(err) throw err;
                res.json({token});
                }
        )
    }
   catch (err){
       console.log(err.message);
       res.status(500).send('server error')
   }
});

module.exports = router;