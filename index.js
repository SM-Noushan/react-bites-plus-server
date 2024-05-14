const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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
app.use(cookieParser());

// my middleware
const verifyToken = (req, res, next) => {
  const token = req?.cookies?.access_token;
  // no token
  if (!token) return res.status(401).send({ message: "Unauthorized Access" });
  // verify token
  jwt.verify(token, process.env.Access_Token_Secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized Access" });
    res.user = decoded;
    next();
  });
};

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
    console.log("Successfully connected to MongoDB!");

    // Connect to the "car-doctor" database
    const bitesPlus = client.db("bites-plus");
    const foodsCollection = bitesPlus.collection("foodCollection");

    //auth api
    //set token on sign in
    app.post("/signin", async (req, res) => {
      console.log("signin");
      const user = req.body;
      const token = jwt.sign(user, process.env.Access_Token_Secret, {
        expiresIn: "1hr",
      });
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.send({ status: true });
    });

    //clear token on sign out
    app.post("/signout", async (req, res) => {
      console.log("signout");
      const user = req.body;
      res.clearCookie("access_token", { maxAge: 0 }).send({ status: true });
    });

    // bookings apis
    // store food data
    app.post("/food", async (req, res) => {
      const data = req.body;
      const result = await foodsCollection.insertOne(data);
      res.send(result);
    });
    
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
