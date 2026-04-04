const ansi = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  purple: "\x1b[35m",
  cyan: "\x1b[36m",
};

function colorize(color, message) {
  return (ansi[color] || "") + message + ansi.reset;
}

function logInfo(message) {
  console.log(colorize("blue", "[SERVER] " + message));
}

function logSuccess(message) {
  console.log(colorize("green", "[DB] " + message));
}

function logError(message) {
  console.error(colorize("red", "[ERROR] " + message));
}

module.exports = { ansi, colorize, logInfo, logSuccess, logError };
