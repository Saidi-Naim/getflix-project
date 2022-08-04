const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
});

exports.update = (req, res) => {
  const { token, email, password, confirmPassword } = req.body;

  let sql;



    

  if (email && password) {


    db.query(
      "SELECT email FROM user WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);        
        }
        if (result.length > 0) {
          console.log("email already used");
          const str = 'email already used';
          return res.redirect("../../?messageMyProfile=" + str);

        } else if (password != confirmPassword) { 
            console.log("passwords do not match");
            const str = 'passwords do not match';
            return res.redirect("../../?messageMyProfile=" + str);
            
          }

          res.cookie("loggedin", email, {
            maxAge: 9000000000,
            httpOnly: true,
          });
      
          sql = "UPDATE user SET email = ?, password = ? WHERE email = ?";
      
          let hashedPassword = await bcrypt.hash(password, 8);
      
          db.query(sql,
          [email, hashedPassword, token],
          async (err, result) => {
            if (err) {
              console.log(err);
                  }
            console.log("email and password updated");
            const str = 'email and password updated';
            return res.redirect("../../?messageMyProfile=" + str);
          })

        })


  } else if (email) {
    res.cookie("loggedin", email, {
      maxAge: 9000000000,
      httpOnly: true,
    });

    sql = "UPDATE user SET email = ? WHERE email = ?";

    db.query(sql,
      [email, token],
      async (err, result) => {
        if (err) {
          console.log(err);        }
        console.log("email updated");
        const str = 'email updated';
        return res.redirect("../../?messageMyProfile=" + str);
      })

  } else if (password) {

    if (password != confirmPassword) { 
      console.log("passwords do not match");
      const str = 'passwords do not match';
      return res.redirect("../../?messageMyProfile=" + str);
      
    }

    sql = "UPDATE user SET password = ? WHERE email = ?";

    // let hashedPassword = await bcrypt.hash(password, 8);

    db.query(sql,
      [hashedPassword, token],
      async (err, result) => {
        if (err) {
          console.log(err);        }
        console.log("password updated")
        const str = 'password updated';
        return res.redirect("../../?messageMyProfile=" + str);
      })
  }



  // return res.redirect("../");


};








exports.upgrade = (req, res) => {
};

exports.delete = (req, res) => {
};