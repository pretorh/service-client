module.exports.get = function(url) {
    var options = arguments.length === 2 ? {} : arguments[1];
    var callback = arguments.length === 2 ? arguments[1] : arguments[2];
    get(url, parseOptions(options), callback);
}

var http = require("http"),
    https = require("https"),
    urlparse = require("url").parse,
    defaultify = require("defaultify"),
    parsers = require("./parsers");

function get(url, options, callback) {
    var urlinfo = urlparse(url);
    var requestOptions = {
        hostname: urlinfo.hostname,
        path: urlinfo.path,
        method: "GET",
        port: urlinfo.port ? urlinfo.port : 80,
        headers: {
            accept: options.accept
        }
    };
    
    var buffer;
    var received = 0;
    var length;
    var parsed;
    
    function start() {
        if (options.protocol == "") {
            options.protocol = urlinfo.protocol;
        }
        var request;
        if (options.protocol === "https") {
            request = options._https(requestOptions, onResponse);
        } else {
            request = options._http(requestOptions, onResponse);
        }
        request.on("error", function(err) { onError("request", err) });
        request.end();
    }
    
    function onResponse(response) {
        if (Math.floor(response.statusCode / 100) != 2) {
            onError("response", new Error("non 2xx status code: " + response.statusCode));
        } else {
            createBuffer(response.headers["content-length"]);
            response.on("data", onData);
            response.on("end", onEnd);
        }
    }
    
    function onData(chunk) {
        if (length == -1)
            resizeBuffer(received + chunk.length);
        chunk.copy(buffer, received);
        received += chunk.length;
    }
    
    function onEnd() {
        if (length == -1) {
            length = received;
            buffer = buffer.slice(0, length);
        }
        process.nextTick(parse);
    }
    
    function parse() {
        try {
            options.parse(buffer, function(err, data) {
                if (err) {
                    onError("parse", err);
                } else {
                    parsed = data;
                    process.nextTick(transform);
                }
            });
        } catch (e) {
            onError("parse", e);
        }
    }
    
    function transform() {
        try {
            options.transform(parsed, function (err, transformed) {
                if (err) {
                    onError("transform", err);
                } else {
                    doCallback(null, transformed);
                }
            });
        } catch (e) {
            onError("transform", e);
        }
    }
    
    function onError(action, err) {
        doCallback({
            error: err,
            action: action,
            length: length,
            received: received,
            buffer: buffer,
            parsed: parsed
        });
    }
    
    function doCallback(err, data) {
        process.nextTick(function() {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
    }
    
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
    
    process.nextTick(start);
}

function parseOptions(options) {
    var def = {
        accept: "text/plain",
        parse: parsers.plain,
        transform: parsers.plain,
        protocol: "",
        _http: http.request,
        _https: https.request
    };
    var transform = {
        accept: function(val) {
            if (val === "plain" || val === "text") return "text/plain";
            if (val === "json") return "application/json";
            if (val === "xml") return "application/xml";
            return val;
        },
        parse: function(val) {
            if (typeof(val) === "function") return val;
            if (val === "json") return parsers.json;
            if (val === "raw") return parsers.plain;
            throw new Error("unknown parse value " + val);
        },
        protocol: function(val) {
            if (val === "http") return "http";
            if (val === "https") return "https";
            throw new Error("unknown protocol " + val);
        }
    };
    
    return defaultify(options, def, transform, true).value;
}
