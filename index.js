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
    // await client.connect();
    const tourismInfoDB = client.db('tourismInfoDB');
    const tourismSpotCollection = tourismInfoDB.collection('spot');
    const countryCollection = tourismInfoDB.collection('country');



    app.post('/spots',async(req,res)=>{
        const newSpot = req.body;
        const result = await tourismSpotCollection.insertOne(newSpot);
        res.send(result);
        
    });

    app.get('/spots', async(req,res)=>{
      const query = req.query;
      if(Object.keys(query).length > 0  ) {
        const cursor = tourismSpotCollection.find().sort({ averageCost: 1 });
        const result = await cursor.toArray();
        res.send(result);
        // console.log(result);
        
      } else{
      const cursor = tourismSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    
      }
    });



    app.get('/spots/email', async(req,res)=>{
      const cursor = tourismSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/spots/country', async(req,res)=>{
      const cursor = tourismSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/spots/country/:country',async(req,res)=>{
      const country = req.params.country;
      const query = {countryName: country};
      const cursor = tourismSpotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
      // console.log(result);
    })

    
    // Fetch data for specific user 
    app.get('/spots/email/:email', async(req,res) =>{
      const email = req.params.email;
      const query = {userEmail: email};
      const cursor =  tourismSpotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
      // console.log(cursor);

    } );

    // Delete a document
    app.delete('/spots/:id',async (req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await tourismSpotCollection.deleteOne(query);
      res.send(result);
    });

    //Update a document
    app.put('/spots/:id',async (req,res)=>{
      const id = req.params.id;
      const spot = req.body;
      const options = {upsert: true}
      const filter = {_id: new ObjectId(id)};
      const updatedSpot = {
        $set: {
          image: spot.image,
          spotName: spot.spotName,
          countryName: spot.countryName,
          location: spot.location,
          description: spot.description,
          averageCost: spot.averageCost,
          seasonality: spot.seasonality,
          totalVisitor: spot.totalVisitor
        }
      }
      const result = await tourismSpotCollection.updateOne(filter,updatedSpot,options);
      res.send(result)

    })
    
    app.get('/spots/:id',async (req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await tourismSpotCollection.findOne(query);
      res.send(result);
      // console.log(query);
    });


    // Code for Country Collection
    app.get('/countries', async(req,res)=>{
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    // app.get('/spots/country', async(req,res)=>{
    //   const cursor = tourismSpotCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result)
    // });

    





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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


