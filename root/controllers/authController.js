import User from "../model/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const handleLogin = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) return res.status(400).json({"message": "username and password are required"});
    const foundUser = await User.findOne( { username: user }).exec();;
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
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 30 * 60 * 60 * 1000 }); //add secure: true before production
        res.json({ accessToken });
    } else {
        return res.status(401).json({ "message": "Incorrect user or password" }); //incorrect password
    }
}

export default { handleLogin }