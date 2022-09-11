const mongoose = require('mongoose');
const validator = require('validator');
 
// User
const postSchema = new mongoose.Schema({
    domain: {
        type: String,
    },
    user:{
        type:mongoose.Types.ObjectId
    }
},{
    timestamps:true
});

postSchema.pre('save', function (next) {
    
    next();
});

postSchema.pre(/^find/, function (next) {
    next();
});

const Post = mongoose.model('post', postSchema)

module.exports = Post;