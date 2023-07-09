const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

const {
    getUserById,
    getAllUsers,
    createUser,
    getUserByEmail,
    updateUser,
    deleteUser,
} = require("../services/userServices");
const ApiError = require("../utils/ApiError");
const { sendEmail } = require("../services/emailServices");


exports.getMe = asyncHandler(async (req, res) => res.status(200).json(req.user));


// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
    const { username: phoneNumber, password } = req.body;

    if (!phoneNumber || !password) throw new ApiError(400, "Enter phone number and password");
    

    // check for user phoneNumber
    const user = await User.findOne({ phoneNumber })
        .select(
            "-createdAt -updatedAt -__v -otp -otpExpires -resetExpires -resetToken"
        );

    if (!user) throw new ApiError(400, "Invalid username");

    if (user && (await bcrypt.compare(password, user.password))) {
        return res.status(200).json({
            user: { ...user.toObject(), password: undefined },
            token: generateToken(res, user._id),
        });

    } else {
        res.status(400);
        throw new Error("Incorrect crdentials");
    }
});

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, phoneNumber, email } = req.body;

    if (!name || !email || !phoneNumber) {
        throw new ApiError(400, "Please add all fields");
    }

    const userExists = await User.findOne({
        $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    if (userExists && userExists.isVerified) {
        throw new ApiError(400, "User already exists");
    }

    if (userExists && !userExists.isVerified) {
        await User.deleteOne({ _id: userExists._id });
    }

    // create user
    const user = await createUser({
        name,
        email,
        phoneNumber,
        role: "user",
    });

    if (user) {
        generateToken(res, user._id)
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user Data");
    }
});

exports.logout = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({message: 'User logged out'});
})

exports.forgotPasword = asyncHandler(async (req, res) => {
    const { email } = req.params;

    // Check if the email exists in the database
    const user = await getUserByEmail(email);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Generate a password reset token
    const resetToken = generateToken();

    // Save the reset token and its expiration time in the user document
    user.resetToken = resetToken;
    user.resetExpires = Date.now() + 3600000; // Token expires in 1 hour
    const updatedUser = await user.save();

    if (!updatedUser) {
        res.status(500).send("Failed to update reset token");
    }

    // Create the password reset URL with the token
    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

    const html = `
    <h3>Hello ${user.name},</h3>
    <p>We received a request to reset your password. Please click the link below to reset your password:</p>
    <p><a href="${resetUrl}">Click to Reset Password</a></p>
    <p><em>This link is valid for 24 hours only. If you didn't request this, please ignore this email.</em></p>
    <p>Regards,</p>
    <p>Team StockMaster</p>
    `;

    if (updatedUser) await sendEmail(email, "StockMaster | Reset Password", html);

    res
        .status(200)
        .json({ message: `Password reset instructions sent to ${email}` });
});

exports.resetPasword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ resetToken });

    if (!user) {
        res.status(404);
        throw new Error("Invalid reset token");
    }

    const now = Date.now();

    if (now > user.resetExpires) {
        res.status(400).json({ error: "Reset code has expired." });
        // Check if the OTP matches
    }

    // Hash and update the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = null;
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
});


const generateToken = (res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return token;
};