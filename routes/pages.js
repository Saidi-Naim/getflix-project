const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // res.render("index", { logged: req.cookies.loggedin });
  res.render("index", { logged: 'hello' });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = router;
