
/**
 * Module dependencies.
 */
require.paths.unshift("/usr/local/lib/node_modules/");

var express = require("express"),
    fs      = require("fs"),
    app     = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + "/public"));
});

app.configure("development", function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure("production", function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get("/", function(req, res) {
  res.render("index");
});

app.post("/subscribe", function(req, res) {
  if (!req.xhr) {
    return res.json({}, 417);
  }
  
  var email = req.body.email,
      valid = /^.+?@.+\.\w{2,}$/.test(email);
  if (!valid) {
    return res.json({}, 417);
  }
  
  fs.open(__dirname + "/db/emails.txt", "a", 777, function(e, id) {
    fs.write(id, email + "\n", null, "utf8", function(){
      fs.close(id);
      res.json({}, 200);
    });
  });
});

app.get("/rss", function(req, res) {
  res.redirect("http://protonet.tumblr.com/rss");
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
