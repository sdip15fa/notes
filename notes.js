const { MongoClient } = require('mongodb');
const body_parser = require('body-parser')
const url = `mongodb+srv://${process.env.mongocred}@${process.env.mongourl}/`;
const express = require("express");
const cors = require("cors");
var app = express();
app.use(cors());
app.use(body_parser.json());
app.options('*', cors());
app.post("/create", async function(req, res) {
    const client = new MongoClient(url);
    console.log(typeof req.body, `request ${JSON.stringify(req.body)}`);
    //console.log(req.body.id);
    try {
    await client.connect();
    const database = await client.db('notes');
    const notes = await database.collection('notes');
    await notes.insertOne(req.body);
    } finally {
        await client.close();
    }
    res.set("Access-Control-Allow-Origin", "*");
    res.send("ok");
})

app.get("/get/:id", async function(req, res) {
    const client = new MongoClient(url);
    try {
        const id = req.params.id;
        await client.connect();
        const database = await client.db('notes');
        const notes = await database.collection('notes');
        const query = { id : id };
        var note = await notes.findOne(query);
        console.log(note);
    } finally {
        await client.close();
    }
    res.set("Content-Type", "application/json");
    res.send(JSON.stringify(note));
});
app.listen(4000, function(){
    console.log("Listening at port 4000");
});
