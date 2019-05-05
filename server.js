const express = require('express');
const app = express();
const port = process.env.PORT|| 3000;
require('dotenv').config();
const superagent = require('superagent');
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);
client.connect();
client.on('err', err => console.log(err));


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.render('./pages/searches/new');

});

// index.ejs what parm is sent and why? get id and look in database and send it to detail?
app.get('/details/:id', (req, res) => {
  let SQL = `SELECT * FROM books WHERE id=$1;`;
  let value = [req.params.id];
  client.query(SQL, value).then((data, error)=>{
    console.log('from server L-26', data.rows);
    res.render(`./pages/books/detail`,{data:data.rows} );
  });
});

app.post('/save', (req, res) => {
  savebook(req.body, res);
});

function savebook (book,res) {
  let SQL = `INSERT INTO books ( author, title, isbn, image_url, description) VALUES($1,$2,$3,$4,$5) RETURNING id`;
  let values = [book.authors, book.title, book.isbn, book.image, book.description];

  client.query(SQL, values).then( ( error, data)=> {
    let SQL = `SELECT * FROM books;`;
    client.query(SQL).then((info, error)=>{
      if (error) {
        throw error;
      }
      res.render(`./pages/index`, {info:info.rows});

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
        return new Book (title, author, description, image, isbn);
      });
      res.render('./pages/searches/show', {list:bookArray});

    }).catch(err => {
      console.log(err);
    });

});

function Book (title, author,description, image,isbn) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  let regex = /^(http:\/\/)/g;
  this.author = author;
  this.title = title || 'No title available';
  this.description = description || 'no description available';
  this.image = image?image.replace(regex,'https://') : placeholderImage ;
  this.isbn = isbn || 'ISBN_10 0435232932';
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
