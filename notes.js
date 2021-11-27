const { MongoClient } = require('mongodb');
const body_parser = require('body-parser')
const url = `mongodb+srv://${process.env.mongocred}@${process.env.mongourl}/`;
const express = require("express");
const cors = require("cors");
const pg = require('./pg')
var app = express();
app.use(cors());
app.options('*', cors());
app.post("/create", body_parser.json(), async function(req, res) {
    const client = new MongoClient(url);
    console.log(typeof req.body, `request ${JSON.stringify(req.body)}`);
    //console.log(req.body.id);
    try {
    await client.connect();
    const database = await client.db('notes');
    const notes = await database.collection('notes');
    await notes.deleteOne({id : req.body.id});
    await notes.insertOne(req.body);
    } finally {
        await client.close();
    }
    res.send("ok");
})

app.post("/users/:i", body_parser.json(), async function(req,res) {
    const client = new MongoClient(url);
    if (req.params.i === "signin") {
        try {
            await client.connect();
            const database = await client.db('users');
            const users = await database.collection('users');
            const pair = await users.findOne({username : req.body.username});
            if (req.body.password === pair.password) {
                const key = pair.key;
                res.send(key);
            }
            else {
                res.status(401);
                res.send("Unauthorized");
            }
        } finally {
            await client.close();
        }
    }
    else if (req.params.i === "signup") {
        try {
            await client.connect();
            const database = await client.db('users');
            const users = await database.collection('users');
            console.log(await users.find({username : req.body.username}).count())
            if (await users.find({username : req.body.username}).count() > 0) {
                res.status(406);
                res.send("Username already used.");
            }
            else {
                let o = req.body;
                o.key = pg.generate();
                await users.insertOne(o);
                res.send("Signup successful.");
            }
        }
        finally {
            client.close();
        }
    }
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
