import httpStatusCodes from "http-status-codes";

export default function (req, res, next) {
    const user = req.user || undefined;
    if (user === undefined) {
        res.status(httpStatusCodes.FORBIDDEN).json({message: "You are not authorized!"});
    }
    if (user["roles"].includes("admin")) {
        next();
    }else {
        res.status(httpStatusCodes.FORBIDDEN).json({message: "You are not authorized!"})
    }
}