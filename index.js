const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_CAR_ID}:${process.env.DB_CAR_PASS}@cluster0.ngmeevb.mongodb.net/?retryWrites=true&w=majority`;
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


        const categoriesCollection = client.db('CarZoneKids').collection('categories');
        // console.log(categoriesCollection)

        //------ categories  routes --------
        app.get('/categories', async (req, res) => {
            const cursor = categoriesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoriesCollection.findOne(query)
            res.send(result)
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



app.get('/', (req, res) => {
    res.send('Car zone kids is running');
})

app.listen(port, () => {
    console.log(`car kids server is running on port ${port}`)
})