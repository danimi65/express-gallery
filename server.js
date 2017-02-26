//jshint esversion: 6
const express = require('express');
const app = express();
const db = require('./models');
const Photo = db.Photo;
const User = db.User;
const bp = require('body-parser');
const handlebars = require('express-handlebars');
const gallery = require('./routes/gallery');
const createUser = require('./routes/user');
const methodOverride = require('method-override');
const CONFIG =require('./config/config.json');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const mixin = require('mixin');
const secret = require('./views/secret');
const bcrypt = require('bcrypt');

const saltRounds = 10;

app.use(methodOverride('_method'));
app.use(bp.urlencoded({extended: true}));
app.use(express.static('public'));


app.use(session({
  store: new RedisStore(),
  secret:'keyboard cat',
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());


const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


function checkPassword(plainTextPassword, passwordInDB){
  return bcrypt.compare(plainTextPassword, passwordInDB, function(err, res){
    return res;
  });

}

passport.use(new localStrategy (
  function(username, password, done) {
    User.findOne({
      where: {
        username: username
      }
    })
    .then((user) =>{
      if(user === null){
        console.log('user failed');
        return done(null, false, {message: 'bad username'});
      }else{
        bcrypt.compare(password, user.password).then(res => {
          if(res){
            return done(null, user);
          }else{
            return done(null, false, {message: 'bad passowrd'});

          }
        });
      }
    })
    .catch((err) =>{
      return done('error', err);
      });
    }

  ));


passport.serializeUser(function(user, done) {
  console.log('serializing user');
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserializeUser');
  return done(null, user);
});


app.get('/login', (req, res) => {
  res.render('./login');
});


app.post('/login', passport.authenticate('local', {
  successRedirect: '/gallery',
  failureRedirect: '/login'
}));

app.post('/create', (req, res) =>{
  console.log('req.body.username', req.body.username);
  console.log('req.body.password', req.body.password);
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      console.log('hash', hash);
      User.create({
        username: req.body.username,
        password: hash
      })
      .then(_=>{
        res.redirect('/login');
      });
     
    });

  });
});

app.get('/logout', (req, res) =>{
  req.logout();
  res.redirect('/login');
});

app.get('/', (req, res) =>{
  res.render('index');
});

app.use('/gallery', gallery);
app.use('/create', createUser);


app.use(function(req, res){
  res.send('404: Page not found', 404);
});

app.listen(3000, function() {
  console.log('listening on port 3000');
  db.sequelize.sync();
});

module.exports = app;