
// [ Routing Library ]
var express = require('express');
var cors    = require('cors'); 
var fs      = require('fs');
var knex    = require("knex");

// [ Config file with db credentials ]
var config  = require("./config.json");

// [ Start server ]
console.log("Starting REST server...");

// [ The Knex query builder instance ]
var db = knex(config);

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
        try{
            req.body = JSON.parse(data);
        }catch(e){
            // do nothing
        }
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

// [ Customer Insert ]
app.post("/customers",function(req,res){
    var query = db
        .insert({
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            phoneNumber:req.body.phoneNumber
        })
        .into('Customer');

    query.then(function(){
        res.end(JSON.stringify({ sucess:true }));
    });
})


// [ Listen for requests ]
app.listen(80, function () {
  console.log('Web server listening on port 80...');
});

//process.on('SIGTERM', function () {
//  app.close(function () {
//    process.exit(0);
//  });
//});
