const net = require("net");
const { spawn } = require("child_process");

const extraArgs = process.argv.slice(2);

const START_PORT = Number(process.env.EXPO_START_PORT || 8081);
const MAX_PORT = Number(process.env.EXPO_MAX_PORT || 8100);

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port);
  });
}

async function findOpenPort(start, max) {
  for (let port = start; port <= max; port += 1) {
    // Probe each port sequentially to avoid races.
    // eslint-disable-next-line no-await-in-loop
    if (await canListen(port)) {
      return port;
    }
  }

  throw new Error(`No open port found between ${start} and ${max}.`);
}

async function main() {
  const port = await findOpenPort(START_PORT, MAX_PORT);

  console.log(`[expo] Using port ${port}`);

  const child = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["expo", "start", "--port", String(port), ...extraArgs],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        CI: "1",
      },
    },
  );

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code == null ? 1 : code);
  });
}

main().catch((error) => {
  console.error("[expo] Failed to start:", error.message);
  process.exit(1);
});
