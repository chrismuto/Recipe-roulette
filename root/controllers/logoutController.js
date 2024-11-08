import User from "../model/User.js";

const handleLogout = async (req, res) => {
   //On Client, also delete the access token
    const cookies = req.cookies;
    console.log(cookies)
    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }
    const refreshToken = cookies.jwt

    //is refreshToken in DB?
    const foundUser = await User.findOne( { refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: "none", secure:true });
        return res.status(204);
    }

    //delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie( 'jwt', { httpOnly: true, sameSite: "none", secure: true });
    res.sendStatus(204);
}

export default { handleLogout }