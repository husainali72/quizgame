// modules =================================================
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var app = express();

//App routing
app.use('/', express.static(__dirname + '/app'));

/* Server Starters Start */
var server = app.listen(process.env.PORT || 5000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Quiz app listening at http://%s:%s", host, port);
});

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({
    extended: true
})); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});

app.use(function(req, res, next) {
    res.setTimeout(1800000, function() {
        console.log('Request has timed out');
        res.send(408);
    });

    next();
});
/* Server Starters end */

var mongourl = 'mongodb://ghia:upwork@ds161459.mlab.com:61459/testghia';

MongoClient.connect(mongourl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected to server.");

    db.close();
});

/**** ROUTES ****/

app.post('/questions/list-all', function(req, res) {

    resObj = {};
    MongoClient.connect(mongourl, function(err, db) {
        if (err) {
            return console.dir(err);
        }
        assert.equal(null, err);

        var dbo = db.db('testghia')

        var collection = dbo.collection('questions');

        collection.find().toArray(function(err, questions) {
            if (questions.length <= 0) {
                resObj.success = false;
                resObj.message = "No Questions available at the moment.";
                res.send(resObj);
                return;
            }

            resObj.success = true;
            resObj.message = "Fetched Successfully.";
            resObj.questions = questions;
            res.send(resObj);
            return;
        });
    });
});