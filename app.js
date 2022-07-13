const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql");

dotenv.config({ path: "./.env" });

const app = express();

const port = process.env.PORT || 5000;

// Connect with db
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
})

db.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('MYSQL connected...')
  }
})

// to use frontend: files css, assets etc with nodejs server
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// parse json bodies (as sent by api clients)
app.use(express.json());

app.set('view engine', 'hbs')

 // Define routes
 app.use('/',require('./routes/pages'))

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});