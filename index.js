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



const app = express();
const port = 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"));









app.listen(port, () => {
    console.log(`Server runing on port ${port}`);
});