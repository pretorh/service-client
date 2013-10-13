var assert = require("assert"),
    sc = require("../");

function simple() {
    sc.get("http://foaas.com/off/Tom/Chris", function(err, text) {
        if (err) {
            assert.fail(err);
        } else {
            assert.equal("Fuck off, Tom. - Chris", text);
        }
    });
}

process.nextTick(simple);
