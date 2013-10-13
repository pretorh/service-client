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

function canConnectToPort() {
    sc.get("http://127.0.0.1:" + testLocalPortMin, function(err, text) {
        console.log("ok: canConnectToPort");
    });
}

function canHandleResponseErrors() {
    sc.get("http://127.0.0.1:" + (testLocalPortMin + 1), function(err, text) {
        if (err) {
            assert.equal("response", err.action);
            console.log("ok: canHandleResponseErrors");
            console.log(err);
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

process.nextTick(exceptionHandling);
process.nextTick(canConnectToPort);
process.nextTick(canHandleResponseErrors);
process.nextTick(callbackGetsErrorsOfParseFunction);

setTimeout(function() {
    serverReponseErr.close();
    server.close();
}, 500);
