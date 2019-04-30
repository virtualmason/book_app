const express = require('express');
const app = express();
const port = 3000;
var cors = require('cors');

const superagent = require('superagent');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.static('./public'));
app.get('/', (req, res) => {
  //let url =`https://www.googleapis.com/books/v1/volumes?q=inauthor:steven+spielberg`;
  //let url =`https://www.googleapis.com/books/v1/volumes?q=intitle:it`;


  res.render('./pages/index');


});

app.post('/searches', (req, res) => {

  console.log(req.body);
  let url =`https://www.googleapis.com/books/v1/volumes?q=${req.body.title ? 'intitle' : 'inauthor'}:${req.body.searchQuery}`;
  superagent
    .get(url)
    .then((req,res) => {
      let info = req.body.items[0].volumeInfo;
      // console.log('line 30', req.body.items[0].volumeInfo.title);
      // console.log('line 31', req.body.items[0].volumeInfo.authors[0]);
      let author = info.authors[0];
      let title = info.title;
      console.log('line 32 : ',info);
      let books = new Book (title, author);
      
    })
    .catch(err => {
      // err.message, err.response
      console.log(err);
    });
  res.send('hi there');
});


let booksArray =[];
function Book (title, author) {
  //const placeholder = 'https//i..image/jpg'
  this.author = author;
  this.title = title || 'no title available';
  booksArray.push(this);
  console.log('should be book arry line50 ',booksArray );

}
// console.log(booksArray);


//Not working
//let book = new Book({author:, title: });
// (function() {
//   //https://www.googleapis.com/apiName/apiVersion/resourcePath?parameters
//   superagent
//     .post('/searches')
//     .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
//     .set('X-API-Key', 'foobar')
//     .set('accept', 'json')
//     .end((err, res) => {
//       // Calling the end function will send the request
//     });
// })();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
