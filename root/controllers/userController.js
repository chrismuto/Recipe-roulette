import users from "../model/user.json" assert { type: "json"}
import fs from "fs"

//Move all functions into data, export for use in jest/calls
//Once all methods are in data, move to separate file and import to all controllers for cleaner code
//get rid of all instances of data.users
const data = {
    users,
    setUsers: function (newData) {
        this.users = newData;
        fs.writeFileSync("model/user.json", JSON.stringify(newData, null, 2));
    },
    getUser: function (reqId) {
        return this.users.find(user => user.id === parseInt(reqId));
    },
    getAllUsers: function () {
        return this.users;
    },
    deleteUser: function (reqId) {
        return this.users.find(user => user.id === parseInt(reqId));
    },
    filterById: function (reqId) {
        return this.users.filter(targetUser => targetUser.id !== parseInt(reqId));
    },
};

const getAllUsers = (req, res) => {
    res.json(data.getAllUsers());
}

const createNewUser = (req, res) => {
        const newUser = {
            id: data.getAllUsers()[data.getAllUsers().length -1].id + 1 || 1,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        }
        
        if (!newUser.firstname || !newUser.lastname) {
            return res.status(400).json({ 'message': 'users require a first and last name '});
        }
        
        data.setUsers([...data.getAllUsers(), newUser]);
        res.status(201).json(data.getAllUsers());
    }
    
    const updateUser = (req, res) => {
        const user = data.getUser(req.body.id);
        if (!user) {
            return res.status(400).json({ "message": `User ID ${req.body.id} not found` });
        }
        if(req.body.firstname) user.firstname = req.body.firstname;
        if(req.body.lastname) user.lastname = req.body.lastname;
        const filteredArray = data.filterById(req.body.id);
        const unsortedArray = [...filteredArray, user];
        data.setUsers(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
        res.status(201).json(data.users);
    }
    
    const deleteUser = (req, res) => {
        const user = data.deleteUser(req.body.id);
        if (!user) {
            return res.status(400).json({ "message": `User ID ${req.body.id} not found` });
        }
        const filteredArray = data.filterById(req.body.id);
        data.setUsers([...filteredArray]);
        res.status(201).json(users);
    }
    
    const getUser = (req, res) => {
        const user = data.getUser(req.body.id);
        if (!user) {
            return res.status(400).json({ "message": `User ID ${req.body.id} not found for this id` });
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