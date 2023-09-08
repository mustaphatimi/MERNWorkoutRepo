const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    let emptyFields = [];

    if (!email) {
        emptyFields.push('email')
    }
    if (!password) {
        emptyFields.push('password')
    }
    if (emptyFields.length > 0) {
        return res.status(404).json({ error: 'Please fill in all required fields!', emptyFields })
    }

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id)
        res.status(200).json({ email, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signupUser = async (req, res) => {
    const { email, password } = req.body;

    let emptyFields = [];

    if (!email) {
        emptyFields.push('email')
    }
    if (!password) {
        emptyFields.push('password')
    }
    if (emptyFields.length > 0) {
        return res.status(404).json({ error: 'Please fill in all required fields!', emptyFields })
    }

    try {
        const user = await User.signup(email, password);
        const token = createToken(user._id)
        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    loginUser,
    signupUser
}