const mongoose = require('mongoose');
 
// User
const commentSchema = new mongoose.Schema({
    post: {
        type:mongoose.Types.ObjectId
    },
    user: {
        type:mongoose.Types.ObjectId,
        ref:'user'
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
    },
    replies:[{type:mongoose.Types.ObjectId,ref:'comment'}]
},{
    timestamps:true
});

let Populate = (field) => function (next) {
    this.populate(field);
    this.sort({_id:-1});
    next();
  };
commentSchema
  .pre('find', Populate('replies'));

commentSchema.pre('save', function (next) {
    
    next();
});

commentSchema.pre(/^find/, function (next) {
    next();
});

const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment;