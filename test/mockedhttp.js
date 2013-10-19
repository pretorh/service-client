var assert = require("assert"),
    sc = require("../");

function mockedHttp() {
    sc.get("random url", {
        _http: function(url, callback) {
            return new sc.mocks.RequestMock(callback, new sc.mocks.ResponseMock("result from mock"));
        }
    },
    function(err, data) {
        if (err) {
            assert.fail(err);
        } else {
            assert.equal("result from mock", data);
            console.log("ok: mockedHttp");
        }
    });
};

process.nextTick(mockedHttp);
