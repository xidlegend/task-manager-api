const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const Task = require('./task')
const Validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Make a Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!Validator.isEmail(value)) {
                throw new Error("This Ain't a Fkin Email\n");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, 'Password needs to be 8 characters long'],
        validate(value) {
            if (value.includes('password')) {
                throw new Error("Password cannot inlcude 'password'")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        trim: true,
        validate(val) {
            if (val < 0) {
                throw new Error("You ain't fkin born yet")
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Add a Virtual Attrbute

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// ==== Mongoose Middleware ==== //


// Find By Credentials
userSchema.statics.findByCredentials = async (email, password) => {
    // statics define function *accesible from model*

    // check user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid Credentials');
    }

    // check password hash with bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Invalid Credentials');
    }

    return user
}

// JWT Generator
userSchema.methods.generateAuthToken = async function () {
    // schema.methods define function *accessible from instance*
    const user = this;
    // generate token
    const payload = { _id: user._id.toString() };
    const token = jwt.sign(payload, 'supersecret',);
    // append to user.tokens array
    user.tokens = user.tokens.concat({ token });

    await user.save()
    return token;
}

// Custom JSON response
userSchema.methods.toJSON = function () {
    /*
    this method weill be called when res.send() is called,
    it will JSON.stringify, and JSON.stringify looks for 
    this method to execute on the user object
    */
    const user = this;
    // Mongoose method to convert doc into plain object
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject
}

// Hash passwords 
userSchema.pre('save', async function (next) {
    // pre/post ->save/validate/remove...
    const user = this;

    // Only if the password is being changed.
    // If password already hashed, not hash again 
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 7);
    }
    next();
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next()
})


// initate model
const User = Mongoose.model('User', userSchema)

// export model
module.exports = User