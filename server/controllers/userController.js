const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');


//get current user
//GET method
//access private
const getUser = asyncHandler(async (req, res) => {
    const { username } = req.body

    const user = await User.findOne({ username }).lean().exec()

    if (!user) {
        res.status(400).json({ message: 'user not found' })
    }

    res.json(user)
})

//create new user
//POST method
//access public
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    //confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    //check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'That user already exists' })
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const userObject = { username, 'password': hashedPassword }

    //create and store new User
    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `new user ${username} created` })
    } else {
        res.status(400).json({ message: 'invalid user data recieved' })
    }
})

//update user
//PATCH method
//access private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password } = req.body

    if (!id || !username) {
        return res.status(400).json({ message: 'all fields are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'user not found' })
    }

    //check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()
    
    //allow updates to original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'duplicate username' });
    }

    user.username = username

    if (password) {
        //hash password
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated`})
})

//delete user
//DELETE method
//access private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'user ID required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'user not found' })
    }

    const result = await User.findByIdAndDelete(id)

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getUser,
    createNewUser,
    updateUser,
    deleteUser
}