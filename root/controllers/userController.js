import User from "../model/User.js";

//Move all functions into data, export for use in jest/calls
//Once all methods are in data, move to separate file and import to all controllers for cleaner code
//get rid of all instances of data.users

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'no employees found' });
    res.json(users);
}

const createNewUser = async (req, res) => {
    if (!req?.body.username || !req?.body.password) {
        return res.status(400).json({ 'message': 'username and password are required '})
    }
        
    try {
        const result = await User.create({
            username: req.body.username,
            password: req.body.password
        });

        res.status(201).json(result);
    } catch (err) {
        console.log(err)
    }
}
    
    const updateUser = async (req, res) => {
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': 'ID parameter is required' });
        }

        const user = await User.findOne( { _id: req.body.id }).exec();

        if (!user) {
            return res.status(204).json({ 'message': `No user with ID ${req.body.id}` });
        }

        const duplicate = await User.findOne( { username: user }).exec();

        if (duplicate) return res.status(409).json({ "message": "username is already taken" });
        
        if(req.body?.username) user.username = req.body.username;
        const result = user.save();
        res.status(201).json(result);
    }
    
    const deleteUser = async (req, res) => {

        if (!req?.body?.id) return res.status(400).json({ 'message': 'user ID required'});

        const user = await User.findOne( { _id: req.body.id }).exec();
        if (!user) {
            return res.status(400).json({ "message": `No user with ID ${req.body.id}` });
        }
        const result = await User.deleteOne({ _id: req.body.id });
        
        res.json(result);
    }
    
    const getUser = async (req, res) => {

        if (!req?.params?.id) return res.status(400).json({ 'message': 'user ID required'});

        const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(400).json({ "message": `No user with ID ${req.params.id}` });
        };

        res.json({ user });
    }

    const funcs = {
        getAllUsers,
        getUser,
        createNewUser,
        updateUser,
        deleteUser, 
    };
    
    export default funcs;