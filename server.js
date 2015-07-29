var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
//session stuff later...
var routes = require('./routes')
var app = express();

/* database setup 
//* Currently commented out due to probably not needing it. 

var PouchDB = require("pouchdb");
PouchDB.plugin(require('pouchdb-authentication'));
var remote = new PouchDB('http://localhost:5984/mydb');
var localDb = new PouchDB('local_db');
localDb.sync(remote, {live: true, retry: true}).on('error', console.log.bind(console));
/* end database setup */

/* templating engine */
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
nunjucks.configure('views', { //setting up our templating engine 
    autoescape: true,
    express: app,
    watch: true
});
var env = nunjucks.configure('views');
env.express(app);
/* end templating engine */

app.set('port', process.env.PORT || 8887); // telling c9 (if that's a thing) where our app runs.
app.set('ip', process.env.IP || '0.0.0.0');

app.use(express.static('public')); //static folder for things like css

/* accept json and multipart */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ //make user input safe
    extended: false
}));

app.use(routes.setup(app)); //setup them routes

var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("communicator running on https://%s:%s",
        address.address, address.port);
});
