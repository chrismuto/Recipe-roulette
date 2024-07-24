import users from "../model/user.json" assert { type: "json"}

const data = {
    users,
    setUsers: function (newData) { this.users = newData }
};



const getAllUsers = (req, res) => {
    res.json(data.users);
}

const createNewUser = (req, res) => {
        const newUser = {
            //try removing -1 and +1 after getting code working as is
            id: data.users[data.users.length -1].id + 1 || 1,
            "firstname": `${req.body.firstname}`,
            "lastname": `${req.body.lastname}`
        }
        
        if (!newUser.firstname || !newUser.lastname) {
            return res.status(400).json({ 'message': 'users require a first and last name '});
        }
        
        data.setUsers([...data.users, newUser]);
        res.status(201).json(data.users);
    }
    
    const updateUser = (req, res) => {
        const user = data.users.find(user => user.id === parseInt(req.body.id));
        if (!user) {
            return res.status(400).json({ "message": `User ID ${req.body.id} not found` });
        }
        if(req.body.firstname) user.firstname = req.body.firstname;
        if(req.body.lastname) user.lastname = req.body.lastname;
        const filteredArray = data.users.filter(targetUser => targetUser.id !== parseInt(req.body.id));
        const unsortedArray = [...filteredArray, user];
        data.setUsers(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
        res.status(201).json(data.users);
    }
    
    const deleteUser = (req, res) => {
        const user = data.users.find(user => user.id === parseInt(req.body.id));
        if (!user) {
            return res.status(400).json({ "message": `User ID ${req.body.id} not found` });
        }
        const filteredArray = data.users.filter(user => user.id !== parseInt(req.body.id));
        data.setUsers = [...filteredArray];
        res.status(201).json(users);
    }
    
    const getUser = (req, res) => {
        const user = users.find(targetUser => targetUser.id === parseInt(req.body.id));
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