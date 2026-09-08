import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


export const registerUser = async (req, res) => {

    try {
    
    const { name, email, password, role  } = req.body;
    
    if(!name || !email || !password || !role) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    // check password length
    if(password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // check if user already exists

    const userExists = await User.findOne({ email });
    if(userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashesedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
        name,
        email,
        password: hashesedPassword,
        role
    });

    const token = generateToken(user._id);


    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    });
}catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
}

};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password ){
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }


        // find user by email

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // generate token
        const token = generateToken(user._id);

        res.status(200).json({

            message : "Login successful",

            user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            },
            token,
         
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getProfile = async (req , res ) => {
      
    try{
         const user = await User.findById(req.user.id).select("-password");

         if(!user){
             return res.status(400).json({
                message: "User not found",
             });
         }

         res.status(200).json({
            user,
         });
        }
        catch(error){
            console.log(error);

            res.status(500).json({
                message: "Server error",
            });
        }
    };


