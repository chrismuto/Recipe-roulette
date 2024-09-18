import users from "../model/users.json" assert { type: "json"}
import jwt from "jsonwebtoken"
// import env from "dotenv"

// const dotenv = env.config();

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

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401);
    const refreshToken = cookies.jwt

    const foundUser = userDB.findRefreshToken(refreshToken);
    if (!foundUser) return res.status(403); //no user found

    //check jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            );
            res.json({ accessToken })
        }
    );
}

export default { handleRefreshToken }