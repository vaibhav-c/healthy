var http = require('http');
var express = require('express');
app = express();
var fs = require('fs');

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/index.html');
});
/*var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    var read = fs.createReadStream('C:/Users/Lenovo/Desktop/Hackathon/Hackathon/health/index.html', 'utf8');
    read.pipe(res);
});*/
server.listen(3000, '127.0.0.1');
console.log('Hey')