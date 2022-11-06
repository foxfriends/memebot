module.exports.findTemplate = (name) => {
  try {
    return require("./templates/" + name);
  } catch (error) {
    return null;
  }
}
