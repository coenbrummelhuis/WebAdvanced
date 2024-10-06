import express from "express";
import {createUser} from "../controllers/user-controller.js";
import checkContentTypeHeader from "../middleware/check-content-type-header.js";
const router = express.Router();

router.post('/', checkContentTypeHeader, async (req, res) => {
    await createUser(req, res);
});

export default router;