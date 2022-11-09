const sharp = require("sharp");
const got = require("got");
const { complement, startsWith } = require("ramda");
const { parseArgs } = require("../../lib/args");

async function loadCard(tokenId) {
  try {
    return await got
      .get(`https://api.parallelnft.com/api/v1/cards/${tokenId}/`)
      .json();
  } catch (error) {
    throw new Error(`Card ${tokenId} could not be loaded.`);
  }
}

module.exports = async (command) => {
  const [args, params] = parseArgs(command);

  const imageBuffer = sharp();

  const fromCard = params.name?.slice(5) ?? "7";
  const card = await loadCard(fromCard);
  got.stream(card.image_url).pipe(imageBuffer);

  const composites = [];

  const title = args.join(" ");
  if (title) {
    const nameImage = Buffer.from(`
      <svg width="600" height="900">
        <rect fill="black" x="36" y="824" width="400" height="24"></rect>
        <text fill="white" x="40" y="850" font-size="18" font-family="sans-serif" text-anchor="left" font-weight="500">${title.toUpperCase()}</text>
      </svg>
    `);
    composites.push({
      input: nameImage,
      left: 0,
      top: 0,
      gravity: "northwest",
    });
  }

  const newImage = params.image?.slice(6);
  if (newImage) {
    const crop = sharp();

    got.stream(newImage).pipe(crop);

    composites.push({
      input: await crop
        .resize({
          width: 600,
          height: 750,
          fit: "cover",
        })
        .png()
        .toBuffer(),
      gravity: "northwest",
      left: 0,
      top: 0,
    });
  }

  return imageBuffer.composite(composites).png().toBuffer();
};
