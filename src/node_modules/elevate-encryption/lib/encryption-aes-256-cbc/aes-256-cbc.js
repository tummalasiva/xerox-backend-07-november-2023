/**
 * name : aes-256-cbc encryprion algorthim
 * author : Ankit Shahu
 * Date : 12/Oct/2022
 * Description : Implemented AES Encryption
 */

const crypto = require("crypto");
const algorithm = "aes-256-cbc";

const aes256cbc = {};

aes256cbc.init = async (key, iv) => {
  this.key = Buffer.from(key, "base64");
  this.iv = Buffer.from(iv, "base64");
};

aes256cbc.encrypt = (text) => {
  let cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(this.key, "base64"),
    this.iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("base64");
};

// Decrypting text
aes256cbc.decrypt = (text) => {
  let encryptedText = Buffer.from(text, "base64");
  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(this.key),
    this.iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = aes256cbc;
