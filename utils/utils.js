const crypto = require("crypto");
exports.generateOtp = () => crypto.randomInt(100000, 999999).toString();
exports.expiredTime = () => {
  const expiresAtMs = Date.now() + 5 * 60 * 1000;
  const expiresAtDate = new Date(expiresAtMs);
  return expiresAtDate;
};
