var assert = require("assert"),
    sc = require("../");

function mockedHttp() {
    var builder = new sc.mocks.Builder({
        data: "result from mock"
    });
    
    sc.get("random url", {
        _http: builder.httpRequest
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
        _http: builder.httpRequest
    },
    function(err, data) {
        if (err) {
            //assert.equal();
            assert.equal("non 2xx status code: 399", err.error.message);
            assert.equal("response", err.action);
            console.log("ok: overwriteStatusCode");
            
        } else {
            assert.fail("overwriteStatusCode");
        }
    });
};

process.nextTick(mockedHttp);
process.nextTick(overwriteStatusCode);
