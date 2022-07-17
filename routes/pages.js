const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { logged: req.cookies.loggedin });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/search", (req, res) => {
  res.render("search");
});
router.get("/searchShow", (req, res) => {
  res.render("searchShow");
});
module.exports = router;
