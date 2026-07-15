const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    console.log("BODY:", req.body);
    const { name, email, password } = req.body;
    console.log("EMAIL:", email);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `
            Welcome to ShopNest, ${name}! Thank you for registering with us. We are excited to have you as part of our community. To complete your registration, please use the following One-Time Password (OTP)`;

            await sendEmail(email, 'Welcome to ShopNest - Your OTP for Registration', message);

            res.status(201).json({ 
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
        else{
            res.status(400).json({ message: 'Invalid user data' });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Login Email:", email);

        const user = await User.findOne({ email });

        console.log("User Found:", user);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        console.log("Entered Password:",password);
        console.log("Stored Hash:", user.password);
        const match = await bcrypt.compare(password, user.password);
        console.log("Password Match:", match);

        if (!match) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

//const verifyEmail = async (req, res) => {
  //  const { token } = req.body;
    //try {
      //  res.json({ message: 'Email verified successfully' });
    //} catch (error) {
      //  res.status(500).json({ message: 'Server error' });
   // }
//}


module.exports = {
    registerUser,
    loginUser,
    getUsers,
  //  verifyEmail
};