//jshint esversion: 6
const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;

router.get('/', (req, res) =>{
  res.render('./createUser');
});

router.post('/', (req, res) =>{
  User.create({
    username: req.body.username,
    password: req.body.password
  })
  .then((user) =>{
    res.redirect(303, '/login');
  });
});

module.exports = router;


