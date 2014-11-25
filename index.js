/*jslint node: true */
'use strict';

// Declare variables used
var app, base_url, client, express, port, rtg;

// Define values
express = require('express');
app = express();
port = process.env.PORT || 5000;
base_url = process.env.BASE_URL || 'http://localhost:5000';

// Set up connection to Redis
/* istanbul ignore if */
if (process.env.REDISTOGO_URL) {
    rtg  = require("url").parse(process.env.REDISTOGO_URL);
    client = require("redis").createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    client = require('redis').createClient();
}

// Set up templating
app.set('views', __dirname + '/views');
app.set('view engine', "hbs");
app.engine('hbs', require('hbs').__express);

// Set URL
app.set('base_url', base_url);

// Define index route
app.get('/', function (req, res) {
    res.render('index');
});

// Serve static files
app.use(express.static(__dirname + '/static'));

// Listen
app.listen(port);
console.log('Listening on port ' + port);
