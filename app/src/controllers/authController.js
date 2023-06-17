const asyncHnadler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
    getUserById,
    getAllUsers,
    createUser,
    getUserByEmail,
    updateUser,
    deleteUser,
    getPaginatedUsers
} = require("../services/userServices");
const ApiError = require("../utils/ApiError");


exports.getMe = asyncHnadler(async (req, res) => res.status(200).json(req.user));


// @access  Public
exports.loginUser = asyncHnadler(async (req, res) => {
    const { username: phoneNumber, password } = req.body;

    // check for user phoneNumber
    const user = await User.findOne({ phoneNumber })
        .select(
            "-createdAt -updatedAt -__v -otp -otpExpires -resetExpires -resetToken"
        );

    if (!user) throw new ApiError(400, "Invalid username");

    if (!user.password) throw new ApiError(400, "User is not verified");

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            user: { ...user.toObject(), password: undefined },
            token: generateToken(user._id),
        });

        const activityLogPayload = {
            user: user.id,
            action: "User Logged In",
        };

        await createActivityLog(activityLogPayload);
    } else {
        res.status(400);
        throw new Error("Incorrect crdentials");
    }
});