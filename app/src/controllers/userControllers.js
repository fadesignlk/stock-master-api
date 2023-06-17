const asyncHnadler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
const User = require("../models/userModel");
const { sendEmail } = require("../services/emailServices");


// Controller for getting a user by ID
exports.getUserById = asyncHnadler(async (req, res) => {
    const { userId } = req.params;
    const user = await getUserById(userId);
    if (!user) throw new ApiError(400, "User not found");

    res.json(user);
});

// Controller for getting a user by ID
exports.getAllUsers = asyncHnadler(async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
});

// Controller for creating a new user
exports.createUser = asyncHnadler(async (req, res) => {
    const { name, phoneNumber, email, role } = req.body;

    if (!name || !email || !phoneNumber || !role) {
        throw new ApiError(400, "Please add all fields");
    }

    const userExists = await User.findOne({
        $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    if (userExists) {
        throw new ApiError(400, "User already exists");
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);

    const password = generateTemporaryPassword();

    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
        name,
        email,
        phoneNumber,
        role,
        password : hashedPassword
    }

    const newUser = await createUser(userData);

    const html = `
    <h3>Hi ${name},</h3>
    </br></br></br></br></br></br></br></br>

    <p>Your user account is successfully created for Stock Master, please find your temporary user credentails below.</p>
    <p>username: ${phoneNumber}</p>
    <p>password: ${password}</p>
    </br></br>
    <p><em>Note: Your account password is temporary only. Please make sure to update your password once you login to the system.</em></p>
    </br></br></br></br></br></br></br></br>
    <p>Regards,</p>
    <p>Team StockMaster</p>
  `;

    if (newUser) await sendEmail(email, "Welcome to Stock Master", html);

    res.json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });
});

// Controller for getting a user by email
exports.getUserByEmail = asyncHnadler(async (req, res) => {
    const { email } = req.query;
    const user = await getUserByEmail(email);
    if (!user) throw new ApiError(400, "User not found");

    res.json(user);
});

// Controller for updating a user
exports.updateUser = asyncHnadler(async (req, res) => {
    const { userId } = req.params;
    const userData = req.body;

    //hash the password
    const salt = await bcrypt.genSalt(10);

    if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        userData.password = hashedPassword;
    }

    const updatedUser = await updateUser(userId, userData);
    if (!updatedUser) throw new ApiError(400, "User not found");

    res.json(updatedUser);
});

// Controller for deleting a user
exports.deleteUser = asyncHnadler(async (req, res) => {
    const { userId } = req.params;
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) throw new ApiError(400, "User not found");

    res.json(deletedUser);
});

// Controller for getting paginated users
exports.getPaginatedUsers = asyncHnadler(async (req, res) => {
    const { page, limit } = req.query;
    const paginatedUsers = await getPaginatedUsers(page, limit);
    res.json(paginatedUsers);
});


const generateTemporaryPassword = () => {
    return crypto.randomBytes(4).toString("hex");
};