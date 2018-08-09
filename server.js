var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect("mongodb:julesanne493@gmail.com:Linus616@ds235418.mlab.com:35418/heroku_ctq15v7s");

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/scrape", function(req, res) {

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

    res.send("Scrape Complete");
  });
  
});

app.get("/articles", function(req, res) {
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
  });
  });

  

app.post("/articles/:id", function(req, res) {
  id = req.params.id;

    db.Note.create(req.body)
      .then(function(dbNote){
        return(db.Article.findOneAndUpdate({ _id: req.params.id}, { $set: {note: dbNote._id} }, {new: true}));

      });

    db.Article.find({_id: req.params.id})
      .update("Note")
      .then(function(data){
        res.json(data);
      });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
