const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const { App } = require("@slack/bolt");
const { findTemplate } = require("./lib");
const {
  SLACK_SIGNING_SECRET,
  SLACK_BOT_TOKEN,
  SLACK_APP_TOKEN,
  IS_DEV,
} = require("./env");

const app = new App({
  signingSecret: SLACK_SIGNING_SECRET,
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  developerMode: IS_DEV,
  port: 3000,
});

function slugify(string) {
  return string.replace(/[^a-zA-Z0-9_-]/, "-").replace(/-+/, "-");
}

app.command("/meme", async ({ command, ack, say, respond }) => {
  await ack();

  const [templateName, ...arguments] = command.text.split(" ");
  const template = findTemplate(templateName);
  if (!template) {
    return respond({
      response_type: "ephemeral",
      text: `${templateName} is not a good enough meme, please use a better one.`,
    });
  }

  try {
    const imageBuffer = await template(command.text);

    await app.client.files.upload({
      channels: command.channel_id,
      filename: `${slugify(command.text)}.png`,
      file: imageBuffer,
      filetype: "png",
    });
  } catch (error) {
    return respond({
      response_type: "ephemeral",
      text: error.message,
    });
  }
});

(async () => {
  await app.start();
  console.log("Memebot started.");
})();
