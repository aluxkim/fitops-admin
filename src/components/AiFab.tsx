import { useCallback, useRef, useState, useEffect } from "react";

const AI_RESPONSES = [
  "Class attendance is down 6% network-wide this month. Tuesday 6pm HIIT at Downtown has the steepest drop — consider a targeted Instagram push with UTM spring-hiit.",
  "Top 3 locations by check-in growth: Austin Central (+12%), Denver Central (+9%), Nashville Central (+7%). Boston is flat — worth investigating staffing hours.",
  "8 memberships expire in the next 14 days across your scoped locations. Sending a renewal reminder campaign could retain ~60% based on past data.",
  "Your retail attach rate is 18%. Members attending 6+ classes buy merchandise 2.3× more often — try cross-selling bottles near studio exits.",
  "PT no-show rate at Seattle Central is 14% vs 8% network average. A 24-hour cancellation reminder SMS has reduced no-shows by 40% at other clubs.",
  "Based on current trends, projected MRR next month is up ~3.8%. Family plan signups are driving growth — consider a referral incentive.",
];

type Msg = { role: "bot" | "user"; text: string };

export function AiFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm your FitOps AI assistant. Ask me about attendance trends, membership metrics, staff scheduling, or marketing ideas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const respIdx = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = AI_RESPONSES[respIdx.current % AI_RESPONSES.length];
    respIdx.current++;
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    }, 900 + Math.random() * 600);
  }, [input]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 100,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#e60023",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 14px rgba(230,0,35,0.35)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 150ms ease, box-shadow 150ms ease",
        }}
      >
        {open ? (
          <svg width={26} height={26} viewBox="0 0 24 24" fill="#fff">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg width={26} height={26} viewBox="0 0 24 24" fill="#fff">
            <path d="M12 2C6.48 2 2 6.04 2 11c0 2.58 1.22 4.89 3.13 6.46V22l4.06-2.19c.88.25 1.82.38 2.81.38 5.52 0 10-4.04 10-9S17.52 2 12 2zm1.07 12.14l-2.54-2.72-4.96 2.72L10.73 9l2.6 2.72L18.2 9l-5.13 5.14z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 28,
            zIndex: 101,
            width: 380,
            maxHeight: 520,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "aiSlideUp 180ms ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid #ddd",
              background: "#f9f9f9",
            }}
          >
            <strong style={{ fontSize: "0.95rem" }}>FitOps AI</strong>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
                color: "#5f5f5f",
                padding: 4,
                borderRadius: 6,
              }}
            >
              ✕
            </button>
          </div>
          <div
            ref={bodyRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  maxWidth: "90%",
                  padding: "10px 14px",
                  borderRadius: 14,
                  fontSize: "0.88rem",
                  lineHeight: 1.45,
                  ...(m.role === "bot"
                    ? {
                        background: "#f0f0f0",
                        alignSelf: "flex-start",
                        borderBottomLeftRadius: 4,
                      }
                    : {
                        background: "#e60023",
                        color: "#fff",
                        alignSelf: "flex-end",
                        borderBottomRightRadius: 4,
                      }),
                }}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div
                style={{
                  display: "inline-flex",
                  gap: 4,
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "#f0f0f0",
                  borderRadius: 14,
                  borderBottomLeftRadius: 4,
                  alignSelf: "flex-start",
                }}
              >
                <span className="ai-dot" />
                <span className="ai-dot" />
                <span className="ai-dot" />
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "12px 16px",
              borderTop: "1px solid #ddd",
              background: "#f9f9f9",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Ask about your business…"
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: "0.9rem",
                fontFamily: "inherit",
              }}
            />
            <button
              type="button"
              onClick={send}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "#e60023",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
