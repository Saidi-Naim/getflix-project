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
  res.render("index", { logged: req.cookies.loggedin });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/forgot", (req, res, next) => {
  res.render("forgot");
});

const JWT_TOKEN = crypt.randomBytes(32).toString("hex");

router.post("/forgot", (req, res, next) => {
  const { email } = req.body;
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
      const link = `http://localhost:5000/reset/${results[0].id}/${token}`;

      //     // send email with nodemailer
      const CLIENT_ID =
        "1072205732103-vu1pti3bdfjn26qoqs6aj100hbhdqdpr.apps.googleusercontent.com";
      const CLIENT_SECRET = "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";
      const REDIRECT_URL = "https://developers.google.com/oauthplayground";
      const REFRESH_TOKEN =
        "1//04drzmDelQpObCgYIARAAGAQSNwF-L9IrVjnvY64ibUHulk3BWm27d_NAXqxS-la_vXUByQ8D_lUjd4TcqC52zW4v4mSBmXcqqnU";

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
              user: "mexicanobootstrap2@gmail.com",
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken,
            },
          });

          const mailOptions = {
            from: "noreply <mexicanobootstrap2@gmail.com>",
            to: "elmiri.younes@hotmail.com",
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
