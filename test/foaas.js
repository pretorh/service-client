var assert = require("assert"),
    sc = require("../");

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
            console.log("ok: expect error");
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

process.nextTick(simple);
process.nextTick(exceptionHandling);
process.nextTick(canSpecifyHttpAccepts);