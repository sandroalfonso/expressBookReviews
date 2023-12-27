const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
}else{
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
let validUser = users.filter((user) => {
  return(user.username === username && user.password === password)
});
if(validUser.length > 0){
  return true;
}else{
  return false;
}
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60*60});

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else{
    return res.status(208).json({message: "Invalid Login, Check username & password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const reviewText = req.query.review;
  
    // Check if the book with the given ISBN exists
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
  
      // Check if the reviews property is an object, if not initialize it as an empty object
      if (typeof book.reviews !== 'object' || book.reviews === null) {
        book.reviews = {};
      }
  
      // Check if the user has already posted a review for this book
      if (book.reviews.hasOwnProperty(username)) {
        // Modify existing review if the user has already posted a review
        book.reviews[username].text = reviewText;
      } else {
        // Add a new review if the user hasn't posted a review for this book
        book.reviews[username] = {
          text: reviewText,
        };
      }
  
      return res.status(200).json({ message: "Review added or modified successfully", book: book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    // Check if the book with the given ISBN exists
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
  
      // Check if the reviews property is an object
      if (typeof book.reviews === 'object' && book.reviews !== null) {
        // Check if the user has posted a review for this book
        if (book.reviews.hasOwnProperty(username)) {
          // Delete the user's review
          delete book.reviews[username];
  
          return res.status(200).json({ message: "Review deleted successfully", book: book });
        } else {
          return res.status(404).json({ message: "Review not found for the given user" });
        }
      } else {
        return res.status(404).json({ message: "No reviews found for the book" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
