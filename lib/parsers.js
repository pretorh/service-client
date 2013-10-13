module.exports.plain = plain;
module.exports.json = json;

function plain(data, callback) {
    callback(null, data);
}

function json(data, callback) {
    try {
        var json = JSON.parse(data.toString());
        callback(null, json);
    } catch (err) {
        callback(err);
    }
}
