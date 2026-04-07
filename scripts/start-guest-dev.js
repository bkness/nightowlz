const { spawn } = require("child_process");
const net = require("net");

const SERVER_PORT = Number(process.env.SERVER_PORT || 3001);
const LT_SUBDOMAIN = process.env.LT_SUBDOMAIN || "";
const LT_COMMAND = process.platform === "win32" ? "npx.cmd" : "npx";
const NPM_COMMAND = process.platform === "win32" ? "npm.cmd" : "npm";

const children = [];

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

function waitForPort(port, timeoutMs = 30_000) {
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

function waitForTunnelUrl(tunnelProcess, timeoutMs = 45_000) {
    const startedAt = Date.now();

    return new Promise((resolve, reject) => {
        const onData = (chunk) => {
            const text = chunk.toString();
            const match = text.match(/https:\/\/[\w.-]+\.loca\.lt/);
            if (match) {
                cleanup();
                resolve(match[0]);
            }
        };

        const onExit = (code) => {
            cleanup();
            reject(new Error(`localtunnel exited early with code ${code}`));
        };

        const timer = setInterval(() => {
            if (Date.now() - startedAt > timeoutMs) {
                cleanup();
                reject(new Error(`Timed out waiting for localtunnel URL after ${timeoutMs}ms`));
            }
        }, 300);

        const cleanup = () => {
            clearInterval(timer);
            tunnelProcess.stdout.off("data", onData);
            tunnelProcess.stderr.off("data", onData);
            tunnelProcess.off("exit", onExit);
        };

        tunnelProcess.stdout.on("data", onData);
        tunnelProcess.stderr.on("data", onData);
        tunnelProcess.on("exit", onExit);
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
    console.log("[guest-dev] Starting server...");
    const server = spawnManaged(NPM_COMMAND, ["--workspace", "server", "run", "dev"], {
        stdio: ["inherit", "pipe", "pipe"],
    });
    pipeOutput(server, "server");

    await waitForPort(SERVER_PORT);
    console.log(`[guest-dev] Server is up on http://localhost:${SERVER_PORT}`);

    const ltArgs = ["--yes", "localtunnel", "--port", String(SERVER_PORT)];
    if (LT_SUBDOMAIN) {
        ltArgs.push("--subdomain", LT_SUBDOMAIN);
    }

    console.log("[guest-dev] Starting localtunnel...");
    const tunnel = spawnManaged(LT_COMMAND, ltArgs, {
        stdio: ["inherit", "pipe", "pipe"],
    });
    pipeOutput(tunnel, "tunnel");

    const tunnelUrl = await waitForTunnelUrl(tunnel);
    const apiBase = `${tunnelUrl}/api`;
    console.log(`[guest-dev] API tunnel: ${apiBase}`);

    console.log("[guest-dev] Starting Expo in tunnel mode...");
    const expo = spawnManaged(NPM_COMMAND, ["--workspace", "client", "run", "start:tunnel"], {
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
        console.error(`[guest-dev] Server exited with code ${code}`);
        shutdown(code == null ? 1 : code);
    });

    tunnel.on("exit", (code) => {
        console.error(`[guest-dev] Tunnel exited with code ${code}`);
        shutdown(code == null ? 1 : code);
    });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

main().catch((error) => {
    console.error("[guest-dev] Failed:", error.message);
    shutdown(1);
});
