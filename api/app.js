
// [ Routing Library ]
var express = require('express');
var cors    = require('cors'); 
var fs      = require('fs');
var knex    = require("knex");

// [ Start server ]
console.log("Starting REST server...");

// [ THe Knex query builder instance ]
// Can't initilize it until the connect info is read from the config file
var db = null;

// [ Reads the database credentials/config and connects ]
fs.readFile("config.json", 'utf8', function(err, json) {
  if (err) throw err;
  console.log("Read connection info...");
  console.log("Connecting to database...");

  var config = null;
  try{
    config = JSON.parse(json);
  }catch(e){
    console.log("Config file was corrupted!");
    throw e;
  }

  try{
    db = knex(config);
  }catch(e){
    console.log("Failed to conncet to database!");
    throw e;
  }

});

// [ Create the express app ]
var app = express();

// [ Middleware to get the reqeust body ]
app.use (function(req, res, next) {
    var data='';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        next();
    });
});

// [ Allows cross origin requests ]
// https://www.html5rocks.com/en/tutorials/cors/
app.use(cors());

// [ Customer Search ]
app.get("/customers",function(req,res){
    var query = db
        .select("custID","firstName","lastName","phoneNumber")
        .from("Customer");

    if(req.query.custID){
        query.orWhere("custID","like","%" + req.query.custID + "%");
    }

    if(req.query.firstName){
        query.orWhere("firstName","like","%" + req.query.firstName + "%");
    }

    if(req.query.lastName){
        query.orWhere("lastName","like","%" + req.query.lastName + "%");
    }

    if(req.query.phoneNumber){
        query.orWhere("phoneNumber","like","%" + req.query.phoneNumber + "%");
    }

    // console.log(query);

    query.then(function(customers){
        res.end(JSON.stringify(customers));
    });
})

// [ Listen for requests ]
app.listen(80, function () {
  console.log('Web server listening on port 80...');
});
