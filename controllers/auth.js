const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");



exports.register = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (email == "" || password == "" || confirmPassword == ""){
    return res.render("register", { message: "Empty fields please check" });
  }

  db.query(
    "SELECT email FROM user WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.log(err);
      }

      if (result.length > 0) {
        return res.render("register", {
          message: "That email is already used",
        });
      } else if (password != confirmPassword) {
        return res.render("register", { message: "Passwords do not match" });
      }

      let hashedPassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO user SET ?",
        { email: email, password: hashedPassword },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            return res.render("register", {
              message: "account subscribed successfully",
            });
          }
        }
      );
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (email == "" || password == ""){
    return res.render("login", { message: "password or email is empty" });
  }
  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length === 0) {
        return res.render("login", { message: "password or email incorrect" });
      } else {
        await bcrypt.compare(password, results[0].password).then((bool) => {
          if (email != results[0].email || !bool) {
            return res.render("login", {
              message: "password or email incorrect",
            });
          } else {
            res.cookie("loggedin", results[0].email, {
              maxAge: 9000000000,
              httpOnly: true,
            });
                if(results[0].premium == 1){
                  res.cookie("premium", " ", {
                    maxAge: 9000000000,
                    httpOnly: true,
                  });
                }
            return res.redirect("../");
          }
        });
      }
    }
  );
};

exports.logout = (req, res) => {
  res.clearCookie("loggedin");
  res.clearCookie("premium");
  return res.redirect("/login");
};
