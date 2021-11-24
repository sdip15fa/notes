const { MongoClient } = require('mongodb');
const url = `mongodb+srv://${process.env.mongocred}@${process.env.mongourl}/`;
var express = require("express");
var app = express();

app.post("/create", async function(req, res) {
    const client = new MongoClient(url);
    try {
    await client.connect();
    const database = client.db('notes');
    const notes = database.collection('notes');
    await notes.insertOne(req.body);
    } finally {
        await client.close();
    }
    res.writeHead(200);
    res.write();
})

app.get("/get/:id", async function(req, res) {
    const client = new MongoClient(url);
    try {
        const id = req.params.id;
        await client.connect();
        const database = client.db('notes');
        const notes = database.collection('notes');
        const query = { id : id };
        var note = notes.findOne(query);
        console.log(note);
    } finally {
        await client.close();
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(note);
});
app.listen(4000, function(){
    console.log("Listening at port 4000");
});
