var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
// var MongoClient = require('mongodb').MongoClient
//   , assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/jdf';

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


/* Admin Section */
router.get('/admin', function(req, res, next) {
  res.render('admin', {page: '/admin' });
});

/////////////////////////////////////////////////////////////////////////////////////////
// REST API Post works
////////////////////////////////////////////////////////////////////////////////////////

// for Members
router.post('/insertMember', function(req, res, next){
  var item = {
    name : req.body.memName,
    versity_id : parseInt(req.body.memId),
    rank : req.body.memRank,
    skills: req.body.memSkills.split(","),
    pic: req.body.memPic
  }; 

  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('members').insertOne(item, function(err, result){
    assert.equal(err, null);
    console.log("Item Successfully Inserted.");
    db.close();
    });
  });
  
  res.redirect('/admin' );
});

// for Program
router.post('/insertProgram', function(req, res, next){
  var item = {
    _id: req.body.progId,
    title : req.body.progTitle,
    type : req.body.progType,
    desc: req.body.progDes,
    date: req.body.progDate,
    pic: req.body.progPic
  }; 

  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('programs').insertOne(item, function(err, result){
    assert.equal(err, null);
    db.close();
    });
  });
  
  res.redirect('/admin' );
});

module.exports = router;
