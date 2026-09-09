import React from "react";
import Icon from "./Icon";

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-sm font-semibold shadow-2xl animate-float-up flex items-center gap-2.5 pointer-events-none"
      style={{
        background: "var(--brown)",
        color: "#f4e6d2",
        border: "1px solid rgba(244, 230, 210, 0.2)",
      }}
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--green)", color: "#fff" }}>
        <Icon name="check" size={12} />
      </span>
      <span>{message}</span>
    </div>
  );
}

export default Toast;
