// Our scraping tools
var express = require('express');
// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

var router = express.Router();

/* GET saved articles */
router.get('/', function (req, res, next) {
  Article.find({}, function (error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      console.log("SAVED ARTICLES", doc);
    }
  }).populate("note")
    .exec(function (err, doc) {
      res.status(200).json(doc);
    });
});

// GET article by id
router.get("/:id", function (req, res) {
  // Use the article id to find and update it's note
  Article.findById({
    "_id": req.params.id
  }).populate("note")
  // Execute the above query
    .exec(function (err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      } else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

/* POST save article */
router.post('/', function (req, res, next) {
  // Using our Article model, create a new entry
  // This effectively passes the result object to the entry (and the title and link)
  var entry = new Article(req.body);
  // Now, save that entry to the db
  entry.save(function (err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Or log the doc
    else {
      console.log(doc);
    }
  });
});

// Create a new note
router.post("/:id/note", function (req, res) {

  var newNote = new Note({body: req.body["Text"]});
  newNote.save(function (err, doc) {
    if (err) {
      console.log(error);
    }
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          "note": doc._id
        }
      }, {
        new: true
      }, function (err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.json(newdoc);
        }
      });
    }
  });
});

router.delete("/:id/note/:nid", function (req, res) {
  console.log("id: " + req.params.id);
  console.log("nid: " + req.params.nid);
  res.status(202);
});

router.delete("/:id/note", function (req, res) {
  console.log("delete all notes");
});
module.exports = router;