// Our scraping tools
var express = require('express');
// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

var router = express.Router();

/*this interface will only post and delete notes*/
/*test case that should be written is:
    1. If a note is posted, it must be attached to some Article
    2. If note is deleted, the reference to original Article must also be deleted
    3. Article should have no articles with non-existent notes
    structure to talk to this API is this:
    {
        articleId: Moongoose Id of Article
        noteText: text of note
    }
 */

router.post('/', function(req, res, next) {
    articleId = req.body.articleId;
    noteBody = req.body.noteText;


});
