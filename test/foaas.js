var assert = require("assert"),
    sc = require("../");

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

/*
 * start
*/

process.nextTick(simple);
process.nextTick(canSpecifyHttpAccepts);
process.nextTick(canParseJson);
process.nextTick(canTransformResult);
