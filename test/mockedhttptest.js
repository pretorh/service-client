var assert = require("assert"),
    sc = require("../");

function mockedHttp() {
    var builder = new sc.mocks.Builder({
        data: "result from mock"
    });
    
    sc.get("random url", {
        http: builder.httpRequest
    },
    function(err, data) {
        if (err) {
            console.log(err);
            assert.fail("mockedHttp");
        } else {
            assert.equal("result from mock", data);
            console.log("ok: mockedHttp");
        }
    });
};

function overwriteStatusCode() {
    var builder = new sc.mocks.Builder({
        statusCode: 399
    });
    
    sc.get("random url", {
        http: builder.httpRequest
    },
    function(err, data) {
        if (err) {
            assert.equal("non 2xx status code: 399", err.error.message);
            assert.equal("response", err.action);
            console.log("ok: overwriteStatusCode");
            
        } else {
            assert.fail("overwriteStatusCode");
        }
    });
};

function canDetectAndUseHttps() {
    var builder = new sc.mocks.Builder({
        data: "result from mock"
    });
    
    sc.get("https://www.google.com", {
        https: builder.httpRequest
    },
    function(err, data) {
        if (err) {
            console.log(err);
            assert.fail("canDetectAndUseHttps");
        } else {
            assert.equal("result from mock", data);
            console.log("ok: canDetectAndUseHttps");
        }
    });
};

function canOverwriteProtocol() {
    var builder = new sc.mocks.Builder({
        data: "result from mock"
    });
    
    sc.get("www.google.com", {
        https: builder.httpRequest,
        protocol: "https"
    },
    function(err, data) {
        if (err) {
            console.log(err);
            assert.fail("canOverwriteProtocol");
        } else {
            assert.equal("result from mock", data);
            console.log("ok: canOverwriteProtocol");
        }
    });
};

function canMockServiceClient() {
    var mock = sc.mocks.get({
        "test": function(callback) {
            callback(null, "hello");
        },
        "abc": function(callback) {
            callback(null, "abc");
        }
    });

    mock("test", function(err, data) {
        if (err) {
            console.log(err);
            assert.fail("canMockServiceClient");
        } else {
            assert.equal("hello", data);
            console.log("ok: canMockServiceClient: valid url 1");
        }
    });

    mock("abc", {}, function(err, data) {
        if (err) {
            console.log(err);
            assert.fail("canMockServiceClient");
        } else {
            assert.equal("abc", data);
            console.log("ok: canMockServiceClient: valid url 2");
        }
    });

    mock("not in list", function(err, data) {
        if (err) {
            console.log(err);
            console.log("ok: canMockServiceClient: invalid");
        } else {
            assert.fail("canMockServiceClient: error not returned");
        }
    });
}

process.nextTick(mockedHttp);
process.nextTick(overwriteStatusCode);
process.nextTick(canDetectAndUseHttps);
process.nextTick(canOverwriteProtocol);
process.nextTick(canMockServiceClient);
