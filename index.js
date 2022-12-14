const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend Runnign')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.76mh2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const bikes = client.db('bikedb').collection('bikes');
        console.log('bikedb conected');

        // get data 
        app.get('/bikes', async (req, res) => {
            const query = {};
            const cursor = bikes.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })

        // post api create data from react
        app.post('/bikes', async (req, res) => {
            const newBike = req.body;
            // console.log(newBike);
            console.log('adding Bike', newBike);
            const result = await bikes.insertOne(newBike);

            res.send(result)
        })

        // delete one bike api 
        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikes.deleteOne(query);
            res.send(result)
        })


        // single data api 
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const singleBike = await bikes.findOne(query)
            res.send(singleBike)
        })

        // update api for decrement quantity
        app.put('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const filterOne = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $inc: { quantity: - 1 }
            }
            const result = await bikes.updateOne(filterOne, updateDoc, option);
            console.log(result)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)


app.listen(port, () => {
    console.log('Backend Runnig')
})