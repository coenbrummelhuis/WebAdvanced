import express from 'express';
import {loginUser, logoutUser} from "../controllers/user-controller.js";
import checkContentTypeHeader from "../middleware/check-content-type-header.js";
import isLoggedIn from "../middleware/is-logged-in.js";
import isAdmin from "../middleware/is-admin.js";

const router = express.Router();

router.post("/", checkContentTypeHeader, async (req, res) => {
    await loginUser(req, res);
});

router.delete("/", isLoggedIn, async (req, res) => {
   await logoutUser(req, res);
});

export default router;