const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// database link
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b6wqjn1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log(
      "Successfully connected to MongoDB!"
    );

    // Connect to the "car-doctor" database
    const bitesPlus = client.db("bites-plus");
    const foodsCollection = bitesPlus.collection("foodCollection");
    

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // console.log(
    //   "Close your deployment. You successfully terminate connection to MongoDB!"
    // );
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("BitesPlus Server RUNNING");
});

app.listen(port, () => {
  console.log(`spying on port ${port}`);
});
