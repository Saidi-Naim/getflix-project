const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require('cookie-parser');

dotenv.config({ path: "./.env" });

const app = express();
app.use(cookieParser());

const port = process.env.PORT || 5000;

// to use frontend: files css, assets etc with nodejs server
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// parse json bodies (as sent by api clients)
app.use(express.json());

app.set("view engine", "hbs");

// Define routes
app.use("/", require("./routes/pages"));
app.use('/auth',require('./routes/auth'));
app.use('/myprofile',require('./routes/myprofile'));

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
