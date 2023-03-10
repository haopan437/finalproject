var express = require("express");
var router = express.Router();
var model = require("../model");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/regist", function (req, res, next) {
  //validate the input
  const { isValid, errors } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
  }
  var data = {
    username: req.body.username,
    password: req.body.password,
    password2: req.body.password2,
    email: req.body.email,
    role: req.body.role
  };

  //insert the new user
  model.connect(function (db) {
    db.collection("users").insertOne(data, function (err, ret) {
      if (err) {
        console.log("Register failed.");
        res.redirect("/regist");
      } else {
        res.redirect("/login");
      }
    });
  });
});

//login
router.post("/login", function (req, res, next) {
  //validate the input
  const { isValid, errors } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(404).json(errors);
  }
  var data = {
    username: req.body.username,
    password: req.body.password,
  };

  //query user from db
  model.connect(function (db) {
    db.collection("users")
      .find(data)
      .toArray(function (err, docs) {
        if (err) {
          res.redirect("/login");
        } else {
          if (docs.length > 0) {
            req.session.username = data.username;
            res.redirect("/");
          } else {
            res.redirect("/login");
          }
        }
      });
  });
});

//logout and redirect to the login page
router.get("/logout", function (req, res, next) {
  req.session.username = null;
  res.redirect("/login");
});



module.exports = router;
