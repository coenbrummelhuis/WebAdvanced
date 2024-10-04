import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import httpStatusCodes from "http-status-codes";
import defaultUsers from "../resources/users.js"

let users = defaultUsers;
const saltRounds = 10;

export async function createUser(req, res) {
    const body = req.body;
    try {
        if (!validEmail(body["username"])) {
            res.status(httpStatusCodes.BAD_REQUEST).json({message: "Email is not a valid email!"});
            return;
        }
    }catch (e) {
        res.status(httpStatusCodes.CONFLICT).json({message: e});
        return;
    }

    if (!validPassword(body["password"])) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "Password is not a valid password!"});
        return;
    }
    try {
        await addUser(body["username"], body["password"]);
        await loginUser(req, res)
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

// Helper methods
async function addUser(username, password) {
    const hash = await bcrypt.hash(password, saltRounds);
    users = [...users, {
        "id": users.length,
        "username": username,
        "password": hash,
        "secret": crypto.randomUUID(),
        "roles": ["bidder"]
    }];
}

function validEmail(email) {
    if (email == null) {
        return false;
    }
    if (!email.includes("@")) {
        return false;
    }
    const first = email.split("@")[0];
    const provider = email.split("@")[1];
    if (!provider.includes(".")) {
        return false;
    }
    const user = users.find(u => u["username"] === email) || undefined;
    if (user !== undefined) {
        throw new Error("This email already exists!");
    }
    return true;
}

function validPassword(password) {
    // @TODO: Check if it is complicated enough
    if (password === null) {
        return false;
    }
    return true;
}

export function getUserById(id) {
    return users.find(u => u["id"] === id);
}
