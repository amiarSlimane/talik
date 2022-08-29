const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
 
// User
const userSchema = new mongoose.Schema({
    post: {
        type: String,
        //required: [true, 'please tell us your name']
    },
    user:{
        type:mongoose.Types.ObjectId
    },
    content: {
        type: String,
       // required: [true, 'please tell us your name']
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
},{
    timestamps:true
});

userSchema.pre('save', function (next) {
    
    next();
});

userSchema.pre(/^find/, function (next) {
    next();
});

const User = mongoose.model('comment', userSchema)

module.exports = User;