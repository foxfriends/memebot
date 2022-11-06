require("dotenv").config();

module.exports.SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
module.exports.SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
module.exports.SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
module.exports.PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
module.exports.IS_DEV = process.env.NODE_ENV === "development";
