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


//step to make endpint calaled save
// the save button should send it to SQL

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
  res.render('./pages/searches/new');

});

app.post('/save', (req, res) => {
  console.log('line 47' , req.body);

  savebook(req.body, res);
  // .then(result => res.redirect(`/book/${result.rows[0].id}`));
});

function savebook (book,res) {
  // const SQL = 'INSERT INTO books (title, author, image_url, description, isbn, bookshelf) VALUES($1,$2,$3,$4,$5,$6) RETURNING id';
  // id SERIAL PRIMARY KEY,
  // author VARCHAR(255),
  // title  VARCHAR(255),
  // isbn   NUMERIC(30, 7),
  // image_url VARCHAR(255),
  // description VARCHAR(255),
  // bookshelf VARCHAR(255)
  // );
  let SQL = `INSERT INTO books ( author, title, isbn, image_url, description) VALUES($1,$2,$3,$4,$5) RETURNING id`;
  let values = [book.authors, book.title, book.isbn, book.image, book.description];

  client.query(SQL, values).then( ( error, data)=> {
    let SQL = `SELECT * FROM books;`;
    client.query(SQL, data).then((data, error)=>{
      if (error) {
        throw error;
      }
      console.log('line 72 ' ,data);
      res.render(`./pages/index`, {info:data.rows, totalBooks:'1 million records'});

    });


  });



}

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
        let isbn = info.volumeInfo.industryIdentifiers[0].type+' '+info.volumeInfo.industryIdentifiers[0].identifier;
        // doesit need to be string above?
        return new Book (title, author, description, image, isbn);
      });
      res.render('./pages/searches/show', {list:bookArray});

    }).catch(err => {
      // err.message, err.response
      console.log(err);
    });

});

function Book (title, author,description, image,isbn) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  let regex = /^(http:\/\/)/g;
  //let done = image_url.replace(regex,'https://');
  this.author = author;
  this.title = title || 'No title available';
  this.description = description || 'no description available';
  this.image = image?image.replace(regex,'https://') : placeholderImage ;
  this.isbn = isbn || 'ISBN_10 0435232932';
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
