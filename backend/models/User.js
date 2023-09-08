const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.signup = async function (email, password) {
    if (!email || !password) {
        throw Error('Incomplete signup credentials')
    }
    if (!validator.isEmail(email)) {
        throw Error('Invalid email address')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password too weak')
    }

    const existingEmail = await this.findOne({ email })
    if (existingEmail) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
        const user = await this.create({ email, password: hash });
        return user;

    } catch (error) {
        throw Error('Error encountered!', error)
    }
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('Incomplete signup credentials')
    }
    if (!validator.isEmail(email)) {
        throw Error('Invalid email address')
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Invalid login credentials')
    }
    const isVerified = await bcrypt.compare(password, user.password)
    if (isVerified) {
        return user;
    }
    throw Error('Invalid login credentials')
}

const User = mongoose.model('User', userSchema);

module.exports = User;