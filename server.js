require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const axios = require('axios');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const {Anime, Manga, Episode} = require('./models');
const SECRET_SESSION = process.env.SECRET_SESSION;
console.log(SECRET_SESSION);

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// Anime.create({
//   title: "One Punch Man",
//   synopsis: "asldhf",
//   airDate: 1,
//   episodes: 10
// })
// .then(function(newAnime){
//   console.log('NEW ANIME CREATED');
//   console.log(newAnime.toJSON());
// })
// .catch(function(err){
//   console.log('ERROR', err);
// })

app.get('/', (req, res) => {
  res.render('index');
})

// Add this above /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});


app.get('/anime', (req, res) => {
  for (let i = 0; i < anime.length; i++) {
    
    
  }
  axios.get('')
  .then(function(response){
    res.render('anime/index', { anime: animeOne })
  })
  .catch(function(err){
    console.log('ERROR', err);
   })
});

// controllers
app.use('/auth', require('./controllers/auth'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;

function makeGetRequest(path) {
  axios.get(path)
  .then(function(response) {
          console.log(response.data);
      })
      .catch(function(err){
          console.log("ERROR!", err);
      })
  };

makeGetRequest('https://api.jikan.moe/v3/anime/1/');
