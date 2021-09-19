const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World! welcome to Dashboard')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkox9.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const dataCollection = client.db("Dashdata").collection("data"); 

  console.log('database connected successfully')
});

app.listen(port, () => {
  console.log(`Dashboard server listening on http://localhost:${port}`)
})