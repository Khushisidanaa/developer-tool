import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

const XtermComponent = () => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal();
    terminal.open(terminalRef.current);

    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      terminal.onData((data) => ws.send(data));
      ws.onmessage = (event) => terminal.write(event.data);
    };

    return () => {
      terminal.dispose();
      ws.close();
    };
  }, []);

  return <div ref={terminalRef} style={{ height: "100%", width: "100%" }} />;
};

export default XtermComponent;
