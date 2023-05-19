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


        const toysCollection = client.db('CarZoneKids').collection('allToys');
        // console.log(categoriesCollection)

        // Creating index on two fields
        const indexKeys = { toy_name: 1 }; // Replace field1 and field2 with your actual field names
        const indexOptions = { name: "toy_name" }; // Replace index_name with the desired index name
        const result = await toysCollection.createIndex(indexKeys,indexOptions)
        console.log(result);

        //------ categories  routes --------
        app.get('/allToys', async (req, res) => {
            const cursor = toysCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query)
            res.send(result)
        })


        app.get("/getToysByText/:text", async (req, res) => {
            const text = req.params.text;
            const result = await toysCollection
                .find({
                    $or: [
                        { toy_name: { $regex: text, $options: "i" } }
                    ],
                })
                .toArray();
            res.send(result);
        });


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