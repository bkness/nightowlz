const { spawn } = require("child_process");
const net = require("net");
const os = require("os");

const SERVER_PORT = Number(process.env.SERVER_PORT || 3001);
const NPM_COMMAND = process.platform === "win32" ? "npm.cmd" : "npm";

const children = [];

function getLanIPv4() {
    const interfaces = os.networkInterfaces();
    const preferred = ["en0", "en1", "Ethernet", "Wi-Fi"];

    const all = [];
    for (const [name, addrs] of Object.entries(interfaces)) {
        for (const addr of addrs || []) {
            if (addr && addr.family === "IPv4" && !addr.internal) {
                all.push({ name, address: addr.address });
            }
        }
    }

    for (const candidateName of preferred) {
        const match = all.find((entry) => entry.name === candidateName);
        if (match) return match.address;
    }

    return all[0]?.address || null;
}

function spawnManaged(command, args, options = {}) {
    const child = spawn(command, args, {
        stdio: "pipe",
        env: process.env,
        ...options,
    });

    children.push(child);
    return child;
}

function pipeOutput(child, label) {
    child.stdout.on("data", (chunk) => {
        process.stdout.write(`[${label}] ${chunk}`);
    });

    child.stderr.on("data", (chunk) => {
        process.stderr.write(`[${label}] ${chunk}`);
    });
}

function waitForPort(port, timeoutMs = 30000) {
    const startedAt = Date.now();

    return new Promise((resolve, reject) => {
        const tryConnect = () => {
            const socket = net.createConnection({ port, host: "127.0.0.1" });

            socket.once("connect", () => {
                socket.end();
                resolve();
            });

            socket.once("error", () => {
                socket.destroy();
                if (Date.now() - startedAt > timeoutMs) {
                    reject(new Error(`Server on port ${port} did not become ready within ${timeoutMs}ms`));
                    return;
                }
                setTimeout(tryConnect, 400);
            });
        };

        tryConnect();
    });
}

function shutdown(exitCode = 0) {
    for (const child of children) {
        if (!child.killed) {
            child.kill("SIGTERM");
        }
    }
    process.exit(exitCode);
}

async function main() {
    const lanIp = process.env.LAN_IP || getLanIPv4();

    if (!lanIp) {
        throw new Error("Could not detect LAN IP. Set LAN_IP manually and retry.");
    }

    const apiBase = `http://${lanIp}:${SERVER_PORT}/api`;

    console.log("[home-dev] Starting server...");
    const server = spawnManaged(NPM_COMMAND, ["--workspace", "server", "run", "start"], {
        stdio: ["inherit", "pipe", "pipe"],
    });
    pipeOutput(server, "server");

    await waitForPort(SERVER_PORT);
    console.log(`[home-dev] Server is up on http://localhost:${SERVER_PORT}`);
    console.log(`[home-dev] Mobile API base URL: ${apiBase}`);
    console.log("[home-dev] Make sure phone and laptop are on the same Wi-Fi.");

    const expo = spawnManaged(NPM_COMMAND, ["--workspace", "client", "run", "start"], {
        stdio: ["inherit", "pipe", "pipe"],
        env: {
            ...process.env,
            EXPO_PUBLIC_API_BASE_URL: apiBase,
        },
    });
    pipeOutput(expo, "expo");

    expo.on("exit", (code) => {
        shutdown(code == null ? 1 : code);
    });

    server.on("exit", (code) => {
        console.error(`[home-dev] Server exited with code ${code}`);
        shutdown(code == null ? 1 : code);
    });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

main().catch((error) => {
    console.error("[home-dev] Failed:", error.message);
    shutdown(1);
});
