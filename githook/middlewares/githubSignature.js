const {
  createHmacSignature,
  compareSignatures,
} = require("../helpers/githubSignature");

const verifyGitHubSignature = (req, res, next) => {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return res.status(400).send("Missing signature");

  const hmac = "sha256=" + createHmacSignature(req);

  console.log("Received signature:", signature);
  console.log("Calculated HMAC:", hmac);

  const matched = compareSignatures(signature, hmac);

  if (!matched) return res.status(400).send("Signature mismatched.");

  next();
};

module.exports = {
  verifyGitHubSignature,
};
