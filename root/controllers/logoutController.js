import users from "../model/users.json" assert { type: "json"}
import fs from "fs"

const userDB = {
    users: users,
    setUsers: function (data) { 
        this.users = data,
        fs.writeFileSync("model/users.json", JSON.stringify(data))
     },
     getUsers: function () {
        return this.users;
     },
     getOtherUsers: function (foundUserName) {
        return this.users.filter(person => person.username !== foundUserName);
     },
     findUser: function (user) {
        return this.users.find(person => person.username === user);
     },
     findRefreshToken: function (refreshToken) {
        return this.users.find(person => person.refreshToken === refreshToken);
     }
}

const handleLogout = async (req, res) => {
   //On Client, also delete the access token

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt

    //is refreshToken in DB?
    const foundUser = userDB.findRefreshToken(refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true }); //add secure: true before production
        return res.status(204);
    }

    //delete refreshToken in db
    const otherUsers = userDB.getOtherUsers(foundUser.username);
    const currentUser = { ...foundUser, refreshToken: '' };
    userDB.setUsers([...otherUsers, currentUser])

    res.clearCookie( 'jwt', { httpOnly: true }); //add secure: true before production
    res.sendStatus(204);
}

export default { handleLogout }