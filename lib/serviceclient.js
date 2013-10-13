module.exports.get = function(url) {
    var options = arguments.length === 2 ? {} : arguments[1];
    var callback = arguments.length === 2 ? arguments[1] : arguments[2];
    get(url, parseOptions(options), callback);
}

var http = require("http"),
    urlparse = require("url").parse,
    defaultify = require("defaultify"),
    parsers = require("./parsers");

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
    
    var buffer;
    var received = 0;
    var length;
    
    var request = http.request(requestOptions, function(response) {
        createBuffer(response.headers["content-length"]);
        
        response.on("data", function(chunk) {
            if (length == -1) {
                resizeBuffer(received + chunk.length);
            }
            
            chunk.copy(buffer, received);
            received += chunk.length;
        });
        response.on("end", function() {
            if (length == -1) {
                length = received;
                buffer = buffer.slice(0, length);
            }
            
            process.nextTick(function() {
                options.parse(buffer, function(err, parsed) {
                    if (err) {
                        callback(err);
                    } else {
                        options.transform(parsed, callback);
                    }
                });
            });
        });
    });
    request.on("error", function(err) {
        callback(err);
    });
    request.end();
    
    function createBuffer(contentLength) {
        length = parseInt(contentLength === undefined ? -1 : contentLength);
        buffer = new Buffer(length > 0 ? length : 65536);
    }
    
    function resizeBuffer(mustBe) {
        if (buffer.length < mustBe) {
            var newLen = buffer.length * 2;
            while (newLen < mustBe) {
                newLen *= 2;
            }
            var newBuf = new Buffer(newLen);
            buffer.copy(newBuf, received);
            buffer = newBuf;
        }
    }
}

function parseOptions(options) {
    var def = {
        accept: "text/plain",
        parse: parsers.plain,
        transform: parsers.plain
    };
    var transform = {
        accept: function(val) {
            if (val === "plain" || val === "text") return "text/plain";
            if (val === "json") return "application/json";
            return val;
        },
        parse: function(val) {
            if (typeof(val) === "function") return val;
            if (val === "json") return parsers.json;
            if (val === "raw") return parsers.raw;
            throw new Error("unknown parse value " + val);
        }
    };
    
    return defaultify(options, def, transform, true).value;
}
