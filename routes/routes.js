var express = require('express');



exports.setup = function() {
	var router = express.Router();

	router.get('/', function(req, res, next) {
		return res.render('index', {
			title: "Welcome to Communicator."
		});
	});

	return router;
}