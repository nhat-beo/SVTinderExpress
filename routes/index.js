var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('background_app');
});

router.get('/sign_in', function(req, res, next) {
  res.render('sign_in');
});

router.get('/sign_up', function(req, res, next) {
  res.render('sign_up');
});

router.get('/home_page', function(req, res, next) {
  res.render('home_page');
});

router.get('/my_information', function(req, res, next) {
  res.render('my_information');
});
module.exports = router;
