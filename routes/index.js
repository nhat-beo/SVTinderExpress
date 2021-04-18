var express = require('express');
var router = express.Router();

//Multer
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({
  dest: './public/uploads/'
  , storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  }
}).single('avatar');

//Body parser
var bodyParser = require('body-parser')
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// getting-started.js
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.dijva.mongodb.net/tinder', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Succesfully');
});

//Định nghĩa 1 collection trong schema
var user_schema = new mongoose.Schema({
  lastname : String,
  firstname : String,
  birthday : String,
  school : String,
  email : String,
  phone : String,
  gender : String,
  hobbies : String,
  description : String,
  avatar : String
});

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

//Danh sách người dùng
router.get('/home_page', function(req, res, next) {
  var user_model = db.model('users', user_schema);
  user_model.find({}, function (error, userlist) {
    if (error) {
      res.send('Lỗi lấy thông tin: ' + error.message);
    } else {
      res.render('home_page', {users: userlist});
    }
  })
});

//Insert user
router.get('/my_information', function(req, res, next) {
  res.render('my_information');
});

router.post('/add_user', upload, function(req, res, next) {
  var user_model = db.model('users', user_schema);
  user_model({
    lastname : req.body.lastname,
    firstname : req.body.firstname,
    birthday : req.body.birthday,
    school : req.body.school,
    email : req.body.email,
    phone : req.body.phone,
    gender : req.body.gender,
    hobbies : req.body.hobbies,
    description : req.body.description,
    avatar : 'none'
  }).save(function (error){
    if (error) {
      res.send("Lỗi thêm thông tin");
    } else {
      res.send("Thêm thông tin thành công");
    }
  });
});

//Delete user
router.get('/delete_user.id=:id', function(req, res, next) {
  // res.render('update_user');
  var user_model = db.model('users', user_schema);
  user_model.findByIdAndRemove(req.params.id, function (error, user) {
    if (error) {
      res.send("Lỗi xóa thông tin");
    } else {
      user_model.find({}, function (error, userlist) {
        if (error) {
          res.send('Lỗi lấy thông tin: ' + error.message);
        } else {
          res.render('home_page', {users: userlist});
        }
      })
    }
  })
});

//Update user
router.get('/update_user.id=:id', function(req, res, next) {
  var user_model = db.model('users', user_schema);
  user_model.findOne({_id: req.params.id}, function (error, user) {
    if (error) {
      res.send("Lỗi sửa thông tin");
    } else {
      res.render('update_user', {user: user, gender: user.gender});
    }
  })
});

router.post('/update_user.id=:id', upload, function(req, res, next) {
  var user_model = db.model('users', user_schema);
  user_model.findByIdAndUpdate(req.params.id,{
    lastname : req.body.lastname,
    firstname : req.body.firstname,
    birthday : req.body.birthday,
    school : req.body.school,
    email : req.body.email,
    phone : req.body.phone,
    gender : req.body.gender,
    hobbies : req.body.hobbies,
    description : req.body.description,
    avatar : 'none'
  },function (error){
    if (error) {
      res.send("Lỗi sửa thông tin");
    } else {
      user_model.findOne({_id: req.params.id}, function (error, user) {
        if (error) {
          res.send("Lỗi sửa thông tin");
        } else {
          res.render('update_user', {user: user, gender: user.gender});
        }
      })
    }
  });
});

module.exports = router;
