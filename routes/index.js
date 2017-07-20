var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
// var MongoClient = require('mongodb').MongoClient
//   , assert = require('assert');
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

router.get('/archive', function(req, res, next) {
  var result = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('archives').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      result.push(doc);
    }, function() {
      db.close();
      res.render('archive', {page: '/archive', items: result });
    });
  });
});

router.get('/archive/:id', function(req, res, next) {
  var result = [];
  var id = req.params.id;
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('programs').aggregate([
        {
          $lookup:
            {
              from: "archives",
              localField: "_id",
              foreignField: "prog_id",
              as: "archives"
            }
      },
      {
          $match: { "_id": id }
      }
    ]);
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      result.push(doc);
    }, function() {
      db.close();
      res.render('viewProgArc', {page: '/archive', items: result });
    });
  });
});

router.get('/showArc/:id', function(req, res, next) {
  var result = [];
  var id = req.params.id;
  var o_id = new ObjectId(id);
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('archives').aggregate([
        {
          $lookup:
            {
              from: "programs",
              localField: "prog_id",
              foreignField: "_id",
              as: "programs"
            }
      },
      {
          $match: { "_id": o_id }
      }
    ]);
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      result.push(doc);
    }, function() {
      // console.log(result[0].archives);
      db.close();
      res.render('viewArc', {page: '/archive', items: result });
    });
  });
});

router.get('/members', function(req, res, next) {
  var result = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('members').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      result.push(doc);
    }, function() {
      db.close();
      res.render('members', {page: '/members', items: result });
    });
  });
});

router.get('/about', function(req, res, next) {
  res.render('about', {page: '/about' });
});


/* Student Section */
router.get('/admin', function(req, res, next) {
  res.render('admin', {page: '/admin' });
});

/* Teacher Section */
router.get('/teacherForm', function(req, res, next) {
  res.render('teacherForm', {page: '/teacherForm' });
});
/////////////////////////////////////////////////////////////////////////////////////////
// REST API Post works
////////////////////////////////////////////////////////////////////////////////////////

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
    username : req.body.tUsername,
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
  
  res.redirect('/teacherForm' );
});

router.post('/insertStudent', function(req, res, next){
  var item = {
    name : req.body.sName,
    institution : req.body.sInstitution,
    class : req.body.sClass,
    gender : req.body.sGender,
    location : req.body.sLocation,
    pic: req.body.sPic,
    username : req.body.sUsername,
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
  
  res.redirect('/admin' );
});

module.exports = router;
