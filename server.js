const express = require('express');
const app = express();
const port = 3000;
const superagent = require('superagent');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.get('/', (req, res) => {
  let url =`https://www.googleapis.com/books/v1/volumes?q={helloflowers}`;
  //let url =`https://www.googleapis.com/books/v1/volumes?q=inauthor:steven`;

  superagent
    .get(url)
    .then((req,res) => {
      // res.body, res.headers, res.status
      console.log('line 15', req.body);
      res.render('./pages/index');

    })
    .catch(err => {
      // err.message, err.response
    });
});
let Objects =[];
function Book(info) {
  console.log(info);
  //const placeholder = 'https//i..image/jpg'
  this.author = info.authors[0];
  this.title = info.title|| 'no title available';
  Objects.push(this);
  //this.image = info.image-url
}

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
