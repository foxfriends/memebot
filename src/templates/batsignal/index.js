const sharp = require("sharp");
const path = require("path");

module.exports = async (command) => {
  const [, ...args] = command.split(" ");
  const content = args.filter((x) => x).join(" ");

  if (!content) {
    throw new Error("batsignal requires some text");
  }

  const text = Buffer.from(`
    <svg width="600" height="450">
      <text x="290" y="180" font-size="60" font-family="sans-serif" text-anchor="middle" fill="yellow">${content}</text>
    </svg>
  `);
  const imageBuffer = await sharp(path.join(__dirname, "batsignal.png"))
    .composite([
      {
        input: text,
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toBuffer();

  return imageBuffer;
};
