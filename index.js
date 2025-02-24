const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())




app.get('/', async (req, res) => {
    res.send("server is running")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxd6utg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const productsCollection = client.db("practiseTask").collection("productsCollection")
        const cartsCollection = client.db("practiseTask").collection("cartsCollection")
        
        app.get("/products", async(req, res)=>{
        const result = await productsCollection.find().toArray();
        res.send(result)
        })

        app.post("/carts", async(req, res)=>{
            const params = req.body
            const result = await cartsCollection.insertOne(params)
            
            res.send(result);
        })
        app.get("/carts", async(req, res)=>{
            const result = await cartsCollection.find().toArray()
            res.send(result);
        })

        //add item
        app.post("/products", async(req, res) =>{
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server is sitting on the port ${port}`)
})