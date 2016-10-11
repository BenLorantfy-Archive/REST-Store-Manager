// [ Routing Library ]
var app = require('express')();
var cors = require('cors'); 

// Get's request body
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

// Allows cross origin requests
app.use(cors());

app.get("/hi",function(req,res){
	res.end("HI");
})

app.listen(80, function () {
  console.log('Web server listening on port 80!');
});
