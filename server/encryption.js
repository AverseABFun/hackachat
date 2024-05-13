var crypto = require('crypto');
var random_seed = require('random-seed')

function encrypt(data, secretChannelKey, messageId) {
    const CIPHER_ALGORITHM = 'aes-256-gcm';
    var cipher = crypto.createCipheriv(CIPHER_ALGORITHM, secretChannelKey.replaceAll("-", ""), vectorGenerator(messageId, secretChannelKey), {
        authTagLength: 128
    });
    var buffer = data;
    buffer = Buffer.from(input);
    var ciphertext = cipher.update(buffer, "utf8");
    var encrypted = ciphertext.toString('base64');
    cipher.final()
    return encrypted
}

function vectorGenerator(messageId, secretChannelKey) {
    return random_seed.create(messageId+secretChannelKey).string(16)
}