/**
 * Module dependencies.
 */

var express = require("express"),
    app     = module.exports = express.createServer(),
    log     = require("fs").createWriteStream(__dirname + "/db/emails.txt", { flags : "a" }),
    spawn   = require('child_process').spawn;

/**
 * Configuration
 */
app.configure(function(){
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure("development", function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure("production", function(){
  app.use(require("gzippo").staticGzip(__dirname + '/public'));
  app.use(express.errorHandler());
});

/**
 * Routes
 */
app.get("/", function(req, res) {
  res.render("index");
});

app.post("/subscribe", function(req, res) {
  if (!req.xhr) {
    return res.json({}, 417);
  }
  
  var email = req.body.email,
      valid = /^.+?@.+\.\w{2,}$/.test(email);
  
  console.log("Saving email: " + email);
  if (!valid) {
    return res.json({}, 417);
  }
  
  log.write(email + "\n");
  spawn("wget" , ["http://simple-mist-848.heroku.com/new-subscriber?email=secret_for_now", "-O", "-"]);
  return res.json({}, 200);
});

app.get("/rss", function(req, res) {
  res.redirect("http://protonet.tumblr.com/rss");
});

app.listen(app.settings.env === "production" ? 80 : 3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
