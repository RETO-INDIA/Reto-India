const UserModel = require("../models/signup");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try{
        const {fullname, email, password,phoneNo} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(400).json({error: "User already exists please login"});
        }
        const userModel = new UserModel({fullname, email, password,phoneNo});
        userModel.password = await bcrypt.hash(password,10);
        await userModel.save();
        res.status(200).json({message: "Signup successfully",success: true});
    }
    catch(error){
        res.status(500).json({error: "Internal server error",success: false});
    }   
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const ErrorMsg = "Auth failed: email or password is wrong";

        if (!user) {
            return res.status(403).json({ message: ErrorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: ErrorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
        );
        console.log(jwtToken)
        return res.status(200).json({ 
            message: "Login successfully", 
            success: true, 
            token: jwtToken, 
            email, 
            fullname: user.fullname 
        });
    } catch (error) {
        console.error("Login Error:", error); // Debugging
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};



module.exports = {
    signup,login
}