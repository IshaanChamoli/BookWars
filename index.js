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




app.get("/", async (req, res) => {
    //getting array of all readers
    var readersArray = []
    var data = await db.query("Select * FROM users");
    var readers = data.rows
    for (let i = 0; i < readers.length; i++) {
        readersArray.push(readers[i].name)
    }

    //getting 2d array of each readers books
    var books2DArray = []
    for (let i = 0; i < readers.length; i++) {
        var datatwo = await db.query("SELECT * FROM books WHERE user_id = $1", [readers[i].id]);
        var singleBooks = datatwo.rows;
        var singleBooksArray = [];
        for (let j = 0; j < singleBooks.length; j++) {
            singleBooksArray.push(singleBooks[j].book_name)
        } 
        books2DArray.push(singleBooksArray);
    }

    // FINAL ARRAYS 
    console.log(readersArray);
    console.log(books2DArray);

    res.render("index.ejs", {
        readers: readersArray,
        books: books2DArray
    });
});






app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});