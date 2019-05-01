const express = require('express');
const app = express();
const port = process.env.PORT|| 3000;
 require('dotenv').config();
// var cors = require('cors');
const superagent = require('superagent');
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);
client.connect();
client.on('err', err => console.log(err));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



// Location.lookupLocation = (handler) => {
//   const SQL = `SELECT * FROM locations WHERE search_query=$1`;
//   const values = [handler.query];

//   return client.query(SQL, values)
//     .then(results => {
//       if (results.rowCount > 0) {
//         handler.cacheHit(results);
//       }
//       else {
//         handler.cacheMiss();
//       }
//     })
//     .catch(console.error);
// };

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
      let info = req.body.items;
      let bookArray= info.map(info=>{
        let title = info.volumeInfo.title;
        let author = info.volumeInfo.authors;
        let description = info.volumeInfo.description;
        let image = info.volumeInfo.imageLinks.thumbnail;
        let isbn = info.volumeInfo.industryIdentifiers[0].type+" "+info.volumeInfo.industryIdentifiers[0].identifier;
        // doesit need to be string above?

        console.log('line 75 :', isbn );
        return new Book (title, author, description, image,isbn);
      });


      res.render('./pages/searches/show', {list:bookArray});

    }).catch(err => {
      // err.message, err.response
      console.log(err);
    });

});

//});


function Book (title, author,description, image,isbn) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  let regex = /^(http:\/\/)/g;
  let done = image.replace(regex,'https://');
  this.author = author;
  this.title = title || 'no title available';
  this.description = description || 'no discription available';
  this.image = image?image.replace(regex,'https://') : placeholderImage ;
  this.isbn = isbn || 'ISBN_10 0435232932';
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
