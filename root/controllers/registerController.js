import users from "../model/users.json" assert { type: "json"}
import fs from "fs"
import fsPromises from "fs/promises"
import bcrypt from "bcrypt"

const userDB = {
    users: users,
    setUsers: function (data) { 
        this.users = data,
        fs.writeFileSync("model/users.json", JSON.stringify(data, null, 2))
     },
     getUsers: function () {
        return this.users
     },
     findUser: function (user) {
        return this.users.find(person => person.username === user)
     }
}

const handleNewUser = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) return res.status(400).json({ "message": "username and password are required" })
        
        //check for duplicate username
    const duplicate = userDB.findUser(user)
    if (duplicate) return res.status(409).json({ "message": "username is already taken" });
    try {
        //encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        //store new user
        const newUser = { "username": user, "password": hashedPassword };
        userDB.setUsers([...userDB.getUsers(), newUser]);
        await fsPromises.writeFile(
            "model/users.json",
            JSON.stringify(userDB.getUsers())
        );
        console.log(userDB.getUsers());
        res.status(201).json({ "success": `new user ${user} created` })
    } catch (err) {
        res.status(500).json({ "message": err.message })
    }
}

export default { handleNewUser };