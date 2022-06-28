const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
 
// User
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        //required: [true, 'please tell us your name']
    },
    lastName: {
        type: String,
       // required: [true, 'please tell us your name']
    },
    name: {
        type: String,
        //required: [true, 'please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //  This only works on CREATE & SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'PAsswords are not the same!'
        }
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
      default: "user"
    },
    type: {
        type: mongoose.Schema.ObjectId,
        refPath: 'role'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    adresse: {
        name: String,
        lat: String,
        lng: String,
    },
    phoneNumber: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
});


userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm
    this.passwordConfirm = undefined;
});


userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    // This point to the current query
    this.find({
        active: {
            $ne: false
        }
    });
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        // console.log(JWTTimestamp,"< ",  changedTimestamp ," : ", JWTTimestamp < changedTimestamp );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    //console.log(resetToken,this.passwordResetToken )
    return resetToken;
}

const User = mongoose.model('User', userSchema)

module.exports = User;