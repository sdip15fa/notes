var MongoClient = require('mongodb').MongoClient;
var url = `mongodb://${process.env.mongocred}@${process.env.mongourl}/`;
var express = require("express");
var app = express();

app.post("/create", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("notes");
        dbo.collection("notes").insertOne(req.body, function(err, res) {
            if (err) throw err;
            db.close();
        })
    })
    res.writeHead(200);
    res.write();
})

app.get("/get/:id", function(req, res) {
    let id = req.params.id;
    let query = { id : id };
    MongoClient.connect(url, function(err, db) {
    var dbo = db.db("notes");
    dbo.collection("notes").find(query).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(result);
    });
    })
})
app.listen(4000, function(){
    console.log("Listening at port 4000");
});
