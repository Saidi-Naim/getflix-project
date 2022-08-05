const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
});

exports.update = async (req, res) => {
  const { token, email, password, confirmPassword, subscription} = req.body;

  let sql;

  if (email && password && subscription == undefined) {

    db.query(
      "SELECT email FROM user WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);        
        }
        if (result.length > 0) {
          const str = 'email already used';
          return res.redirect("../../?messageMyProfile=" + str);

        } else if (password != confirmPassword) { 
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
            const str = 'email and password updated';
            return res.redirect("../../?messageMyProfile=" + str);
          })
        })
  } else if (email && password && subscription != undefined) {

    db.query(
      "SELECT email FROM user WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);        
        }
        if (result.length > 0) {
          const str = 'email already used';
          return res.redirect("../../?messageMyProfile=" + str);

        } else if (password != confirmPassword) { 
            const str = 'passwords do not match';
            return res.redirect("../../?messageMyProfile=" + str);
          }

          res.cookie("loggedin", email, {
            maxAge: 9000000000,
            httpOnly: true,
          });
      
          sql = "UPDATE user SET email = ?, password = ?, subscription = ? WHERE email = ?";
      
          let hashedPassword = await bcrypt.hash(password, 8);
      
          db.query(sql,
          [email, hashedPassword, subscription, token],
          async (err, result) => {
            if (err) {
              console.log(err);
                  }
            const str = 'email, password and subscription updated';
            return res.redirect("../../?messageMyProfile=" + str);
          })
        })
  } else if (email && subscription == undefined) {
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
        const str = 'email updated';
        return res.redirect("../../?messageMyProfile=" + str);
      })

  } else if (email && subscription != undefined) {
    
    res.cookie("loggedin", email, {
      maxAge: 9000000000,
      httpOnly: true,
    });

    sql = "UPDATE user SET email = ?, subscription = ? WHERE email = ?";

    db.query(sql,
      [email, subscription, token],
      async (err, result) => {
        if (err) {
          console.log(err);        }
        const str = 'email and subscription updated';
        return res.redirect("../../?messageMyProfile=" + str);
      })

  } else if (password && subscription == undefined) {

    if (password != confirmPassword) { 
      const str = 'passwords do not match';
      return res.redirect("../../?messageMyProfile=" + str);
      
    }

    sql = "UPDATE user SET password = ? WHERE email = ?";

    let hashedPassword = await bcrypt.hash(password, 8);

    db.query(sql,
      [hashedPassword, token],
      async (err, result) => {
        if (err) {
          console.log(err);        
        }
        const str = 'password updated';
        return res.redirect("../../?messageMyProfile=" + str);
      })
      
  } else if (password && subscription != undefined) {

    if (password != confirmPassword) { 
      const str = 'passwords do not match';
      return res.redirect("../../?messageMyProfile=" + str);
      
    }

    sql = "UPDATE user SET password = ?, subscription = ? WHERE email = ?";

    let hashedPassword = await bcrypt.hash(password, 8);

    db.query(sql,
      [hashedPassword, subscription, token],
      async (err, result) => {
        if (err) {
          console.log(err);        
        }
        const str = 'password updated';
        return res.redirect("../../?messageMyProfile=" + str);
      })

  } else if (subscription != undefined) {

    sql = "UPDATE user SET subscription = ? WHERE email = ?";
    console.log(sql)

    db.query(sql,
      [subscription, token],
      async (err, result) => {
        if (err) {
          console.log(err);
        }
        const str = 'subscription updated';
        return res.redirect("../../?messageMyProfile=" + str);
      })
  }

};

exports.delete = (req, res) => {
  alert("test")
};