import users from "../model/users.json" assert { type: "json"}
import fs from "fs"
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

const handleLogin = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) return res.status(400).json({"message": "username and password are required"});
    const foundUser = userDB.findUser(user);
    if (!foundUser) return res.status(401).json({ "message": "Incorrect user or password" }); //no user found

    //check password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        //create JWTs for login and refresh here
        res.json({ "success": `user ${user} is logged in`})
    } else {
        return res.status(401).json({ "message": "Incorrect user or password" }); //incorrect password
    }
}

export default { handleLogin }