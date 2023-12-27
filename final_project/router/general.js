const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered!"})
    }else{
      return res.status(300).json({message: "User already exists!"})
    }
  }
  return res.status(404).json({message: "Unable to register user!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  async function functionCall(){
    console.log("Calling function");
    res.send(JSON.stringify(books, null, 4));
  }
  functionCall();
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    // Callback function to handle the response
    const handleResponse = (err, result) => {
        if (err) {
          console.error("Error:", err);
          res.status(500).send("Internal Server Error");
        } else {
          res.send(result);
        }
      };
    
      // Simulate an asynchronous operation using axios (replace with your actual async logic)
      axios.get('https://sandrozzzy30-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai' + isbn)
        .then(function (response) {
          // Assuming the response.data contains the book details
          handleResponse(null, response.data);
        })
        .catch(function (error) {
          // Handle errors here
          handleResponse(error, null);
        });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  // Callback function to handle the response
  const handleResponse = (err, result) => {
    if (err) {
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  };

  // Simulate an asynchronous operation using axios (replace with your actual async logic)
  axios.get('https://sandrozzzy30-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai' + author)
    .then(function (response) {
      // Assuming the response.data contains the matched books
      const matchedBooks = response.data.map((book) => ({
        isbn: book.isbn,
        details: book
      }));

      // Call the callback with the result
      handleResponse(null, matchedBooks);
    })
    .catch(function (error) {
      // Handle errors here
      handleResponse(error, null);
    });
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  // Callback function to handle the response
  const handleResponse = (err, result) => {
    if (err) {
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  };

  // Simulate an asynchronous operation using axios (replace with your actual async logic)
  axios.get('https://sandrozzzy30-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai' + title)
    .then(function (response) {
      // Assuming the response.data contains the matched books
      const matchedBooks = response.data.map((book) => ({
        isbn: book.isbn,
        details: book
      }));

      // Call the callback with the result
      handleResponse(null, matchedBooks);
    })
    .catch(function (error) {
      // Handle errors here
      handleResponse(error, null);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const key = Object.keys(books)

  key.forEach((bookID) => {
    const book = books[bookID]
    if(isbn === bookID){
        res.send(book.reviews)
    }
  })


});

module.exports.general = public_users;
