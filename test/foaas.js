var assert = require("assert"),
    http = require("http"),
    sc = require("../");
var testLocalPortMin = 8080;

/*
 * setup
*/
var server = http.createServer(function (req, res) {
    res.write("hello");
    res.end();
});
server.timeout = 2500;
server.listen(testLocalPortMin);

var serverReponseErr = http.createServer(function (req, res) {
    res.writeHead(500);
    res.end();
});
serverReponseErr.timeout = 2500;
serverReponseErr.listen(testLocalPortMin + 1);

/*
 * tests
*/

function simple() {
    sc.get("http://foaas.com/off/Tom/Chris", function(err, text) {
        if (err) {
            assert.fail(err);
        } else {
            assert.equal("Fuck off, Tom. - Chris", text);
            console.log("ok: simple");
        }
    });
}

function exceptionHandling() {
    sc.get("not really a url", function(err, text) {
        if (err) {
            assert.equal("request", err.action);
            console.log("ok: exceptionHandling");
        } else {
            assert.fail("no error returned");
        }
    });
}

function canSpecifyHttpAccepts() {
    sc.get("http://foaas.com/off/Tom/Chris", {
            accept: "json"
        },
        function(err, text) {
            if (err) {
                assert.fail(err);
            } else {
                assert.equal("{\"message\":\"Fuck off, Tom.\",\"subtitle\":\"- Chris\"}", text);
                console.log("ok: canSpecifyHttpAccepts");
            }
        });
}

function canParseJson() {
    sc.get("http://foaas.com/off/Tom/Chris", {
            accept: "json",
            parse: "json"
        },
        function(err, json) {
            if (err) {
                assert.fail(err);
            } else {
                assert.equal("Fuck off, Tom.", json.message);
                assert.equal("- Chris", json.subtitle);
                console.log("ok: canParseJson");
            }
        });
}

function canTransformResult() {
    sc.get("http://foaas.com/off/Tom/Chris", {
            accept: "json",
            parse: "json",
            transform: function(data, callback) {
                callback(null, data.message);
            }
        },
        function(err, text) {
            if (err) {
                assert.fail(err);
            } else {
                assert.equal("Fuck off, Tom.", text);
                console.log("ok: canTransformResult");
            }
        });
}

function canConnectToPort() {
    sc.get("http://127.0.0.1:" + testLocalPortMin, function(err, text) {
        server.close();
        console.log("ok: canConnectToPort");
    });
}

function canHandleResponseErrors() {
    sc.get("http://127.0.0.1:" + (testLocalPortMin + 1), function(err, text) {
        serverReponseErr.close();
        if (err) {
            assert.equal("response", err.action);
            console.log("ok: canHandleResponseErrors");
        } else {
            assert.fail("expected error");
        }
    });
}

function callbackGetsErrorsOfParseFunction() {
    sc.get("http://127.0.0.1:" + testLocalPortMin, {
            parse: function() { throw new Error("test parse error"); }
        },
        function(err, text) {
            if (err) {
                assert.equal("test parse error", err.error.message);
                assert.equal("parse", err.action);
                console.log("ok: callbackGetsErrorsOfParseFunction");
                console.log(err);
            } else {
                assert.fail("expected error");
            }
        });
}

/*
 * start
*/

process.nextTick(simple);
process.nextTick(exceptionHandling);
process.nextTick(canSpecifyHttpAccepts);
process.nextTick(canParseJson);
process.nextTick(canTransformResult);
process.nextTick(canConnectToPort);
process.nextTick(canHandleResponseErrors);
process.nextTick(callbackGetsErrorsOfParseFunction);
