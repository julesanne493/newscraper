var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect((MONGODB_URI));

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/articles", function(req, res) {
  axios.get("https://www.wsj.com/").then(function(response) {

var $ = cheerio.load(response.data);

$("div.wsj-card-body").each(function(i, element) {

  var result = {};
  console.log($(this));
  result.title = $(element).children("h3.wsj-headline").text();
  result.link = $(element).children("h3.wsj-headline").children("a.wsj-headline-link").attr("href");
  result.summary = $(element).children("p.wsj-summary").children("span").text();

  db.Article.create(result)
    .then(function(dbArticle) {
      console.log(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

res.send();
});
  db.Article.find({})
  .then(function(data){
    res.json(data)
  })
    .catch(function(err){
      res.json(err);
    });
  });

app.get("/articles/:id", function(req, res) {

  db.Article.findOne({_id: req.params.id})
  .populate("note")
  .then(function(article){
    res.json(article);
  })
  .catch(function(err){
    res.json(err);
  })
  });

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote){
        return db.Article.findOneAndUpdate({ _id: req.params.id}, {note: dbNote._id}, {new: true});
      })
      .then(function(dbArticle){
        res.json(dbArticle)
      })
      .catch(function(err){
        res.json(err);
      })

});



app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
