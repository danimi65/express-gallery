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

app.use(methodOverride('_method'));
app.use(bp.urlencoded({extended: true}));
app.use(express.static('public'));
// app.use(session({
//   secret: CONFIG.SESSION_SECRET
// }));

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

// const authenticate = (username, password) => {
//   // get user data from the DB
//   // const USER = CONFIG.USER;
//   const { USER } = CONFIG;
//   const { PASSWORD, USERNAME } = USER;

//   // check if the user is authenticated or not
//   return ( username === USERNAME && password === PASSWORD );
// };

passport.use(new localStrategy (
  function(username, password, done) {
    User.findOne({
      where: {
        username: username,
        password: password
      }
    })
    .then((user) =>{
      return done(null, user);
    })
    .catch((err) =>{
      return done(err);

    });
  }));

// passport.use(new localStrategy(
//   function (username, password, done) {
//     console.log('username, password: ', username, password);
//     // check if the user is authenticated or not
//     if( authenticate(username, password) ) {

//       // User data from the DB
//       const user = {
//         name: 'Joe',
//         role: 'admin',
//         favColor: 'green',
//         isAdmin: true,
//       };

//       return done(null, user); // no error, and data = user
//     }
//     return done(null, false); // error and authenticted = false
//   }
// ));

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

app.get('/login', (req, res) => {
  res.render('./login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}));

app.get('/secret', isAuthenticated, (req, res) => {
  res.send('this is my secret page');
});

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    console.log('nope');
    res.redirect(303, '/login');
  }
}

app.use('/secret', isAuthenticated, secret);

app.get('/', (req, res) =>{
  res.render('index');
});

app.use('/gallery', gallery);
app.use('/create', createUser);


app.listen(3000, function() {
  console.log('listening on port 3000');
  db.sequelize.sync();
});

module.exports = app;