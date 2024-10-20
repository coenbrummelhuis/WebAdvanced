import jwt from "jsonwebtoken";
import httpStatusCodes from "http-status-codes";
import {getUserById} from "../controllers/user-controller.js";
export default function (req, res, next) {
    const header = req.header('Authorization') || undefined;
    if (header === undefined) {
        res.status(httpStatusCodes.UNAUTHORIZED).json({message: "No authorization header has been supplied!"});
        return;
    }
    const token = header.split(" ")[1] || undefined;
    if(token === undefined) {
        res.status(httpStatusCodes.UNAUTHORIZED).json({message: "No authorization header has been supplied!"});
        return;
    }
    try {
        const decode = jwt.decode(token, { complete: true }) || undefined;
        if (decode === undefined) {
            res.status(httpStatusCodes.UNAUTHORIZED).json({message: "You are not authorized"});
            return;
        }
        const payload = decode.payload;
        if (payload === undefined) {
            res.status(httpStatusCodes.UNAUTHORIZED).json({message: "You are not authorized"});
            return;
        }
        const user = getUserById(payload["userId"]);
        if (user === undefined) {
            res.status(httpStatusCodes.UNAUTHORIZED).json({message: "You are not authorized!"});
            return;
        }
        const decoded = jwt.verify(token, user.secret);
        if (decoded) {
            req.user = user;
        }else {
            res.status(httpStatusCodes.UNAUTHORIZED).json({message: "You are not authorized!"});
            return;
        }

    }catch (e) {
        console.log(e.message);
        res.status(httpStatusCodes.UNAUTHORIZED).json({message: "You are not authorized!"});
        return;
    }
    next();
}