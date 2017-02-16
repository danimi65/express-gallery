//jshint esversion: 6
const express = require('express');
const app = express();
const db = require('./models');
const {User, Photo} = db;
const bp = require('body-parser');
const handlebars = require('express-handlebars');
const gallery = require('./routes/gallery');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(bp.urlencoded({extended: true}));
app.use(express.static('public'));

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/', (req, res) =>{
  res.render('index');
});

app.use('/gallery', gallery);


app.listen(3000, function() {
  console.log('listening on port 3000');
  db.sequelize.sync();
});

module.exports = app;