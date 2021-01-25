var fs = require('fs');
var path = require('path');

var sourceFile = path.join(__dirname, "panel.html");
var destPath = path.join(__dirname, "../demo", "index.html");

var readStream = fs.createReadStream(sourceFile);
var writeStream = fs.createWriteStream(destPath);
readStream.pipe(writeStream);