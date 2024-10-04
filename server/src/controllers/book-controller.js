import httpStatusCodes from "http-status-codes";
import defaultBooks from "../resources/books.js";
import defaultBook from "../models/default-book.js";

let books = defaultBooks;


/**
 * CRUD: READ
 *
 * Add a new book
 * @param req The request of the server
 * @param res The response to the client
 */
export function addBook(req, res) {
    const newBook = req.body;
    newBook["id"] = books.length;

    let book;
    try {
        book = checkBook(newBook);
    } catch (e) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: e.message});
        return;
    }

    if (bookExists(book)) {
        res.status(httpStatusCodes.CONFLICT).json({message: `There already is an item with that id!`});
        return;
    }

    try {
        res.status(httpStatusCodes.CREATED).json(addBookToArray(book));
    } catch (e) {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({message: e.message});
    }
}

export function bidBook(req, res) {
    const id = req.params.id || undefined;
    const price = req.body.price;
    const bidder = req.user || undefined;
    if (id === undefined) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "ID can't be null"});
        return;
    }
    if (isNaN(parseInt(id))) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "ID is not a number!"});
        return;
    }

    if (price === undefined) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "Price can't be null!"});
        return;
    }
    if (isNaN(parseInt(price))) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "Price is not a number!"});
        return;
    }

    if (bidder === undefined || bidder["username"] === undefined) {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong with your account!"});
    }

    let book = books.find(b => b["id"] === parseInt(id)) || null;
    if (book === null) {
        res.status(httpStatusCodes.NOT_FOUND).json({message: "There is no book with that id!"});
        return;
    }
    book.bidders = [...book.bidders, bidder.username];
    book.price = price;
    res.status(httpStatusCodes.OK).json(book);
}
/**
 * CRUD: READ
 *
 * Get all books
 * @param req The request of the server
 * @param res The response to the client
 */
export function getBooks(req, res) {
    const response = books;
    const filter = {
        title: req.query.title || undefined,
        language: req.query.language || undefined,
        author: req.query.author || undefined,
        priceFrom: req.query.priceFrom || undefined,
        priceTo: req.query.priceTo || undefined
    };
    try {
        res.status(httpStatusCodes.OK).json(
            response.filter(b => {
                if (filter.title !== undefined) {
                    return b.title.toLowerCase().includes(filter.title.toLowerCase());
                } else {
                    return true;
                }
            }).filter(b => {
                if (filter.language !== undefined) {
                    return b.language.toLowerCase().includes(filter.language.toLowerCase());
                } else {
                    return true;
                }
            }).filter(b => {
                if (filter.author !== undefined) {
                    return b.author.toLowerCase().includes(filter.author.toLowerCase());
                } else {
                    return true;
                }
            }).filter(b => {
                if (filter.priceFrom !== undefined) {
                    if (isNaN(filter.priceFrom)) {
                        throw new Error("Upper price is not a number");
                    }
                    return b.price >= filter.priceFrom;
                } else {
                    return true;
                }
            }).filter(b => {
                if (filter.priceTo !== undefined) {
                    if (isNaN(filter.priceTo)) {
                        throw new Error("Upper price is not a number");
                    }
                    return b.price <= filter.priceTo;
                } else {
                    return true;
                }
            })
        );
    } catch (e) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: e.message});
    }
}

/**
 * CRUD: READ
 *
 * Get one book by id
 * @param req The request of the server
 * @param res The response to the client
 */
export function getBookById (req, res) {
    const id = req.params.id || undefined;
    if (id === undefined) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "ID can't be null!"});
        return;
    }
    if (isNaN(parseInt(id))) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "ID is not a number!"});
        return;
    }
    const book = books.find(b => b["id"] === parseInt(id)) || null;
    if (book === null) {
        res.status(httpStatusCodes.NOT_FOUND).json({message: "There is no book with that id!"});
        return;
    }
    res.status(httpStatusCodes.OK).json(book);
}

/**
 * CRUD: UPDATE
 *
 * Update one book by id
 * @param req The request of the server
 * @param res The response to the client
 */
export function updateBook(req, res) {
    const id = req.params.id || undefined;
    const newBook = req.body;

    if (id === undefined) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "ID can't be null"});
        return;
    }
    if (isNaN(parseInt(id))) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "ID is not a number!"});
        return;
    }

    let book;
    try {
        book = checkBook(newBook);
    } catch (e) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: e.message});
        return;
    }

    let oldBook = books.findIndex(b => b["id"] === parseInt(id)) || null;
    if (oldBook === null) {
        res.status(httpStatusCodes.NOT_FOUND).json({message: "There is no book with that id!"});
        return;
    }
    books[oldBook] = book;
    res.status(httpStatusCodes.OK).json(book);
}

/**
 * CRUD: DELETE
 *
 * Delete one book by id
 * @param req The request of the server
 * @param res The response to the client
 */
export function deleteBook(req, res) {
    const id = req.params.id || undefined;
    const bookId = books.findIndex(b => b["id"] === parseInt(id)) || null;
    if (bookId === null) {
        res.status(httpStatusCodes.NOT_FOUND).json({message: "There is no book with that id!"});
        return;
    }
    const book = books[bookId];
    books.splice(bookId, 1);
    res.status(httpStatusCodes.OK).json(book);
}

// Helper methods

function checkBook(book) {
    let newBook;
    try {
        newBook = checkBookAttributes(book);
    } catch (e) {
        throw e;
    }
    if (!hasCorrectDate(newBook["launchDate"])) {
        throw new Error("Launch date is in incorrect format!");
    }
    if (!hasCorrectDate(newBook["auction-date"])) {
        throw new Error("Auction date is in incorrect format!");
    }
    if (isNaN(newBook["price"])) {
        throw new Error("Price is not a number!");
    }
    return newBook;
}

function hasCorrectDate(date) {
    if (date.split("-").length !== 3) {
        return false;
    }
    if (date.split("-").some(datePart => isNaN(parseInt(datePart)))) {
        return false;
    }
    return (date.split("-")[0] <= 31 && date.split("-")[1] <= 12);
}

function checkBookAttributes(book) {
    const newResource = Object.assign({}, defaultBook);
    const resource = book;
    for (const attribute in newResource) {
        if (resource[attribute] === undefined) {
            throw new Error(`This book doesn't have an ${attribute}!`);
        } else if (typeof newResource[attribute] !== typeof resource[attribute]) {
            throw new Error(`The ${attribute} of this book is of the wrong type!`);
        } else {
            newResource[attribute] = resource[attribute];
        }
    }
    return newResource;
}

function addBookToArray(book) {
    books = [...books, book];
    return book;

}

function bookExists(book) {
    return books.some((b) => b["id"] === book["id"]);
}