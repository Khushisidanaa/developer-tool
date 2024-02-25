const WebSocket = require("ws");
const os = require("os");
const pty = require("node-pty");

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cwd: process.env.HOME,
    env: process.env,
  });

  pipeline(process.stdin, proc, (err) => err && console.warn(err.message));
  pipeline(proc, process.stdout, (err) => err && console.warn(err.message));

  ptyProcess.on("data", (data) => {
    ws.send(data);
  });

  ws.on("message", (message) => {
    ptyProcess.write(message);
  });

  ws.on("close", () => {
    ptyProcess.kill();
  });
});
