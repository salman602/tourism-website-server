const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v2tgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
  try{
    await client.connect();
    const database = client.db("travel_cove_db");
    const packageCollection = database.collection("packages");
    const bookingCollection = database.collection("bookings");

    app.get('/packages', async (req, res) =>{
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      // console.log(packages);
      res.send(packages);
    });

    // Get bookings data from database
    app.get('/bookings', async (req, res) =>{
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings);
    })

    app.get('/packages/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await packageCollection.findOne(query);
      res.json(service);
      console.log(service);
    })

    // Add a new package
    app.post('/packages', async(req, res)=>{
      const package = req.body;
      console.log('hit the post Api', package)
      const result = await packageCollection.insertOne(package);
      console.log(result)
      res.json(result)
    })

    // Bookings API
    app.post('/bookings', async (req, res)=>{
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      
      res.json(result)
    });

    // DELETE a Booking
    app.delete('/bookings/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await bookingCollection.deleteOne(query);
      console.log('deleting booking with id',id);
      res.json(result)
    })
    
  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Gello World!')
});

app.listen(port, () => {
  console.log(`Running on the port: ${port}`)
});