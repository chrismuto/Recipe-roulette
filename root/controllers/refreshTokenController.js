import User from "../model/User.js";
import jwt from "jsonwebtoken"

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt

    const foundUser = await User.findOne( { refreshToken }).exec();
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