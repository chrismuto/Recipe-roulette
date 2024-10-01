import users from "../model/users.json" assert { type: "json"}
import fs from "fs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import env from "dotenv"

const dotenv = env.config();

const userDB = {
    users: users,
    setUsers: function (data) { 
        this.users = data,
        fs.writeFileSync("model/users.json", JSON.stringify(data))
     },
     getUsers: function () {
        return this.users
     },
     getOtherUsers: function (foundUserName) {
        return this.users.filter(person => person.username !== foundUserName)
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
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET 
        );
        //saving refreshToken
        const otherUsers = userDB.getOtherUsers(foundUser.username)
        const currentUser = { ...foundUser, refreshToken };
        userDB.setUsers([...otherUsers, currentUser]);
        fs.writeFileSync
        ("model/user.json",
            JSON.stringify(userDB.users)
        );
        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 30 * 60 * 60 * 1000 }); //add secure: true before production
        res.json({ accessToken });
    } else {
        return res.status(401).json({ "message": "Incorrect user or password" }); //incorrect password
    }
}

export default { handleLogin }