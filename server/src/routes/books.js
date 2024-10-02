import express from "express";
import {addBook, deleteBook, getBookById, getBooks, updateBook} from "../controllers/book-controller.js";
const router = express.Router();

/**
 * CRUD: CREATE
 */
router.post('/', function (req, res) {
    addBook(req, res);
});

/**
 * CRUD: READ
 */
router.get('/', function (req, res) {
    getBooks(req, res);
});

router.get('/:id', function (req, res) {
    getBookById(req, res);
});

/**
 * CRUD: UPDATE
 */
router.put('/:id', function (req, res) {
    updateBook(req, res);
});

/**
 * CRUD: DELETE
 */
router.delete('/id', function (req, res) {
    deleteBook(req, res);
});

export default router;