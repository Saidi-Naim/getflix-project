const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const crypt = require("crypto");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
});

router.get("/", (req, res) => {
  res.render("index", { logged: req.cookies.loggedin, premium: req.cookies.premium });
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

router.get("/forgot", (req, res, next) => {
  res.render("forgot");
});

const JWT_TOKEN = crypt.randomBytes(32).toString("hex");

router.post("/forgot", (req, res, next) => {
  const { email } = req.body;
  if (email == ""){
    return res.render("forgot", { message: "Empty field please check" });
  }
  // make sure user exists in database
  db.query(
    "SELECT id, email, password FROM user WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length === 0) {
        return res.render("forgot", { message: "That email does not exist" });
      }

      // User exists and now create a One time link valid for 15 minutes
      const secret = JWT_TOKEN + results[0].password;
      const payload = {
        email: results[0].email,
        id: results[0].id,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      const link = `https://nodeflix-staging.herokuapp.com/reset/${results[0].id}/${token}`;


      //     // send email with nodemailer
      const CLIENT_ID = process.env.CLIENT_ID;
      const CLIENT_SECRET = process.env.CLIENT_SECRET;
      const REDIRECT_URL = process.env.REDIRECT_URL;
      const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URL
      );
      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

      async function sendMail() {
        try {
          const accessToken = await oAuth2Client.getAccessToken();
          const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: "nodeflix.pw.recovery@gmail.com",
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken,
            },
          });

          const mailOptions = {
            from: "nodeflix - noreply <nodeflix.pw.recovery@gmail.com>",
            to: email,
            subject: "reset password",
            text: "",
            html: `<h4>Click this <a href='${link}'>link</a> to reset the password.</h4>`,
          };

          const result = await transport.sendMail(mailOptions);
          return result;
        } catch (error) {
          return error;
        }
      }

      sendMail()
        .then((res) => console.log("Email sent...", res))
        .catch((err) => console.log(err.message));

      return res.render("forgot", {
        message: "mail sent to reset password, please check your email",
      });
    }
  );
});

router.get("/reset/:id/:token", (req, res, next) => {
  const { id, token } = req.params;

  // if id exists in Database
  db.query(
    "SELECT * FROM user WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length === 0) {
        const html = `<h1>Id not found !</h1>`;
        res.send(html);
        return;
      }

      // id exists in Database
      const secret = JWT_TOKEN + results[0].password;

      try {
        // if jwt.verify generates error => the compilator goes directly to catch error else it continues
        const playload = jwt.verify(token, secret);
        return res.render("reset");
      } catch (error) {
        console.log(error.message);
        return res.send(error.message);
      }
    }
  );
});

router.post("/reset/:id/:token", (req, res, next) => {
  const { id, token } = req.params;
  // if id exists in Database
  db.query(
    "SELECT * FROM user WHERE id = ?",
    [id],
    async (err, results) => {
      if (err) {
        console.log(err);
      }
      
      if (results.length === 0) {
        const html = `<h1>Id not found !</h1>`;
        res.send(html);
        return;
      }

      // id exists in Database
      const secret = JWT_TOKEN + results[0].password;

      try {
        // if jwt.verify generates error => the compilator goes directly to catch error else it continues
        const playload = jwt.verify(token, secret);
        const { password, passwordConfirm } = req.body;
        if (password !== passwordConfirm) {
          return res.render("reset", { message: "password not match" });
        }
        let sql = `UPDATE user
        SET password = ?
        WHERE id = ?`;

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query(sql, [hashedPassword, id], (error2, results2)=>{
          if (error2) {
            console.log(error2);
          }

          if (results.length === 0) {
            return res.render("reset", { message: "Update failed, try again" });
          }

          return res.render("reset", { message: "Update successfully" });

        })

      } catch (error) {
        console.log(error.message);
        return res.send(error.message);
      }
    }
  );
});



module.exports = router;
