// Our scraping tools
var express = require('express');
var request = require("request");
var cheerio = require("cheerio");
var Article = require("../models/Article.js")

var router = express.Router();

router.get('/', function(req, res) {

  request("https://www.nytimes.com", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    var result = [];

    // Now, we grab every h2 within an article tag, and do the following:
    $(".first-column-region .collection article").each(function (i, element) {

      // Save an empty result object
      var article = {};

      // Add the text and href of every link, and save them as properties of the result object
      article.title = $(this).children("h2").text();
      article.post = $(this).children(".summary").text();

      console.log("ENTRY NEW :", article);

      if (article.post !== "") {
        result.push(article);
      }

    });
    res.status(200).render("scrape", {"articles": result});
  });

});
router.get('/summary.json', function (req, res) {
    request("https://www.nytimes.com", function (error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        var result = [];

        // Now, we grab every h2 within an article tag, and do the following:
        $(".first-column-region .collection article").each(function (i, element) {

            // Save an empty result object
            var article = {};

            // Add the text and href of every link, and save them as properties of the result object
            article.title = $(this).children("h2").text();
            article.post = $(this).children(".summary").text();

            console.log("ENTRY NEW :", article);

            if (article.post !== "") {
                result.push(article);
            }

        });
        res.status(200).json(result);
    });
});

module.exports = router;