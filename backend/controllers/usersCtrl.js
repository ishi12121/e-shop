import User from "../model/User.js";
import bcrypt from "bcryptjs";

// @desc    Register user
// @route   POST /api/v1/users/register
// @access  Private/Admin

export const registerUserCtrl = async (req, res) => {
    const { FullName, email, password } = req.body;

   
    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        //throw
        res.status(400).json({
            message: "User already exists"
        });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create the user 
    const user = await User.create({
        FullName,
        email,
        password: hashedPassword,
    });
    res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: user,
    });

};

// @desc Login user
// @route POST  /api/v1/users/login
// @access Public

export const loginUserCtrl = async (req, res) => {
    const { email, password } = req.body;
    // check if user exists
    const userFound = await User.findOne({ email });
    if (userFound && await bcrypt.compare(password,userFound?.password)) {
        res.json({
            status: 'success',
            message: 'User logged in successfully',
            userFound,
      })
    } else {
        res.json({
            msg:'Invalid Login'
        })
    }
   
};