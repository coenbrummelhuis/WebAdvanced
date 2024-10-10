import express from "express";
import {createUser} from "../controllers/user-controller.js";
import checkContentTypeHeader from "../middleware/check-content-type-header.js";
import isLoggedIn from "../middleware/is-logged-in.js";
import {getBidsByUser} from "../controllers/book-controller.js";
const router = express.Router();

router.post('/', checkContentTypeHeader, async (req, res) => {
    await createUser(req, res);
});

router.get('/:id/bids', isLoggedIn, async (req, res) => {
    getBidsByUser(req, res);
})
export default router;