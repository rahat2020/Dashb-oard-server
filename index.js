const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World! welcome to Dashboard')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjnr3.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://rahat125:<password>@cluster0.bjnr3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
client.connect(err => {
  const userCollection = client.db("Dashdata").collection("data"); 
  const groupCollection = client.db("Dashdata").collection("group"); 

  // upload user to the database
  app.post('/addUser', (req, res) => {
    const user = req.body;
    console.log(user)
    userCollection.insertOne(user)
    .then(result => {
      console.log(result.insertedCount > 0)
      res.send(result.insertedCount > 0)
    })
  })

  // showing user data to the UI
  app.get('/showUser', (req, res) => {
    userCollection.find({id: req.params._id})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  // delete user from userCollection
  app.delete('/deleteUser/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    userCollection.findOneAndDelete({_id: id})
    .then((err, result) => {
      console.log(result)
      result.deletedCount > 0
    })
  })

  // adding groups to group collection
  app.post('/addGroup', (req, res) => {
    const group = req.body;
    console.log(group)
    groupCollection.insertOne(group)
    .then(result => {
      console.log(result.insertedCount > 0)
      res.send(result.insertedCount > 0)
    })
  })
 // showing group data to the UI
 app.get('/showGroup', (req, res) => {
  groupCollection.find({id: req.params._id})
  .toArray((err, documents) => {
    res.send(documents)
  })
})
 // delete group from groupCollection
 app.delete('/deleteGroup/:id', (req, res) => {
  const id = ObjectID(req.params.id);
  groupCollection.findOneAndDelete({_id: id})
  .then((err, result) => {
    console.log(result)
    result.deletedCount > 0
  })
})
  console.log('database connected successfully')
});

app.listen(port, () => {
  console.log(`Dashboard server listening on http://localhost:${port}`)
})