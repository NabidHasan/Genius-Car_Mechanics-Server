const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
var cors = require('cors')
require('dotenv').config();
const app = express();

const port = 5000;

// middleware

app.use(cors());
app.use(express.json());

//Database uri and client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zsdqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanics");
        const servicesCollections = database.collection("services");

        //get Single id

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id)

            const query = { _id: ObjectId(id) }
            const service = await servicesCollections.findOne(query);
            res.send(service);
        })

        //get Api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollections.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //Post Api

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hitting the button', service);
            const result = await servicesCollections.insertOne(service);
            console.log(result);
            res.json(result);

        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Genius Server 5000');
});

app.listen(port, () => {
    console.log("Running server on port", port)
})