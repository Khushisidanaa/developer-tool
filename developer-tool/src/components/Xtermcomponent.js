import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

const XtermComponent = () => {
  const terminalRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      const terminal = new Terminal();
      if (terminalRef.current) {
        terminal.open(terminalRef.current);
      }

      const ws = new WebSocket("ws://localhost:8080");
      ws.onopen = () => {
        console.log("WebSocket connected.");
        terminal.onData((data) => ws.send(data));
        ws.onmessage = (event) => terminal.write(event.data);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event);
      };

      return () => {
        terminal.dispose();
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    });
  }, []);

  return <div ref={terminalRef} style={{ height: "100%", width: "100%" }} />;
};

export default XtermComponent;
