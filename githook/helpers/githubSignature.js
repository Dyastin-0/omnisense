const crypto = require("crypto");
const dotenv = require("dotenv").config();

const GITHUB_SECRET = process.env.GITHUB_SECRET;

const createHmacSignature = (req) => {
  return crypto
    .createHmac("sha256", GITHUB_SECRET)
    .update(req.body)
    .digest("hex");
};

const compareSignatures = (signature, comparisonSignature) => {
  if (signature.length !== comparisonSignature.length) {
    console.error(
      "Signature lengths do not match:",
      signature.length,
      comparisonSignature.length
    );
    return false;
  }

  const source = Buffer.from(signature, "hex");
  const comparison = Buffer.from(comparisonSignature, "hex");
  return crypto.timingSafeEqual(source, comparison);
};

module.exports = {
  createHmacSignature,
  compareSignatures,
};
