import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import crypto from "crypto";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "urlShortener",
  password: "ThePostgreSql",
  port: 5432,
});
db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err.stack);
  } else {
    console.log("Successfully connected to the PostgreSQL DB");
  }
});

app.get("/", (req, res) =>{
    try{
      res.render("index.ejs");
    } catch (err){
      console.log("your request failed, No response from server", err.stack);
      res.render("index.ejs", {error: "Failed to get a response, check Url."});
      //res.status(500).send("Something went wrong on our server. Please try again later.");
}
});

//to convert a long url to a short code section
app.post("/submitLink", async (req, res) =>{
  try{
    const url = req.body.url.trim();
    let length = 6;

    if (url === "") {
       res.render("index.ejs", {error: "Please enter a valid URL."});
    }else if (!url.startsWith("http://") && !url.startsWith("https://")) {
       res.render("index.ejs", {error: "Please enter a valid URL starting with http:// or https://"});
    }else { 
      const shortCode = crypto.randomBytes(length).toString("base64url").slice(0, length);

      console.log("short Code:", shortCode);
      console.log("Received URL:", url);

      //after verification and code generation, nxt i will store the URL and short code in the DB
      const inserted  = await db.query("INSERT INTO urlshortener (long_url, short_code) VALUES ($1, $2) RETURNING *", [url, shortCode]);
      console.log(inserted.rows);

      res.render("index.ejs", {shortUrl: `http://localhost:3000/${shortCode}`});
    }
  }catch (err){
    console.log("An error just occured ", err.stack);
    res.render("index.ejs", {error: "error just occured."});
  }
});

app.get

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
}); 