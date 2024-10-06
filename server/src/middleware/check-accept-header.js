import httpStatusCodes from "http-status-codes";

export default function (req, res, next) {
    const acceptHeader = req.header('Accept') || undefined;
    if (acceptHeader === undefined || acceptHeader !== "application/json") {
        res.status(httpStatusCodes.NOT_ACCEPTABLE).json({message: "The communication with this server is only with json files!"});
        return;
    }
    next();
}