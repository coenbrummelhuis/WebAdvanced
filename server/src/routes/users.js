import express from "express";
import {createUser, validateEmail} from "../controllers/user-controller.js";
const router = express.Router();

router.post('/', function (req, res) {
    createUser(req, res)
})