const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//tourismMaster
//D52aK9wiIV2A0SAn







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjovpu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const tourismInfoDB = client.db('tourismInfoDB');
    const tourismSpotCollection = tourismInfoDB.collection('spot');



    app.post('/spots',async(req,res)=>{
        const newSpot = req.body;
        const result = await tourismSpotCollection.insertOne(newSpot);
        res.send(result);
        
    });

    app.get('/spots', async(req,res)=>{
      const cursor = tourismSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/spots/:id',async (req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await tourismSpotCollection.findOne(query);
      res.send(result);
      console.log(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

     
app.get('/', async(req,res)=> {
    res.send('Discover Euro Server is running')
});

app.listen(port,()=>{
    console.log(`DiscoverEuro Server is running at PORT ${port}`);
})


