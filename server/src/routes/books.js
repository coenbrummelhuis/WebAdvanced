import express from "express";
import {addBook, bidBook, deleteBook, getBookById, getBooks, updateBook} from "../controllers/book-controller.js";
import isLoggedIn from "../middleware/is-logged-in.js";
import isAdmin from "../middleware/is-admin.js";

const router = express.Router();

/**
 * CRUD: CREATE
 */
router.post('/', isLoggedIn, isAdmin, (req, res) => {
    addBook(req, res);
});

router.post('/:id/bids', (req, res) => {
    bidBook(req, res);
});

/**
 * CRUD: READ
 */
router.get('/', (req, res) => {
    getBooks(req, res);
});

router.get('/:id', (req, res) => {
    getBookById(req, res);
});

/**
 * CRUD: UPDATE
 */
router.put('/:id', (req, res) => {
    updateBook(req, res);
});

/**
 * CRUD: DELETE
 */
router.delete('/id', (req, res) => {
    deleteBook(req, res);
});

export default router;