const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const morgan = require("morgan");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3w3t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)

    const campCollection = client.db("MCMS").collection("camp");
    const userCollection = client.db("MCMS").collection("users");
    const joinCampCollection = client.db("MCMS").collection("JoinCamp");

    //jwt related api
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "6h",
      });
      res.send({ token });
    });
    //verify token middlewares
    const verifyToken = (req, res, next) => {
      // console.log("Inside verify token", req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "forbidden Access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Forbidden Access" });
        }
        req.decoded = decoded;
        next();
      });
    };
    //use verify admin after token

    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === "admin";

      if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    //users related API
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exist", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    //get users
    app.get("/users", verifyToken, async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    //admin
    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "Unauthorized access" });
      }
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });
    //users update:
    app.patch("/user/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          name: updatedData.name,
          photoURL: updatedData.photoURL,
          phone: updatedData.phone,
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    //available camps
    //get for camps
    app.get("/camps", async (req, res) => {
      const result = await campCollection.find().toArray();
      res.send(result);
    });
    //get camp with id
    app.get("/camps/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campCollection.findOne(query);
      res.send(result);
    });
    //join camp
    app.post("/join-camps", async (req, res) => {
      const campRequest = req.body;
      const result = await joinCampCollection.insertOne(campRequest);
      res.send(result);
    });
    app.get("/registeredCamps/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { participantEmail: email };
      const result = await joinCampCollection.find(query).toArray(); // Array return
      res.send(result);
    });

    //addcamp postoperation
    app.post("/camp", async (req, res) => {
      const item = req.body;
      const result = await campCollection.insertOne(item);
      res.send(result);
    });
    //delete a camp
    app.delete("/camps/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campCollection.deleteOne(query);
      res.send(result);
    });
    //update a  camp
    app.patch("/camp/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;

      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          name: updatedData.name,
          dateTime: updatedData.dateTime,
          location: updatedData.location,
          professional: updatedData.professional,
          participants: updatedData.participants,
          fees: updatedData.fees,
          description: updatedData.description,
          image: updatedData.image, // Optional, only if provided
        },
      };

      const result = await campCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    //all registrated camps by the users
    app.get("/registeredCamps", verifyToken, async (req, res) => {
      const result = await joinCampCollection.find().toArray();
      res.send(result);
    });

    //finish
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//
app.get("/", (req, res) => {
  res.send("Medical Camp Management System is running...");
});

app.listen(port, () => {
  console.log(`Medical Camp Management System is running: ${port}`);
});
