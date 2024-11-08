import User from "../model/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({"message": "username and password are required"});
    const foundUser = await User.findOne( { username: username }).exec();;
    if (!foundUser) return res.status(401).json({ "message": "Incorrect user or password" }); //no user found

    //check password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        //create JWTs for login and refresh here
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET 
        );
        //saving refreshToken
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 30 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        return res.status(401).json({ "message": "Incorrect user or password" }); //incorrect password
    }
}

export default { handleLogin }