var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/tuition';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page: '/' });
});


// router.get('/user', function(req, res, next) {
//   res.send("user");
// });
router.get('/error', function(req, res, next) {
  res.render('error');  
});

router.get('/teacherlist', function(req, res, next) {
  var result = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('teacher').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      result.push(doc);
    }, function() {
      db.close();
      res.render('teacherlist', {items: result });
    });
  });
})
/* Student Section */
router.get('/registerStudent', function(req, res, next) {
  res.render('admin');
});

/* Teacher Section */
router.get('/registerTeacher', function(req, res, next) {
  res.render('teacherForm');
});

// router.get('/teacher', function(req, res, next) {
//   res.render('teacher');
// });
/////////////////////////////////////////////////////////////////////////////////////////
// REST API Post works
////////////////////////////////////////////////////////////////////////////////////////
//teacher login
router.post('/teacher', function(req, res, next){
  var email = req.body.email;
  var  pass = req.body.password;
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('teacher').findOne({username: email, password: pass}, function(err, doc){
    assert.equal(err, null);
    console.log("Item Searched Inserted.");
    db.close();
    res.render('teacher', {items: doc});    
  });
});
});

//teacher show
router.get('/teacher/:email', function(req, res, next){
  var email = req.params.email;
  // var  pass = req.body.password;
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('teacher').findOne({username: email}, function(err, doc){
    assert.equal(err, null);
    console.log("Item Searched Inserted.");
    db.close();
    res.render('teacher', {items: doc});    
  });
});
});

//student login
router.post('/student', function(req, res, next){
  var email = req.body.email;
  var  pass = req.body.password;
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('student').findOne({username: email, password: pass}, function(err, doc){
    assert.equal(err, null);
    console.log("Item Searched Inserted.");
    db.close();
    res.render('student', {items: doc});    
  });
});
});


// for Teachers
router.post('/insertTeacher', function(req, res, next){
  var item = {
    name : req.body.tName,
    university : req.body.tUniv,
    gender : req.body.tGender,
    major : req.body.tMajor,
    location : req.body.tLocation,
    subjects : req.body.tSubjects,
    bio : req.body.tBio,
    contact : req.body.tContact,
    pic: req.body.tPic,
    username : req.body.tUser,
    password : req.body.tPassword
  }; 
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('teacher').insertOne(item, function(err, result){
    assert.equal(err, null);
    console.log("Item Successfully Inserted.");
    db.close();
    });
  });
  
  res.redirect('/' );
});

router.post('/insertStudent', function(req, res, next){
  var item = {
    name : req.body.sName,
    institution : req.body.sInstitution,
    class : req.body.sClass,
    gender : req.body.sGender,
    location : req.body.sLocation,
    username : req.body.sUser,
    password : req.body.sPassword,
    contact : req.body.sContact
  }; 
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('student').insertOne(item, function(err, result){
    assert.equal(err, null);
    console.log("Item Successfully Inserted.");
    db.close();

    });
  });
  
  res.redirect('/' );
});

module.exports = router;
