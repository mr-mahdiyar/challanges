"use client";

import { useHistoryState } from "@/hooks/useHistoryState";

export default function HistoryDemo() {
  // مقدار اولیه "شروع" و سقف تاریخچه ۵ تایی جهت تست راحت‌تر
  const { state, set, undo, redo, canUndo, canRedo } = useHistoryState<string>("Hello ", { maxHistory: 5 });

  return (
    <div style={{ padding: "24px", maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>تست هوک useHistoryState</h2>

      {/* ۱. ورودی متن برای تغییر استیت */}
      <textarea
        value={state}
        onChange={(e) => set(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          marginBottom: "12px",
        }}
      />

      {/* ۲. دکمه‌های کنترل با وضعیت disabled خودکار */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={undo}
          disabled={!canUndo}
          style={{
            padding: "8px 16px",
            cursor: canUndo ? "pointer" : "not-allowed",
            opacity: canUndo ? 1 : 0.5,
          }}
        >
          ↩️ Undo
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          style={{
            padding: "8px 16px",
            cursor: canRedo ? "pointer" : "not-allowed",
            opacity: canRedo ? 1 : 0.5,
          }}
        >
          ↪️ Redo
        </button>
      </div>

      {/* ۳. وضعیت فعلی استیت جهت دیباگ */}
      <div style={{ background: "#f5f5f5", padding: "12px", borderRadius: "8px", fontSize: "14px", color: "black" }}>
        <p style={{ margin: "4px 0" }}>
          <strong>استیت فعلی:</strong> {state}
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>قابل Undo:</strong> {canUndo ? "✅" : "❌"}
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>قابل Redo:</strong> {canRedo ? "✅" : "❌"}
        </p>
      </div>
    </div>
  );
}
