const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth")
const User = require("../../module/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require("express-validator");

// @route  get api/users
// @desc   Test route
//@access  Public
router.get('/', auth ,async(req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }catch(err){
    console.error(err.message)
    res.status(500).send('Server Error');
    }
    
});

// @route  Post api/auth
// @desc   get Token
//@access  Public

router.post('/', [
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

        if(!user){
            return res.status(400).json({error : ['invalid credintials']});
        }
       const isMatch = await bcrypt.compare(password, user.password);

       if(!isMatch) {
        return res.status(400).json({error : ['invalid credintials']});
       }
       
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