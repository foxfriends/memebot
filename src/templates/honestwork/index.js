const sharp = require("sharp");
const path = require("path");
const { parseArgs } = require("../../lib/args");

module.exports = async (command) => {
  const [args, params] = parseArgs(command);

  const title = args.join(" ");

  const text = Buffer.from(`
    <svg width="800" height="200">
      <text x="16" y="16" font-size="60" font-family="sans-serif" text-anchor="middle" fill="black">${title}</text>
    </svg>
  `);
  const imageBuffer = await sharp({
    create: {
      width: 800,
      height: 532 + 200,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite([
      { input: path.join(__dirname, "farmer.png"), left: 0, top: 200 },
      {
        input: {
          text: {
            text: title,
            font: "sans-serif",
            width: 800 - 32,
            height: 200 - 32,
            rgba: true,
          },
        },
        left: 16,
        top: 16,
      },
    ])
    .png()
    .toBuffer();

  return imageBuffer;
};
