const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World !')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghclx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('error', err);
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");
    
      app.post('/addProduct', (req, res) => {
          const products = req.body;
          productsCollection.insertOne(products)
          .then(result => {
              console.log(result.insertedCount);
              res.send(result.insertedCount)
          })
      })
  
      app.get('/products', (req, res) => {
          const search = req.query.search;
          productsCollection.find({name: {$regex: search}})
          .toArray( (err, documents) => {
              res.send(documents);
          })
      })
  
      app.get('/product/:key', (req, res) => {
          productsCollection.find({key: req.params.key})
          .toArray( (err, documents) => {
              res.send(documents[0]);
          })
      })
  
      app.post('/productsByKeys', (req, res) => {
          const productKeys = req.body;
          productsCollection.find({key: { $in: productKeys} })
          .toArray( (err, documents) => {
              res.send(documents);
          })
      })
  
      app.post('/addOrder', (req, res) => {
          const order = req.body;
          ordersCollection.insertOne(order)
          .then(result => {
              res.send(result.insertedCount > 0)
          })
      })

})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})