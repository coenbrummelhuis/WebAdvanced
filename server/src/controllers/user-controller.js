import bcrypt from "bcrypt";
import httpStatusCodes from "http-status-codes";
import defaultUsers from "../resources/users.js"

let users = defaultUsers;
const saltRounds = 10;

export async function createUser(req, res) {
    const body = req.body;
    if (!validEmail(body["email"])) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "Email is not a valid email!"});
        return;
    }
    if (!validPassword(body["password"])) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "Password is not a valid password!"});
        return;
    }
    try {
        await addUser(body["email"], body["password"]);
    } catch (e) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: e.message});
    }
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
    // @TODO: Check if it already exists
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
    return true;
}

function validPassword(password) {
    // @TODO: Check if it is complicated enough
    if (password === null) {
        return false;
    }
    return true;
}
