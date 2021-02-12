const mongoose = require('mongoose');



const Postschema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,   // added reference of user table here to identify particular user
        ref: 'user'
    },
    text:{
        type: String,
        required: true
    },

    name:{
        type: String
    },
    avatar:{
        type: String
    },
    profilepic:{
        type: String
    },
    likes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,   // to identify which users liked the post
                ref: 'user'
            },
            name:{
                type: String
            },
        }
    ],
    comments:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,   // to identify which users liked the post
                ref: 'user'
            },
            text:{
                type: String
            },
            name:{
                type: String
            },
            avatar:{
                type: String
            },
            profilepic:{
                type: String
            },
            date:{
                type: Date,
                default: Date.now 
            }
        }
    ],
    date:{
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('post',Postschema);