const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const { verifyGitHubSignature } = require("./middlewares/githubSignature");
const { runCommandsInShell } = require("./helpers/childExec");

const app = express();
app.use(bodyParser.raw({ type: "application/json" }));

const hasChangesInDirectory = (commits, directory) => {
  return commits.some((commit) =>
    commit.modified
      .concat(commit.added, commit.removed)
      .some((file) => file.startsWith(directory))
  );
};

const updateAndRestartServices = (commits) => {
  const commands = ["cd .. && git pull"];

  if (hasChangesInDirectory(commits, "githook/")) {
    console.log("githook/");
    commands.push("cd githook && npm install && cd ..");
    commands.push("sudo systemctl restart omnisensegithook.service");
  }

  if (hasChangesInDirectory(commits, "client/")) {
    console.log("client/");
    commands.push("cd client && npm install && npm run build && cd ..");
    commands.push("sudo systemctl restart omnisenseclient.service");
  }

  if (commands.length > 1) {
    commands.push("sudo systemctl restart caddy");
    runCommandsInShell(commands);
  } else {
    console.log("No relevant changes detected, no services restarted.");
  }
};

app.get("/", (_, res) => res.sendStatus(200));

app.post("/githook", verifyGitHubSignature, (req, res) => {
  try {
    const payload = JSON.parse(req.body);
    const commits = payload.commits || [];
    updateAndRestartServices(commits);
    res.status(200).send("Success");
  } catch (error) {
    console.error("Failed to update services:", error);
    res.status(500).send("Failed to update services.");
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening for webhooks on port ${PORT}`);
});
