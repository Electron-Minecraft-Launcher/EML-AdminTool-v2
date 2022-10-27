var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

// Create link to Angular build directory. The `ng build` command will save the result under the `dist` folder.
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("API is running on port", port);
});
