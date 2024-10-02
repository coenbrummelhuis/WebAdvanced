import httpStatusCodes from "http-status-codes";
import books from "../resources/books.js";
import defaultBook from "../models/default-book.js";

/**
 * CRUD: READ
 *
 * Add a new book
 * @param req The request of the server
 * @param res The response to the client
 */
export function addBook(req, res) {
    let newBook = req.body;

    let book;
    try {
        book = checkBook(newBook);
    } catch (e) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: e})
        return;
    }

    if (bookExists(book)) {
        res.status(httpStatusCodes.CONFLICT).json({message: `There already is an item with that id!`})
        return;
    }

    try {
        res.status(httpStatusCodes.CREATED).json(addBookToArray(book));
    } catch (e) {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong while adding the book to the array!'});
    }
}

/**
 * CRUD: READ
 *
 * Get all books
 * @param req The request of the server
 * @param res The response to the client
 */
export function getBooks(req, res) {

}

/**
 * CRUD: READ
 *
 * Get one book by id
 * @param req The request of the server
 * @param res The response to the client
 */
export function getBookById(req, res) {

}

/**
 * CRUD: UPDATE
 *
 * Update one book by id
 * @param req The request of the server
 * @param res The response to the client
 */
export function updateBook(req, res) {

}

/**
 * CRUD: DELETE
 *
 * Delete one book by id
 * @param req The request of the server
 * @param res The response to the client
 */
export function deleteBook(req, res) {

}

// Helper methods
function checkBook(book) {
    let newBook;
    try {
        newBook = checkBookAttributes(book);
    }catch (e) {
        throw e;
    }

    return newBook;
}

function checkBookAttributes(book) {
    let newResource = Object.assign({}, defaultBook);
    let resource = book
    for (const attribute in resource) {
        if (resource[attribute] === undefined) {
            throw new Error(`This book doesn't have an ${attribute}!`)
        } else if(typeof newResource[attribute] !== typeof resource[attribute]) {
            throw new Error(`The ${attribute} of this book is of the wrong type!`)
        }else {
            resource[attribute] = newResource[attribute];
        }
    }
    return resource;
}

function addBookToArray(book) {
    throw ""
}

function bookExists(book) {
    return false;
}