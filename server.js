const express = require('express');
const app = express();
const port = 3000;
// var cors = require('cors');
const superagent = require('superagent');


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}); 

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
// app.use(cors());
app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.render('./pages/index');

});

app.post('/searches', (req, res) => {
 
  let url =`https://www.googleapis.com/books/v1/volumes?q=${req.body.searchQuery}+${req.body.title ? 'intitle' : 'inauthor'}:`;

  superagent
    .get(url)
    .then((req) => {
      let info = req.body.items[0].volumeInfo;
      let author = info.authors[0];
      let title = info.title;
      let description = info.description;
      let bookArray = [];
      let image = info.imageLinks.thumbnail;
      bookArray.push(new Book (title, author, description, image));
      res.render('./pages/searches/show', {list:bookArray});

    }).catch(err => {
      // err.message, err.response
      console.log(err);
    });

});

//});


function Book (title, author,description, image) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  let regex = /^(http:\/\/)/g;
  let done = image.replace(regex,'https://');
  this.author = author;
  this.title = title || 'no title available';
  this.description = description || 'no discription available';
  this.image = image?image.replace(regex,'https://') : placeholderImage ;
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
