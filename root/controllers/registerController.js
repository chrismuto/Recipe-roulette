import bcrypt from "bcrypt";
import User from "../model/User.js";

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ "message": "username and password are required" })
        
        //check for duplicate username
    const duplicate = await User.findOne( { username: username }).exec();

    if (duplicate) return res.status(409).json({ "message": "username is already taken" });

    try {
        //encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create and store new user
        const result = await User.create({ 
            "username": username,
            "password": hashedPassword
        });

        console.log(result);

        res.status(201).json({ "success": `new user ${username} created` });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

export default { handleNewUser };