const sharp = require("sharp");
const path = require("path");
const { range } = require("ramda");
const { parseArgs } = require("../../lib/args");

const HEIGHT = 64;
const WIDTH = 64;
const HUMP_WIDTH = 13;
const BASE_WIDTH = WIDTH - HUMP_WIDTH;

module.exports = async (command) => {
  const [[humpstr]] = parseArgs(command);
  const humps = +humpstr;
  if (Number.isNaN(humps) || humps === 0) {
    throw new Error("Must provide a number of humps > 0");
  }

  const width = (humps - 1) * HUMP_WIDTH + BASE_WIDTH;
  const imageBuffer = await sharp({
    create: {
      width: width,
      height: HEIGHT,
      channels: 4,
      background: "#ffffff00",
    },
  })
    .composite([
      { input: path.join(__dirname, "head.png"), left: 0, top: 0 },
      ...range(0, humps - 1).map((i) => ({
        input: path.join(__dirname, "hump.png"),
        left: i * 13,
        top: 0,
      })),
      { input: path.join(__dirname, "tail.png"), left: width - WIDTH, top: 0 },
    ])
    .png()
    .toBuffer();

  return imageBuffer;
};
