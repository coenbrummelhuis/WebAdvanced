import httpStatusCodes from "http-status-codes";
import defaultBooks from "../resources/books.js";
import defaultBook from "../models/default-book.js";
import {getUserById} from "./user-controller.js";

let books = defaultBooks;
const tempChannel = {
    stream: null
};
const channels = new Map();


/**
 * CRUD: CREATE
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
    if (parseInt(price) !== parseFloat(price)) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "Price can't have decimals!"});
        return;
    }


    if (bidder === undefined || bidder["username"] === undefined) {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong with your account!"});
    }

    const book = books.find(b => b["id"] === parseInt(id)) || null;
    if (book === null) {
        res.status(httpStatusCodes.NOT_FOUND).json({message: "There is no book with that id!"});
        return;
    }

    if (price <= book.price) {
        res.status(httpStatusCodes.CONFLICT).json({message: "A bid higher or equal to this bid has already been placed!"});
        return;
    }
    if (book.bidders.at(book.bidders.length - 1) !== undefined) {
        if (book.bidders.at(book.bidders.length - 1).bidder === bidder.username) {
            res.status(httpStatusCodes.CONFLICT).json({message: "You already have the highest bid!"});
            return;
        }
    }

    book.bidders = [...book.bidders, {
        "bidder": bidder.username,
        "price": price
    }];
    book.price = price;
    const sendBook = Object.assign({}, book);

    const message = {
        bidders: sendBook.bidders,
        price: sendBook.price
    };
    distributeMessage(book.id, message);
    res.status(httpStatusCodes.OK).json(sendBook);
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
                    return b.price >= parseInt(filter.priceFrom);
                } else {
                    return true;
                }
            }).filter(b => {
                if (filter.priceTo !== undefined) {
                    if (isNaN(filter.priceTo)) {
                        throw new Error("Upper price is not a number");
                    }
                    return b.price <= parseInt(filter.priceTo);
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
export function getBookById(req, res) {
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
    const monitorId = crypto.randomUUID();
    book.monitorID = monitorId;
    channels.set(monitorId, {bookId: id});
    res.status(httpStatusCodes.OK).json(book);
}

/**
 * CRUD: READ
 *
 * Monitors the book by id
 * @param req The request of the server
 * @param res The response to the client
 */
export function monitorBookById(req, res) {
    const id = req.params.id || undefined;
    if (id === undefined) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "ID can't be null!"});
        return;
    }
    if (isNaN(parseInt(id))) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "ID is not a number!"});
        return;
    }
    const monitorId = req.params.monitorId || undefined;
    if (monitorId === undefined) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "Monitor ID can't be null!"});
        return;
    }
    if (channels.get(monitorId) === undefined) {
        res.status(httpStatusCodes.NOT_FOUND).json({message: "There is no monitor with that id!"});
        return;
    }
    const channel = channels.get(monitorId);
    if (channel.stream) {
        res.status(httpStatusCodes.CONFLICT).json({message: "There is already a monitor with that id!"});
        return;
    }

    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Connection", "keep-alive");
    // flushing causes the headers of the response to be communicated back to the client
    // from this point on, the client can receive pushed data
    res.flushHeaders();

    channel.stream = res;
    tempChannel.stream = res;

    res.on("close", () => {
        channels.delete(monitorId);
    });
}

/**
 * CRUD: READ
 *
 * Get the bids by the user
 * @param req The request of the server
 * @param res The response of the server
 */
export function getBidsByUser(req, res) {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    if (id === undefined || userId === undefined) {
        res.status(httpStatusCodes.BAD_REQUEST).json({message: "Please add an id to the request!"});
        return;
    }
    if (id !== userId) {
        res.status(httpStatusCodes.FORBIDDEN).json({message: "You are not authorized to view another persons bids!"});
        return;
    }
    const bids = [];
    for (const book of books) {
        if (book.bidders !== undefined) {
            book.bidders.forEach(b => {
                if (b.bidder === getUserById(id).username) {
                    bids.push(book);
                }
            });
        }
    }
    res.status(httpStatusCodes.OK).json({message: bids});
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

    const oldBook = books.findIndex(b => b["id"] === parseInt(id));
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
    const bookId = books.findIndex(b => b["id"] === parseInt(id));
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
    if (!hasCorrectDate(book["launchDate"])) {
        throw new Error("Launch date is in incorrect format!");
    }
    book["launchDate"] = new Date(book["launchDate"]);
    if (!hasCorrectDate(book["auction-date"])) {
        throw new Error("Auction date is in incorrect format!");
    }
    book["auction-date"] = new Date(book["auction-date"]);
    const newBook = checkBookAttributes(book);
    if (isNaN(book["price"])) {
        throw new Error("Price is not a number!");
    }
    return newBook;
}

function distributeMessage(id, message) {
    for (const [channelId, {stream, bookId}] of channels) {
        if (stream) {
            if (parseInt(id) === parseInt(bookId)) {
                console.log("Send new message to " + channelId + "\n" + JSON.stringify(message));
                stream.write(`data: ${JSON.stringify(message)}\n\n`);
            }
        }
    }
}

function hasCorrectDate(date) {
    const newDate = Date.parse(date);
    if (newDate === undefined || isNaN(newDate)) {
        return false;
    }
    return true;
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