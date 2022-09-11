const mongoose = require('mongoose');
const validator = require('validator');
 
// User
const commentSchema = new mongoose.Schema({
    post: {
        type:mongoose.Types.ObjectId
    },
    user: {
        type:mongoose.Types.ObjectId
    },
    content: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    parent:{
        type:mongoose.Types.ObjectId
    },
    parentModel:{
        type:String //(comment|post)
    },
    score:{
        type: Number
    },
    deleted:{
        type: Boolean
    }
},{
    timestamps:true
});

commentSchema.pre('save', function (next) {
    
    next();
});

commentSchema.pre(/^find/, function (next) {
    next();
});

const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment;