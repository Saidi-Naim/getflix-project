const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
});

exports.login = (req, res) => {
    const { email, pass } = req.body;

    db.query(
        "SELECT email, password FROM user WHERE email = ?",
        [email],
        async (err, results) => {
          if (err) {
            console.log(err);
          }
    
          if (results.length === 0) {
            return res.send({logged: false});
          } else {
            return res.send({logged: true});
            // await bcrypt.compare(password, results[0].password).then((bool) => {
            //   if (email != results[0].email || !bool) {
            //     return res.render("login", {
            //       message: "password or email incorrect",
            //     });
            //   } else {
            //     res.cookie("loggedin", results[0].email, {
            //       maxAge: 9000000000,
            //       httpOnly: true,
            //     });
            //     return res.redirect("../");
            //   }
            // });
          }
        }
      );
  };

