//jshint esversion:6
const express = require('express');
const router = express.Router();
const db = require('../models');
const Photo= db.Photo;

function isAuthenticated (req, res, next){
  console.log('hello');
  if(req.isAuthenticated()){ //method in sequelize library
    next();
  } else {
    console.log('nope');
    res.redirect(303, '/login');
  }
}


router.get('/', (req, res) =>{
  Photo.findAll({order: 'id'})
  .then((photos) => {
    res.render('index', {
      photoList: photos
    });
  })
  .catch(err =>{
    console.log('get error');
  });
});

router.get('/new', (req, res) =>{
  res.render('./gallery/new');
});


router.get('/:id', (req, res) =>{
  let photoId = req.params.id;
  Photo.findById(photoId)
  .then((photo) =>{
  Photo.findAll({order: "id", limit: 3})
  .then((photos) => {
    
    res.render('./gallery/single', {
      photo: photo,
      photos: photos
    });
  });
  })
  .catch(err => {
    console.log('get individual err', err);
  });
}); 



router.post('/', isAuthenticated, function (req, res) {
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



router.get('/:id/edit', (req, res) =>{
  let photoId = req.params.id;
  Photo.findById(photoId)
  .then((photos) => {
    res.render('./gallery/edit', {photoList: photos,
      id: photoId});
})
  .catch(err => {
    console.log('get edit error', err);
  });
});


router.put('/:id/edit', isAuthenticated, (req, res) => {
  let author = req.body.author;
  let description = req.body.description;
  Photo.update(
  { author: author,
    description: description

  },
  {
    where:{
      id: req.params.id
    }
  })
  .then((photo) =>{
    res.redirect('/gallery');
  });
});

router.delete('/:id', isAuthenticated, (req, res) => {
  Photo.destroy(
    {where: {
      id: req.params.id
    }
  })
  .then((photo) => {
    res.redirect('/gallery');
  });
});





module.exports = router;