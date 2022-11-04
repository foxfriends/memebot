const { App } = require("@slack/bolt");
const {
  SLACK_SIGNING_SECRET,
  SLACK_BOT_TOKEN,
  SLACK_APP_TOKEN,
} = require("./env");

const app = new App({
  signingSecret: SLACK_SIGNING_SECRET,
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
  developerMode: true,
  port: 3000,
});

app.command("/meme", async ({ ack, say }) => {
  await ack();
  await say("Hello Jordan");
});

(async () => {
  await app.start();
  console.log("Memebot started.");
})();
