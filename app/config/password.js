var crypto = require('crypto');

var SaltLength = 9;
function createSalt() {
    return generateSalt(SaltLength);
}
function createHash(salt, password) {
    return md5(password + salt);
}

function validateHash(hash, salt, password) {
    var validHash = md5(password + salt);
    return hash === validHash;
}

function generateSalt(len) {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
        setLen = set.length,
        salt = '';
    for (var i = 0; i < len; i++) {
        var p = Math.floor(Math.random() * setLen);
        salt += set[p];
    }
    return salt;
}

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

module.exports = {
    'hash': createHash,
    'salt': createSalt,
    'validate': validateHash
};