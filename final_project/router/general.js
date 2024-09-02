const express = require('express');
const axios = require('axios'); 
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    // Check if the username already exists
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }
    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        // Directly send the books data instead of making an axios request
        res.send(JSON.stringify(books, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = books[isbn];
        if (book) {
            res.send(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const booksByAuthor = [];
        for (let key in books) {
            if (books[key].author === author) {
                booksByAuthor.push(books[key]);
            }
        }
        if (booksByAuthor.length > 0) {
            res.send(booksByAuthor);
        } else {
            res.status(404).json({ message: "Books by this author not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});



// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const booksByTitle = [];
        for (let key in books) {
            if (books[key].title === title) {
                booksByTitle.push(books[key]);
            }
        }
        if (booksByTitle.length > 0) {
            res.send(booksByTitle);
        } else {
            res.status(404).json({ message: "Books with this title not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book_isbn = req.params.isbn;
    const book = books[book_isbn];

    if (book) {
        res.send(book.reviews);
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});


module.exports.general = public_users;
