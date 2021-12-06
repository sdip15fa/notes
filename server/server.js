const { MongoClient } = require("mongodb");
const body_parser = require("body-parser");
const url = `mongodb+srv://${process.env.mongocred}@${process.env.mongourl}/`;
const express = require("express");
const cors = require("cors");
const pg = require("./pg");
const app = express();
app.use(cors());
app.options("*", cors());
app.get("/testconnection", async function (req, res) {
  res.send("ok");
});
app.post("/create", body_parser.json(), async function (req, res) {
  const client = new MongoClient(url);
  console.log(typeof req.body, `request ${JSON.stringify(req.body)}`);
  // console.log(req.body.id);
  try {
    await client.connect();
    const database = await client.db("notes");
    const notes = await database.collection("notes");
    await notes.deleteOne({ id: req.body.id });
    await notes.insertOne(req.body);
  } finally {
    await client.close();
  }
  res.send("ok");
});

app.post("/users/:i", body_parser.json(), async function (req, res) {
  const client = new MongoClient(url);
  if (req.params.i === "signin") {
    try {
      await client.connect();
      const database = await client.db("users");
      const users = await database.collection("users");
      const pair = await users.findOne({ username: req.body.username });
      if (pair && req.body.password === (await pair.password)) {
        const key = pair.key;
        res.send(key);
      } else {
        res.status(401);
        res.send("Username / password incorrect.");
      }
    } finally {
      await client.close();
    }
  } else if (req.params.i === "signup") {
    try {
      await client.connect();
      const database = await client.db("users");
      const users = await database.collection("users");
      console.log(await users.find({ username: req.body.username }).count());
      if ((await users.find({ username: req.body.username }).count()) > 0) {
        res.status(409);
        res.send("Username already used.");
      } else {
        const o = req.body;
        o.key = await pg.generate();
        await users.insertOne(o);
        res.send(o.key);
      }
    } finally {
      await client.close();
    }
  }
});

app.get("/notes/users/:user", async function (req, res) {
  const client = new MongoClient(url);
  try {
    const key = req.params.user;
    await client.connect();
    const database = await client.db("users");
    const notes = await database.collection("notes");
    if ((await notes.find({ key: key }).count()) > 0) {
      const o = await notes.findOne({ key: key });
      delete o._id;
      delete o.key;
      res.send(o);
    } else {
      res.status(404);
      res.send("Not found.");
    }
  } finally {
    await client.close();
  }
});

app.post("/notes/users/:user", body_parser.json(), async function (req, res) {
  const key = req.params.user;
  const client = new MongoClient(url);
  try {
    await client.connect();
    const database = await client.db("users");
    const notes = await database.collection("notes");
    const users = await database.collection("users");
    if ((await users.find({ key: key }).count()) > 0) {
      await notes.deleteOne({ key: key });
      await notes.insertOne(req.body);
      res.send("ok");
    } else {
      res.status(404);
      res.send("User not found.");
    }
  } finally {
    await client.close();
  }
});

app.get("/get/:id", async function (req, res) {
  const client = new MongoClient(url);
  try {
    const id = req.params.id;
    await client.connect();
    const database = await client.db("notes");
    const notes = await database.collection("notes");
    const query = { id: id };
    var note = await notes.findOne(query);
    console.log(note);
  } finally {
    await client.close();
  }
  res.set("Content-Type", "application/json");
  res.send(JSON.stringify(note));
});
app.listen(4000, function () {
  console.log("Listening at port 4000");
});
