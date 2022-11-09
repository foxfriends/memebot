function parseSegment(segment) {
  if (/^\w+:/.test(segment)) {
    const [name] = segment.split(":", 1);
    const value = segment.slice(name.length + 1);
    return [name, value];
  }
  return segment;
}

function* doParseArgs(contents) {
  let quoted = false;
  let escaped = false;
  let segment = "";
  for (const char of contents) {
    if (escaped) {
      segment += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (quoted) {
      if (char === '"') {
        quoted = false;
        yield segment;
        segment = "";
      } else {
        segment += char;
      }
      continue;
    }

    if (/\s/.test(char)) {
      if (segment) {
        yield segment;
        segment = "";
      }
      continue;
    }

    if (char === '"' && !segment) {
      quoted = true;
      continue;
    }

    segment += char;
  }
  if (segment) {
    yield segment;
  }
}

module.exports.parseArgs = (contents, sep = " ") => {
  const args = [];
  const params = {};
  const segments = [...doParseArgs(contents)];
  for (const segment of segments.map(parseSegment)) {
    if (typeof segment === "string") {
      args.push(segment);
    } else {
      const [name, value] = segment;
      params[name] = value;
    }
  }

  const [command, ...actualArgs] = args;

  return [actualArgs, params, segments, command];
};
