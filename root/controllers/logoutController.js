import User from "../model/User.js";

const handleLogout = async (req, res) => {
   //On Client, also delete the access token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt

    //is refreshToken in DB?
    const foundUser = await User.findOne( { refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, secure:true }); //add secure: true before production
        return res.status(204);
    }

    //delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie( 'jwt', { httpOnly: true, secure: true }); //add secure: true before production
    res.sendStatus(204);
}

export default { handleLogout }