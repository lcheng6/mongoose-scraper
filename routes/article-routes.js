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
    .exec(function (err, articles) {
      if (err) {
        res.status(500)
      } else {
        res.render("saved-articles", {articles: articles});
      }
    });
});
router.get('/articles.json', function (req, res, next) {
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

router.delete("/:id", function (req, res) {
  var articleId = req.params.id;
  console.log("To remove article id " + articleId);
  Article.findByIdAndRemove(articleId, function (err) {
      if (err) {
        res.status(500).send("Could not remove: " + articleId);
      } else {
        res.status(200);
      }
    }
  );
});

/* POST to save or to delete article */
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

router.post('/:id', function (req, res, next) {
  var articleId = req.params.id;
  var method = req.body["_method"];

  if (method === "delete") {
    Article.find({_id: articleId}).remove()
      .exec(function () {
        res.send(200);
      })
  }
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
  var articleId = req.params.id;
  var noteId = req.params.nid;
  console.log("article ID: " + articleId);
  console.log("note Id: " + noteId);


  Article.update({_id: articleId}, {$pullAll: {note: [nid]}});
  Note.findByIdAndRemove(noteId);

  res.status(200);
});

router.delete("/:id/note", function (req, res) {
  console.log("delete all notes");
});
module.exports = router;