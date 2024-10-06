import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import httpStatusCodes from "http-status-codes";
import defaultUsers from "../resources/users.js"

let users = defaultUsers;
const saltRounds = 10;

export async function createUser(req, res) {
    const newUser = req.body;
    try {
        checkUser(newUser);
    }catch (e) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: e.message});
        return;
    }

    if (userExists(newUser)) {
        res.status(httpStatusCodes.CONFLICT).json({message: "There already is an account with that email!"});
        return;
    }

    try {
        const user = await addUser(newUser.username, newUser.password);
        const token = jwt.sign({userId: user.id, roles: user.roles}, user.secret);
        res.status(httpStatusCodes.CREATED).json({token: token});
    } catch (e) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: e.message});
    }
}

export async function loginUser(req, res) {
    const username = req.body.username || undefined;
    const password = req.body.password || undefined;
    const user = users.find(u => u["username"] === username) || undefined;
    if (user === undefined) {
        res.status(httpStatusCodes.FORBIDDEN).json({message: "Username or password is not correct!"});
        return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        res.status(httpStatusCodes.FORBIDDEN).json({message: "Username or password is not correct!"});
        return;
    }
    const token = jwt.sign({userId: user.id, roles: user.roles}, user.secret);
    res.status(httpStatusCodes.OK).json({token: token});
}

export async function logoutUser(req, res) {
    const user = req.user;
    revokeSecret(user);
    res.status(httpStatusCodes.OK).json({message: "Succesfully logged out!"});
}

// Helper methods
async function addUser(username, password) {
    const hash = await bcrypt.hash(password, saltRounds);
    const user = {
        "id": users.length,
        "username": username,
        "password": hash,
        "secret": crypto.randomUUID(),
        "roles": ["bidder"]
    }
    users = [...users, user];
    return user;
}

function checkUser(user) {
    const username = user.username;
    const password = user.password;
    if (!validEmail(username)) {
        throw new Error("Email is not a valid email!");
    }
    validPassword(password);
}

function userExists(newUser) {
    const user = users.find(u => u["username"] === newUser["username"]) || undefined;
    return user !== undefined;
}

function revokeSecret(user) {
    user["secret"] = crypto.randomUUID();
}

function validEmail(email) {
    if (email == null) {
        throw new Error("Email can't be empty!");
    }
    if (!email.includes("@")) {
        return false;
    }

    const provider = email.split("@")[1];
    if (!provider.includes(".")) {
        return false;
    }
    return true;
}

function validPassword(password) {
    if (password === null) {
        throw new Error("Password can't be empty!")
    }
    if (password.length < 8) {
        throw new Error("Password should have a length of at least 8");
    }
    if (!password.match(/[a-z]/)) {
        throw new Error("Password should have at least one lowercase letter!");
    }
    if (!password.match(/[A-Z]/)) {
        throw new Error("Password should have at least one uppercase letter!");
    }
    if (!password.match(/\d/)) {
        throw new Error("Password should have at least one number!");
    }
}

export function getUserById(id) {
    return users.find(u => u["id"] === id);
}
