const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");


exports.checkPremium = (req, res) => {
    const user_id = req.cookies.loggedin;
    console.log("ok")
    db.query(
    "SELECT premium FROM user WHERE email= ?", [user_id],
    (err, results)=> {
    console.log(results)
      res.send(results[0])
    }
    )
}