var fs = require('fs');
var path = require('path');

var sourceFile = path.join(__dirname, "panel.html");
var destPath = path.join(__dirname, "../demo", "index.html");

var readStream = fs.createReadStream(sourceFile);
var writeStream = fs.createWriteStream(destPath);
readStream.pipe(writeStream);

var replace = require("replace");

readStream.on('end', () => {
    replace({
        regex: "../src/home.js",
        replacement: "./table_buster.min.js",
        paths: ['./demo/index.html'],
        recursive: false,
        silent: true,
    });
})