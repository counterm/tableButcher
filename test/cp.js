var fs = require('fs');
var path = require('path');
var replace = require("replace");

function copyToDemo(nameFrom) {
    var sourceFile = path.join(__dirname, nameFrom);
    var destPath = path.join(__dirname, "../demo", nameFrom);
    var readStream = fs.createReadStream(sourceFile);
    var writeStream = fs.createWriteStream(destPath);
    readStream.pipe(writeStream);

    if (nameFrom.indexOf('.html') > -1) {
        readStream.on('end', () => {
            replace({
                regex: "../src/home.js",
                replacement: "./table_buster.min.js",
                paths: ['./demo/' + nameFrom],
                recursive: false,
                silent: true,
            });
        })
    }
}

copyToDemo('panel.html')
copyToDemo('vue.html')
copyToDemo('nanny.js')

// var sourceFile = path.join(__dirname, "panel.html");
// var destPath = path.join(__dirname, "../demo", "index.html");
// var readStream = fs.createReadStream(sourceFile);
// var writeStream = fs.createWriteStream(destPath);
// readStream.pipe(writeStream);
