module.exports.get = get;

var http = require("http"),
    urlparse = require("url").parse;

function get(url, callback) {
    var urlinfo = urlparse(url);
    var requestOptions = {
        hostname: urlinfo.hostname,
        path: urlinfo.path,
        methods: "GET"
    };
    
    var request = http.request(requestOptions, function(response) {
        var len = parseInt(response.headers["content-length"]);
        len = len ? len : 1048576;
        var buffer = new Buffer(len);
        var received = 0;
        
        response.on("data", function(chunk) {
            chunk.copy(buffer, received);
            received += chunk.length;
        });
        response.on("end", function() {
            callback(null, buffer.toString());
        });
    });
    request.on("error", function(err) {
        callback(err);
    })
    request.end();
}
