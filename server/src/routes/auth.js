import express from 'express';
import {loginUser} from "../controllers/user-controller.js";
const router = express.Router();

router.post("/", async (req, res) => {
    await loginUser(req, res);
});

export default router;