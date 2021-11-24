var MongoClient = require('mongodb').MongoClient;
var url = `mongodb+srv://${process.env.mongocred}@${process.env.mongourl}/`;
var express = require("express");
var app = express();
var dbo = db.db("notes");

app.post("/create", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        dbo.collection("notes").insertOne(req.body, function(err, res) {
            if (err) throw err;
            db.close();
        })
    })
    res.writeHead(200);
    res.write();
})

app.get("/get/:id", function(req, res) {
    var r;
    let id = req.params.id;
    let query = { id : id };
    dbo.collection("notes").find(query).toArray(function(err, result) {
        if (err) throw err;
        r = result
        db.close();
    });
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(r));
})
app.listen(1000, function(){
    console.log("Listening at port 1000");
});