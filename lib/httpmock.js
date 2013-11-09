module.exports.Builder = Builder;
module.exports.RequestMock = RequestMock;
module.exports.ResponseMock = ResponseMock;
module.exports.get = getMock;

var defaultify = require("defaultify");

function Builder(options) {
    var self = this;

    var opts = defaultify(options, {
        statusCode: 200,
        data: ""
    }, true).value;
    
    self.httpRequest = function(url, callback) {
        var response = new ResponseMock(opts.data);
        response.statusCode = opts.statusCode;
        return new RequestMock(callback, response);
    }
    
}

function ResponseMock(dataToReturn) {
    var self = this;
    self.statusCode = 200;
    self.headers = [];
    self.on = function(event, callback) {
        if (event === "data") {
            callback(new Buffer(dataToReturn ? dataToReturn : 0));
            dataSent = true;
        } else if (event === "end") {
            endCallback = callback;
        }
        
        if (dataSent && endCallback) {
            endCallback();
        }
    }
    
    var dataSent = false;
    var endCallback = null;
}

function RequestMock(requestCallback, response) {
    var self = this;
    self.on = function(event, callback) {
    }
    self.end = function() {
        requestCallback(response);
    }
}

function getMock(options) {
    return function(url, opts, callback) {
        if (arguments.length == 2 && typeof(opts) == "function") {
            callback = opts;
        }

        if (options[url]) {
            options[url](callback);
        } else {
            callback("url not mocked: " + url);
        }
    }
}
