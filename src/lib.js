module.exports.findTemplate = (name) => {
  try {
    return require("./templates/" + name);
  } catch (error) {
    console.error(`Error finding template ${name}`, error);
    return null;
  }
};
