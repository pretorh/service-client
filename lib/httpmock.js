module.exports.RequestMock = RequestMock;
module.exports.ResponseMock = ResponseMock;

function ResponseMock(dataToReturn) {
    var self = this;
    self.statusCode = 200;
    self.headers = [];
    self.on = function(event, callback) {
        if (event === "data") {
            callback(new Buffer(dataToReturn));
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
