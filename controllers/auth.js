const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('MYSQL connected...')
  }
})

exports.register = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  db.query(
    "SELECT UserEmail FROM Users WHERE UserEmail = ?",
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
        "INSERT INTO Users SET ?",
        { user_name: email, user_pass: hashedPassword },
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

  db.query(
    "SELECT UserEmail, UserPassword FROM Users WHERE UserEmail = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length === 0) {
        return res.render("login", { message: "password or email incorrect" });
      } else {
        await bcrypt.compare(password, results[0].user_pass).then((bool) => {
          if (email != results[0].user_name || !bool) {
            return res.render("login", {
              message: "password or email incorrect",
            });
          } else {
            res.cookie("loggedin", results[0].user_name, {
              maxAge: 900000,
              httpOnly: true,
            });
            return res.redirect("../");
          }
        });
      }
    }
  );
};

exports.logout = (req, res) => {
  res.clearCookie("loggedin");
  return res.redirect("../");
};
