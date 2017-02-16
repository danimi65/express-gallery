//jshint esversion:6
const express = require('express');
const router = express.Router();
const db = require('../models');
const {User, Photo} = db;


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
  .then((photos) =>{
    res.render('./gallery/single', {photoList: photos});
  })
  .catch(err => {
    console.log('get individual err', err);
  });
}); 


router.post('/', function (req, res) {
  console.log('wkefaoeigj');
  Photo.create({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
})
.then((photos) =>{
  res.redirect(303, '/');
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


router.put('/:id/edit', (req, res) => {
  console.log(req.body);
  let author = req.body.author;
  let link = req.body.link;
  let description = req.body.description;
  console.log('wekjaowrt', author, link, description);
  let photoId = req.params.id;
  Photo.findById(photoId)
  .then((photos) => {
    console.log('before update', photos);
    var update = Photo.update(
                    { author: author,
                      link: link,
                      description: description

                    },
                     { where: {
                      id: req.params.id
                      }
                    });
    return update;
  })
  // Photo.update(
  // { author: author,
  //   link: link,
  //   description: description

  // },
  //  { where: {
  //   id: req.params.id
  //   }
  // })
  .then( (photo) => {
    // res.redirect('/gallery');
    return Photo.findById(photoId);

  })
  .then((photos) =>{
    console.log('after update', photos);
    res.redirect('/gallery');
  });
});


router.delete('/:id', (req, res) => {
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