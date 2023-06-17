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
    const userData = req.body;
    const newUser = await createUser(userData);
    res.json(newUser);
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
