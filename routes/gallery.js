//jshint esversion:6
const express = require('express');
const router = express.Router();
const db = require('../models');
const {User, Photo} = db;


router.get('/', (req, res) =>{
  Photo.findAll()
  .then((photos) => {
    res.render('index', {
      photoList: photos
    });
  })
  .catch(err =>{
    console.log('get error');
  });
});

router.get('/gallery/:id', (req, res) =>{
  let photoId = req.params.id;
  Photo.findById(photoId)
  .then(photos =>{
    res.render('single.hbs', {photoList: photos});
  })
  .catch(err => {
    console.log('get individual err', err);
  });
});

router.post('/', function (req, res) {
  console.log('hellow');
  Photo.create({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
})
.then((photos) =>{
  res.redirect(303, '/gallery');
})
.catch(err => {
  console.log('post error', err);
});
});

module.exports = router;