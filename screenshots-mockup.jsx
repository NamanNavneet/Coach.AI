import { useState } from "react";

const theme = {
  bg: "#0f1117",
  sidebar: "#161b27",
  card: "#1a2035",
  cardHover: "#1e2640",
  border: "#232d42",
  borderLight: "#2a3550",
  primary: "#4f8ef7",
  primaryDark: "#3b7de0",
  accent: "#00d4b4",
  green: "#22c55e",
  yellow: "#f59e0b",
  red: "#ef4444",
  purple: "#a78bfa",
  textPrimary: "#e8edf7",
  textSecondary: "#8b9bb8",
  textMuted: "#4e5d7a",
};

const Avatar = ({ name, size = 32, color = "#4f8ef7" }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `linear-gradient(135deg, ${color}, ${color}88)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: size * 0.38,
    flexShrink: 0, border: `2px solid ${color}44`,
  }}>
    {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
  </div>
);

const StarRating = ({ value, max = 5 }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} style={{ color: i < Math.round(value) ? "#f59e0b" : theme.textMuted, fontSize: "12px" }}>★</span>
    ))}
  </div>
);

const Chip = ({ label, color = theme.primary }) => (
  <span style={{
    background: `${color}18`, color, border: `1px solid ${color}44`,
    borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 600,
  }}>{label}</span>
);

const ProgressBar = ({ value, max = 100, color = theme.primary }) => (
  <div style={{ background: theme.border, borderRadius: "4px", height: "6px", overflow: "hidden" }}>
    <div style={{
      width: `${(value / max) * 100}%`, height: "100%",
      background: `linear-gradient(90deg, ${color}, ${color}bb)`,
      borderRadius: "4px", transition: "width 0.4s ease",
    }} />
  </div>
);

// ─── Screen 1: Main Chat Interface ───
function ChatScreen() {
  const [input, setInput] = useState("");

  const chatMessages = [
    {
      role: "user",
      text: "How has Jack Joyce been performing in patient-centric conversations this quarter?",
      time: "2:14 PM",
    },
    {
      role: "ai",
      text: null,
      time: "2:14 PM",
      structured: {
        header: { title: "Jack Joyce — Patient-Centric Performance Summary", subtitle: "Q1 2025 · Based on CoachAI + Simulate.AI data" },
        body: "Based on my analysis of Jack's coaching history and simulation scores, he demonstrates strong fundamentals in patient-centric engagement, though there are key areas for development.",
        bullets: [
          "✅ Consistently positions treatment in context of patient outcomes — 87% of evaluated calls",
          "⚠️ Tends to over-rely on clinical data rather than physician empathy (flagged in 3 coaching sessions)",
          "✅ Active listening scores: 4.2/5.0 (up from 3.8 in Q3 2024)",
          "📌 Mainstay: Focus area — 'Supporting the How Behind Treatment Access' (score: 3.1/5.0)",
        ],
        footer: "Recommended coaching focus: Prior authorization support conversations. Consider using the 'Navigating Complex Conversations' framework in your next session.",
      },
    },
    {
      role: "user",
      text: "What were his last 3 Simulate.AI scores?",
      time: "2:16 PM",
    },
    {
      role: "ai",
      text: null,
      streaming: true,
      partial: "Based on Simulate.AI evaluation data, Jack's last 3 evaluated interactions show...",
      time: "2:16 PM",
    },
  ];

  const sessions = [
    { name: "Jack Joyce", date: "Today", active: true, preview: "Patient-centric conversations..." },
    { name: "Sarah Chen", date: "Yesterday", active: false, preview: "Q4 call volume analysis..." },
    { name: "Marcus Webb", date: "Jun 5", active: false, preview: "Territory planning review..." },
    { name: "Ana Torres", date: "Jun 3", active: false, preview: "Objection handling skills..." },
  ];

  return (
    <div style={{ display: "flex", height: "520px", background: theme.bg, borderRadius: "12px", overflow: "hidden", border: `1px solid ${theme.border}` }}>
      {/* Sidebar */}
      <div style={{ width: "220px", background: theme.sidebar, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: theme.textPrimary, marginBottom: "2px" }}>🧠 Coach.AI</div>
          <div style={{ fontSize: "11px", color: theme.textMuted }}>Sales Coaching Assistant</div>
        </div>
        <div style={{ padding: "10px 12px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: theme.card, borderRadius: "8px", padding: "8px 10px" }}>
            <Avatar name="David Miller" size={26} color={theme.purple} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: theme.textPrimary }}>David Miller</div>
              <div style={{ fontSize: "10px", color: theme.textMuted }}>Regional Manager</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "10px 8px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: "10px", color: theme.textMuted, padding: "4px 8px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Recent Sessions</div>
          {sessions.map(s => (
            <div key={s.name} style={{
              padding: "9px 10px", borderRadius: "8px", marginBottom: "2px", cursor: "pointer",
              background: s.active ? `${theme.primary}18` : "transparent",
              border: s.active ? `1px solid ${theme.primary}44` : "1px solid transparent",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: s.active ? theme.primary : theme.textSecondary }}>{s.name}</div>
                <div style={{ fontSize: "10px", color: theme.textMuted }}>{s.date}</div>
              </div>
              <div style={{ fontSize: "10px", color: theme.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.preview}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px", borderTop: `1px solid ${theme.border}` }}>
          <button style={{ width: "100%", background: theme.primary, color: "#fff", border: "none", borderRadius: "8px", padding: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            + New Session
          </button>
        </div>
      </div>

      {/* Chat Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar name="Jack Joyce" size={32} color={theme.accent} />
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: theme.textPrimary }}>Jack Joyce</div>
            <div style={{ fontSize: "11px", color: theme.textMuted }}>Senior Sales Rep · Northeast Region · District 4</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <Chip label="Active Rep" color={theme.green} />
            <Chip label="Simulate.AI: 4.2★" color={theme.yellow} />
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              {msg.role === "ai" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${theme.primary}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🤖</div>}
              <div style={{ maxWidth: "78%" }}>
                {msg.role === "user" ? (
                  <div style={{ background: `${theme.primary}22`, border: `1px solid ${theme.primary}44`, borderRadius: "12px 12px 2px 12px", padding: "10px 14px" }}>
                    <div style={{ fontSize: "13px", color: theme.textPrimary }}>{msg.text}</div>
                    <div style={{ fontSize: "10px", color: theme.textMuted, marginTop: "4px", textAlign: "right" }}>{msg.time}</div>
                  </div>
                ) : msg.streaming ? (
                  <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "2px 12px 12px 12px", padding: "10px 14px" }}>
                    <div style={{ fontSize: "11px", color: theme.primary, marginBottom: "6px", fontFamily: "monospace" }}>⚡ Fetching from Simulate.AI...</div>
                    <div style={{ fontSize: "13px", color: theme.textSecondary }}>{msg.partial}<span style={{ animation: "blink 1s step-end infinite", color: theme.primary }}>|</span></div>
                  </div>
                ) : (
                  <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "2px 12px 12px 12px", padding: "12px 14px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: theme.textPrimary, marginBottom: "2px" }}>{msg.structured.header.title}</div>
                    <div style={{ fontSize: "10px", color: theme.textMuted, marginBottom: "8px" }}>{msg.structured.header.subtitle}</div>
                    <div style={{ fontSize: "12px", color: theme.textSecondary, marginBottom: "8px", lineHeight: 1.5 }}>{msg.structured.body}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px" }}>
                      {msg.structured.bullets.map((b, j) => (
                        <div key={j} style={{ fontSize: "11px", color: theme.textSecondary, padding: "4px 8px", background: `${theme.border}50`, borderRadius: "4px" }}>{b}</div>
                      ))}
                    </div>
                    <div style={{ fontSize: "11px", color: theme.accent, padding: "6px 8px", background: `${theme.accent}10`, borderRadius: "4px", borderLeft: `3px solid ${theme.accent}` }}>
                      💡 {msg.structured.footer}
                    </div>
                    <div style={{ fontSize: "10px", color: theme.textMuted, marginTop: "6px" }}>{msg.time}</div>
                  </div>
                )}
              </div>
              {msg.role === "user" && <Avatar name="David Miller" size={28} color={theme.purple} />}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about Jack's performance, coaching history, or Simulate.AI scores..."
            style={{
              flex: 1, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "8px",
              padding: "10px 14px", color: theme.textPrimary, fontSize: "13px", outline: "none",
            }}
          />
          <button style={{ background: theme.primary, border: "none", borderRadius: "8px", width: "40px", cursor: "pointer", fontSize: "16px" }}>→</button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 2: Dashboard / Analytics ───
function DashboardScreen() {
  const reps = [
    { name: "Jack Joyce", sessions: 8, hours: 12.5, score: 4.2, trend: "up", topics: ["Patient Focus", "Access"] },
    { name: "Sarah Chen", sessions: 6, hours: 9.0, score: 3.8, trend: "up", topics: ["Listening", "Trust"] },
    { name: "Marcus Webb", sessions: 5, hours: 7.5, score: 3.4, trend: "down", topics: ["Credibility"] },
    { name: "Ana Torres", sessions: 9, hours: 14.0, score: 4.6, trend: "up", topics: ["Patient Focus", "Partner"] },
  ];

  const kpis = [
    { label: "Total Coaching Sessions", value: "28", delta: "+4", color: theme.primary },
    { label: "Total Hours Coached", value: "43h", delta: "+6.5h", color: theme.accent },
    { label: "Avg Simulate.AI Score", value: "4.0", delta: "+0.3", color: theme.yellow },
    { label: "Reps Coached", value: "4 / 4", delta: "100%", color: theme.green },
  ];

  const topics = [
    { label: "Patient Focus", pct: 78 },
    { label: "Active Listening", pct: 65 },
    { label: "Treatment Access", pct: 54 },
    { label: "Trust Building", pct: 48 },
    { label: "Practice Partner", pct: 35 },
  ];

  return (
    <div style={{ background: theme.bg, borderRadius: "12px", overflow: "hidden", border: `1px solid ${theme.border}`, padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 800, color: theme.textPrimary }}>Team Dashboard</div>
          <div style={{ fontSize: "11px", color: theme.textMuted }}>Q1 2025 · Jan 1 – Mar 31 · Northeast Region</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Chip label="Q1 2025" color={theme.primary} />
          <Chip label="All Districts" color={theme.textMuted} />
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "14px" }}>
            <div style={{ fontSize: "10px", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: "11px", color: theme.green, marginTop: "4px" }}>↑ {k.delta} vs last quarter</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Rep Table */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: theme.textPrimary, marginBottom: "12px" }}>Rep Performance</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {reps.map(rep => (
              <div key={rep.name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Avatar name={rep.name} size={28} color={rep.trend === "up" ? theme.green : theme.red} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: theme.textPrimary }}>{rep.name}</span>
                    <StarRating value={rep.score} />
                  </div>
                  <div style={{ fontSize: "10px", color: theme.textMuted }}>{rep.sessions} sessions · {rep.hours}h</div>
                  <ProgressBar value={rep.score} max={5} color={rep.trend === "up" ? theme.green : theme.yellow} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: theme.textPrimary, marginBottom: "12px" }}>Coaching Topics Frequency</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {topics.map(t => (
              <div key={t.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: theme.textSecondary }}>{t.label}</span>
                  <span style={{ fontSize: "11px", color: theme.primary, fontWeight: 700 }}>{t.pct}%</span>
                </div>
                <ProgressBar value={t.pct} color={theme.primary} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 3: Rep View ───
function RepViewScreen() {
  const reps = [
    { name: "Jack Joyce", region: "Northeast", district: "District 4", status: "Active", sessions: 8, score: 4.2, lastCoached: "Jun 5", avatar: "#00d4b4" },
    { name: "Sarah Chen", region: "Northeast", district: "District 4", status: "Active", sessions: 6, score: 3.8, lastCoached: "Jun 3", avatar: "#a78bfa" },
    { name: "Marcus Webb", region: "Northeast", district: "District 5", status: "Active", sessions: 5, score: 3.4, lastCoached: "May 28", avatar: "#f59e0b" },
    { name: "Ana Torres", region: "Northeast", district: "District 5", status: "Active", sessions: 9, score: 4.6, lastCoached: "Jun 6", avatar: "#22c55e" },
  ];

  return (
    <div style={{ background: theme.bg, borderRadius: "12px", overflow: "hidden", border: `1px solid ${theme.border}`, padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 800, color: theme.textPrimary }}>Rep View</div>
          <div style={{ fontSize: "11px", color: theme.textMuted }}>4 direct reports · Northeast Region</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input placeholder="Search reps..." style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "7px 12px", color: theme.textPrimary, fontSize: "12px", outline: "none", width: "180px" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        {reps.map(rep => (
          <div key={rep.name} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "16px", cursor: "pointer" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <Avatar name={rep.name} size={40} color={rep.avatar} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: theme.textPrimary }}>{rep.name}</div>
                <div style={{ fontSize: "11px", color: theme.textMuted }}>{rep.region} · {rep.district}</div>
                <div style={{ marginTop: "4px" }}><Chip label={rep.status} color={theme.green} /></div>
              </div>
              <StarRating value={rep.score} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[
                { label: "Sessions", value: rep.sessions },
                { label: "Sim Score", value: rep.score },
                { label: "Last Coached", value: rep.lastCoached },
              ].map(stat => (
                <div key={stat.label} style={{ background: `${theme.border}50`, borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: theme.primary }}>{stat.value}</div>
                  <div style={{ fontSize: "10px", color: theme.textMuted }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
              <button style={{ flex: 1, background: `${theme.primary}18`, border: `1px solid ${theme.primary}44`, borderRadius: "6px", padding: "6px", color: theme.primary, fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
                💬 Start Coaching
              </button>
              <button style={{ flex: 1, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "6px", color: theme.textSecondary, fontSize: "11px", cursor: "pointer" }}>
                📊 View Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Screenshots() {
  const [screen, setScreen] = useState("chat");

  const screens = [
    { id: "chat", label: "💬 Chat Interface", desc: "AI coaching conversation" },
    { id: "dashboard", label: "📊 Dashboard", desc: "Team analytics & KPIs" },
    { id: "repview", label: "👥 Rep View", desc: "Team overview" },
  ];

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", padding: "24px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "22px", fontWeight: 800, color: theme.textPrimary, marginBottom: "6px" }}>
          🧠 Coach<span style={{ color: theme.primary }}>.AI</span> — UI Screens
        </div>
        <div style={{ fontSize: "12px", color: theme.textMuted }}>Interactive mockups of the core application screens</div>
      </div>

      {/* Screen Selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        {screens.map(s => (
          <button key={s.id} onClick={() => setScreen(s.id)} style={{
            background: screen === s.id ? theme.primary : theme.card,
            color: screen === s.id ? "#fff" : theme.textSecondary,
            border: `1px solid ${screen === s.id ? theme.primary : theme.border}`,
            borderRadius: "10px",
            padding: "10px 18px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
          }}>
            <div>{s.label}</div>
            <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "2px" }}>{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Screen Render */}
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {screen === "chat" && <ChatScreen />}
        {screen === "dashboard" && <DashboardScreen />}
        {screen === "repview" && <RepViewScreen />}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px", fontSize: "11px", color: theme.textMuted }}>
        These are UI mockups illustrating the application's core screens — Chat Interface, Analytics Dashboard, and Rep View
      </div>
    </div>
  );
}
