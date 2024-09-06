import users from "../model/users.json" assert { type: "json"}
import fs from "fs"
import bcrypt from "bcrypt"

const userDB = {
    users: users,
    setUsers: function (data) { 
        this.users = data,
        fs.writeFileSync("model/users.json", JSON.stringify(data, null, 2))
     }
}

const handleLogin = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) return res.status(400).json({"message": "username and password are required"});
    const foundUser = userDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); //no user found

    //check password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        //create JWTs for login and refresh here
        res.json({ "success": `user ${user} is logged in`})
    } else {
        res.sendStatus(401);
    }
}

export default { handleLogin }