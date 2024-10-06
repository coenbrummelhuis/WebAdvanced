import httpStatusCodes from "http-status-codes";

export default function (req, res, next) {
    const contentTypeHeader = req.header("Content-Type") || undefined;
    if (contentTypeHeader === undefined || contentTypeHeader !== "application/json") {
        res.status(httpStatusCodes.UNSUPPORTED_MEDIA_TYPE).json({message: "The communication with this server is only with json files!"});
        return;
    }
    next();
}