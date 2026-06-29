import net from 'node:net';

const [, , portValue, host = 'localhost'] = process.argv;
const port = Number(portValue);
const timeoutMs = 30_000;
const retryMs = 250;
const startedAt = Date.now();

if (!Number.isInteger(port) || port <= 0) {
  console.error('Usage: node scripts/wait-for-port.mjs <port> [host]');
  process.exit(1);
}

function waitForPort() {
  const socket = net.createConnection({ host, port });

  socket.once('connect', () => {
    socket.end();
    process.exit(0);
  });

  socket.once('error', () => {
    socket.destroy();

    if (Date.now() - startedAt >= timeoutMs) {
      console.error(`Timed out waiting for ${host}:${port}`);
      process.exit(1);
    }

    setTimeout(waitForPort, retryMs);
  });
}

waitForPort();
