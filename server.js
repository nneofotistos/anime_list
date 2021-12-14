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
let animeArray = [];


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
  // axios.get('https://api.jikan.moe/v3/top/anime/1')
  // .then(function(response) {
  //   console.log('TOP ANIME', response.data.top);
  //   res.render('home/index', { topAnime: response.data.top });
  // })
  res.render('home/index')
})

// Add this above /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});

app.get('/anime', (req, res) => {
  axios.get('https://api.jikan.moe/v3/top/anime')
  .then(function(response) {
    console.log('TOP ANIME', response.data.top);
    res.render('anime/index', { topAnime: response.data.top });
  })
});

app.get('/manga', (req, res) => {
  axios.get('https://api.jikan.moe/v3/top/manga')
  .then(function(response) {
    console.log('TOP MANGA', response.data.top);
    res.render('manga/index', { topManga: response.data.top });
  })
});




app.get('/anime/:id', function(req,res){
  //req.params.id = animeArray[1];
  let id = Number(req.params.id);
  let animeLink = ('https://api.jikan.moe/v3/anime/'+id+'/videos')
  axios.get(animeLink)
  .then(function(response) {
       //res.render('animePage/index', {fullmetal: response.data.episodes})
       //console.log(response.data.episodes);
       axios.get('https://api.jikan.moe/v3/anime/'+id+'/')
       .then(function(resTwo){
         //console.log('DATA RIGHT HEREEEEEEEEEEEEE', resTwo.data);
        res.render('animePage/index', {fullmetal: response.data.episodes, fullmetalInfo: resTwo.data})
       })
      })
      .catch(function(err){
          console.log("ERROR!", err);

    })
  })

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
//makeGetRequest('https://api.jikan.moe/v3/anime/1/videos');
// makeGetRequest('https://api.jikan.moe/v3/top/anime')
function getIdArray(){
  axios.get('https://api.jikan.moe/v3/top/anime')
    .then(function(response) {
      let objectArray = response.data.top;
      //let animeIndex = response.data.top.mal_id;
      //console.log('HERYYyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', response.data.top[1].mal_id);
      for(let i = 0; i < 50 ; i++){
        
          animeArray.push(Number(objectArray[i].mal_id));
          console.log(animeArray);
            }

          })
        .catch(function(err){
            console.log("ERROR!", err);
        })
      }

      getIdArray();
      console.log(animeArray);
  