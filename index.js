import bodyParser from "body-parser";
import express from "express";
import axios from "axios";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bookwars",
    password: "L!gtctwwpo@256"  
})
db.connect();

const app = express();
const port = 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

var ratingBased = false;

app.post("/sorted", (req, res) => {
   if (req.body.sortBy == "rating") {
    ratingBased = true;
   } else if (req.body.sortBy == "id") {
    ratingBased = false;
   }
   res.redirect("/");
})

app.get("/", async (req, res) => {
    //getting array of all readers
    var readersArray = [];
    var data = await db.query("Select * FROM users");
    var readers = data.rows;
    for (let i = 0; i < readers.length; i++) {
        readersArray.push(readers[i].name);
    }

    //getting 2d array of each readers books
    var books2DArray = [];
    var bookRatings2DArray = [];
    for (let i = 0; i < readers.length; i++) {
        var datatwo;
        if (ratingBased) {
            datatwo = await db.query("SELECT * FROM books WHERE user_id = $1 ORDER BY rating DESC", [readers[i].id]);
        } else {
            datatwo = await db.query("SELECT * FROM books WHERE user_id = $1 ORDER BY id DESC", [readers[i].id]);
        }
        var singleBooks = datatwo.rows;
        var singleBooksArray = [];
        var singleBookRatingsArray = [];
        for (let j = 0; j < singleBooks.length; j++) {
            singleBooksArray.push(singleBooks[j].book_name);
            singleBookRatingsArray.push(singleBooks[j].rating);
        }
        books2DArray.push(singleBooksArray);
        bookRatings2DArray.push(singleBookRatingsArray);
    }

    res.render("index.ejs", {
        readers: readersArray,
        books: books2DArray,
        ratings: bookRatings2DArray
    });
});

app.post("/add", async (req, res) => {
    res.render("add.ejs", {
        user: req.body.user
    });
})

app.post("/added", async (req, res) => {
    var data = await db.query("SELECT id FROM users WHERE name = $1", [req.body.user]);
    var id = data.rows[0].id;

    db.query("INSERT INTO books (book_name, user_id, rating) VALUES ($1, $2, $3)", [req.body.bookname, id, req.body.rating || 0]);
    res.redirect("/");
})

app.post("/delete", async (req, res) => {
    var data = await db.query("SELECT id FROM users WHERE name = $1", [req.body.whichUser]);
    var id = data.rows[0].id;
    await db.query("DELETE FROM books WHERE book_name = $1 AND user_id = $2", [req.body.whichBook, id]);
    res.redirect("/")
})





app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});