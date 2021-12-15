const { MongoClient } = require("mongodb");
const body_parser = require("body-parser");
const url = `mongodb+srv://${process.env.mongocred}@${process.env.mongourl}/`;
const express = require("express");
const cors = require("cors");
const rg = require("wcyat-rg");
const hash = require("hash.js");
const cf = require('node_cloudflare');
const app = express();
app.use(cors());
app.options("*", cors());
function getip(req) {
  return (req.connection.remoteAddress ? req.connection.remoteAddress : req.remoteAddress);
}
app.get("/testconnection", async (req, res) => {
  res.send("ok");
});
app.post("/create", body_parser.json(), async (req, res) => {
  const client = new MongoClient(url);
  if (req.body.id && req.body.text && Object.keys(req.body).length === 2) {
  try {
    await client.connect();
    const database = client.db("notes");
    const notes = database.collection("notes");
    await notes.deleteMany({ id: req.body.id });
    await notes.insertOne(req.body);
  } finally {
    await client.close();
  }
  res.send("ok");
}
else {res.status(409); res.send("Syntax error.")}});

app.post("/users/:i", body_parser.json(), async (req, res) => {
  const client = new MongoClient(url);
  if (req.params.i === "signin") {
    try {
      await client.connect();
      const database = client.db("users");
      const users = database.collection("users");
      const pair = await users.findOne({ username: req.body.username });
      if (pair && req.body.password === pair.password) {
        const key = pair.key;
        res.send(key);
      } else if (
        pair &&
        req.body.password === hash.sha256().update(pair.password).digest("hex")
      ) {
        const key = pair.key;
        pair.password = req.body.password;
        await users.deleteOne({ username: req.body.username });
        await users.insertOne(pair);
        res.send(key);
      } else {
        res.status(401);
        res.send("Username / password incorrect.");
      }
    } finally {
      await client.close();
    }
  } else if (req.params.i === "signup") {
    const ip = getip(req);
    try {
      await client.connect();
      const database = client.db("users");
      const users = database.collection("users");
      if ((await users.find({ username: req.body.username }).count()) > 0) {
        res.status(409);
        res.send("Username already used.");
      } else {
        const o = req.body;
        o.key = rg.generate({
          include: {
            numbers: true,
            upper: true,
            lower: true,
            special: false,
          },
          digits: 15,
        });
        await users.insertOne(o);
        res.send(o.key);
      }} finally {
      await client.close();
    }
  }});

app.get("/notes/users/:user", async (req, res) => {
  const client = new MongoClient(url);
  try {
    const key = req.params.user;
    await client.connect();
    const database = client.db("users");
    const notes = database.collection("notes");
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

app.post("/notes/users/:user", body_parser.json(), async (req, res) => {
  const key = req.params.user;
  const client = new MongoClient(url);
  try {
    await client.connect();
    const database = client.db("users");
    const notes = database.collection("notes");
    const users = database.collection("users");
    if ((await users.find({ key: key }).count()) > 0) {
      await notes.deleteMany({ key: key });
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

app.get("/get/:id", async (req, res) => {
  const client = new MongoClient(url);
  try {
    const id = req.params.id;
    await client.connect();
    const database = client.db("notes");
    const notes = database.collection("notes");
    const query = { id: id };
    var note = await notes.findOne(query);
    console.log(note);
  } finally {
    await client.close();
  }
  if (note) {
    res.set("Content-Type", "application/json");
    res.send(JSON.stringify(note));
  } else {
    res.status(404);
    res.send("not found");
  }
});
cf.load(function (error, fs_error) {
  if (fs_error)
	{
		throw new Error(fs_error);
	}
  app.listen(4000, function () {
    console.log("Listening at port 4000");
  });  
})
