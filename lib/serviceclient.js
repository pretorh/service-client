module.exports.get = function(url) {
    var options = arguments.length === 2 ? {} : arguments[1];
    var callback = arguments.length === 2 ? arguments[1] : arguments[2];
    get(url, parseOptions(options), callback);
}

var http = require("http"),
    urlparse = require("url").parse,
    defaultify = require("defaultify");

function get(url, options, callback) {
    var urlinfo = urlparse(url);
    var requestOptions = {
        hostname: urlinfo.hostname,
        path: urlinfo.path,
        methods: "GET",
        headers: {
            accept: options.accept
        }
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

function parseOptions(options) {
    var def = {
        accept: "text/plain"
    };
    var transform = {
        accept: function(val) {
            if (val === "plain" || val === "text") return "text/plain";
            if (val === "json") return "application/json";
            return val;
        }
    };
    
    return defaultify(options, def, transform, true).value;
}
