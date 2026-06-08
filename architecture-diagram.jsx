import { useState } from "react";

const colors = {
  bg: "#0a0e1a",
  bgCard: "#111827",
  bgCardHover: "#1a2235",
  border: "#1e2d45",
  borderAccent: "#2563eb",
  primary: "#3b82f6",
  primaryGlow: "#1d4ed8",
  accent: "#06b6d4",
  accentGlow: "#0891b2",
  green: "#10b981",
  purple: "#8b5cf6",
  orange: "#f59e0b",
  red: "#ef4444",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#475569",
};

const Badge = ({ children, color = "primary" }) => {
  const colorMap = {
    primary: { bg: "#1e3a5f", text: "#60a5fa", border: "#2563eb" },
    accent: { bg: "#0c3344", text: "#22d3ee", border: "#0891b2" },
    green: { bg: "#064e3b", text: "#34d399", border: "#059669" },
    purple: { bg: "#3b1f6b", text: "#c4b5fd", border: "#7c3aed" },
    orange: { bg: "#451a03", text: "#fbbf24", border: "#d97706" },
    red: { bg: "#450a0a", text: "#f87171", border: "#dc2626" },
  };
  const c = colorMap[color];
  return (
    <span style={{
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: "4px",
      padding: "2px 8px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.05em",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {children}
    </span>
  );
};

const Arrow = ({ direction = "down", color = colors.border, label = "" }) => {
  const arrows = {
    down: "↓",
    right: "→",
    left: "←",
    up: "↑",
    both: "↕",
    bidir: "⇄",
  };
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      color: color,
      fontSize: "20px",
      padding: "4px 0",
      flexShrink: 0,
    }}>
      <span>{arrows[direction]}</span>
      {label && <span style={{ fontSize: "10px", color: colors.textMuted, fontFamily: "monospace" }}>{label}</span>}
    </div>
  );
};

const Box = ({ title, subtitle, items = [], color = "primary", icon = "", badge = "", wide = false, compact = false }) => {
  const colorMap = {
    primary: { glow: "#1d4ed820", border: "#2563eb", titleColor: "#60a5fa" },
    accent: { glow: "#0891b220", border: "#0891b2", titleColor: "#22d3ee" },
    green: { glow: "#05966920", border: "#059669", titleColor: "#34d399" },
    purple: { glow: "#7c3aed20", border: "#7c3aed", titleColor: "#c4b5fd" },
    orange: { glow: "#d9770620", border: "#d97706", titleColor: "#fbbf24" },
    red: { glow: "#dc262620", border: "#dc2626", titleColor: "#f87171" },
    gray: { glow: "#47556920", border: "#475569", titleColor: "#94a3b8" },
  };
  const c = colorMap[color];
  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors.bgCard}, ${c.glow})`,
      border: `1px solid ${c.border}`,
      borderRadius: "10px",
      padding: compact ? "10px 14px" : "14px 18px",
      minWidth: wide ? "260px" : "160px",
      boxShadow: `0 0 20px ${c.glow}, inset 0 1px 0 ${c.border}30`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, transparent, ${c.border}, transparent)`,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: items.length ? "8px" : 0 }}>
        {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
        <div>
          <div style={{ color: c.titleColor, fontWeight: 700, fontSize: compact ? "12px" : "13px", fontFamily: "'JetBrains Mono', monospace" }}>
            {title}
          </div>
          {subtitle && <div style={{ color: colors.textMuted, fontSize: "10px", marginTop: "1px" }}>{subtitle}</div>}
        </div>
        {badge && <Badge color={color}>{badge}</Badge>}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{
          color: colors.textSecondary,
          fontSize: "11px",
          padding: "3px 0",
          borderTop: i === 0 ? `1px solid ${colors.border}` : "none",
          paddingTop: i === 0 ? "8px" : "3px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          <span style={{ color: c.border, fontSize: "8px" }}>▶</span>
          {item}
        </div>
      ))}
    </div>
  );
};

const Section = ({ title, children, color = "primary" }) => {
  const colorMap = {
    primary: "#1d4ed820",
    accent: "#0891b210",
    green: "#05966910",
    purple: "#7c3aed10",
    gray: "#47556910",
  };
  return (
    <div style={{
      border: `1px dashed ${colors.border}`,
      borderRadius: "12px",
      padding: "16px",
      background: colorMap[color] || "#00000010",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: "-10px", left: "16px",
        background: colors.bg,
        padding: "0 8px",
        color: colors.textMuted,
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontFamily: "monospace",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
};

export default function ArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "System Overview" },
    { id: "llm", label: "LLM Pipeline" },
    { id: "data", label: "Data Layer" },
  ];

  return (
    <div style={{
      background: colors.bg,
      minHeight: "100vh",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "24px",
      color: colors.textPrimary,
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          background: "#111827",
          border: "1px solid #1e3a5f",
          borderRadius: "12px",
          padding: "12px 24px",
          marginBottom: "8px",
        }}>
          <span style={{ fontSize: "28px" }}>🧠</span>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", color: colors.textPrimary }}>
              Coach<span style={{ color: colors.primary }}>.AI</span>
            </div>
            <div style={{ fontSize: "11px", color: colors.textMuted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Architecture Diagram
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "28px" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: activeTab === tab.id ? colors.primary : "transparent",
            color: activeTab === tab.id ? "#fff" : colors.textSecondary,
            border: `1px solid ${activeTab === tab.id ? colors.primary : colors.border}`,
            borderRadius: "8px",
            padding: "8px 18px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            transition: "all 0.2s",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========== TAB: Overview ========== */}
      {activeTab === "overview" && (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Client Layer */}
          <Section title="Client" color="gray">
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Box title="Dashboard UI" icon="📊" color="gray" compact items={["Manager view", "Charts & KPIs"]} />
              <Box title="Chat Interface" icon="💬" color="gray" compact items={["SSE streaming", "Coaching sessions"]} />
              <Box title="Rep View" icon="👥" color="gray" compact items={["Team hierarchy", "Region/District"]} />
            </div>
          </Section>

          <Arrow direction="both" color={colors.primary} label="HTTP / SSE" />

          {/* FastAPI Layer */}
          <Section title="FastAPI Application — src/__init__.py" color="primary">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "12px" }}>
              {[
                { title: "/users", icon: "👤", color: "primary" },
                { title: "/charts", icon: "📈", color: "primary" },
                { title: "/kpis", icon: "🎯", color: "primary" },
                { title: "/dashboard", icon: "🖥", color: "primary" },
                { title: "/rep-view", icon: "🗺", color: "primary" },
                { title: "/jobs", icon: "⚙️", color: "primary" },
                { title: "/hub/conversations", icon: "🔗", color: "primary" },
              ].map(r => (
                <Box key={r.title} title={r.title} icon={r.icon} color="gray" compact />
              ))}
            </div>

            <Arrow direction="down" color={colors.accent} />

            {/* Coach Assist */}
            <Section title="/coach-assist — Core AI Module" color="accent">
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Box title="Route Handler" icon="🔀" color="accent" compact
                  items={["Auth guard: manager↔rep", "GET /rep/{id} matrix", "POST /chat-messages-v2"]} />
                <Box title="LLM v2 Pipeline" icon="🤖" color="purple" compact
                  items={["Prepare data", "Tool selection", "Agent run", "Semantic search", "GPT-4o stream"]} />
                <Box title="LLM v1 Pipeline" icon="📦" color="gray" compact
                  items={["Legacy pipeline", "(fallback)"]} />
              </div>
            </Section>

            <Arrow direction="down" color={colors.accent} />

            {/* MCP Server */}
            <Section title="/mcp-server — FastMCP" color="green">
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <Box title="action_items_mcp" icon="✅" color="green" compact
                  items={["get_all_tasks", "create_task", "update_task_status", "get_task_by_id"]} />
                <Box title="users_mcp" icon="👥" color="green" compact
                  items={["User lookup tools", "Employee queries"]} />
              </div>
            </Section>
          </Section>

          <div style={{ display: "flex", gap: "40px", justifyContent: "center", alignItems: "flex-start", marginTop: "4px" }}>
            <Arrow direction="down" color={colors.orange} label="asyncpg" />
            <Arrow direction="down" color={colors.orange} label="asyncpg" />
            <Arrow direction="down" color={colors.primary} label="OpenAI API" />
            <Arrow direction="down" color={colors.accent} label="K8s API" />
          </div>

          {/* External Services */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Box title="Coach DB" subtitle="PostgreSQL" icon="🗄️" color="orange"
              items={["r_employee_hierarchy_dev", "r_chat_sessions_dev", "f_coaching_sessions_dev", "f_computed_metrics_dev", "f_action_items_dev", "prompts"]} />
            <Box title="VRT DB" subtitle="PostgreSQL (read-only)" icon="🗄️" color="orange"
              items={["v_evaluated_conversations", "v_customers", "v_users"]} />
            <Box title="OpenAI GPT-4o" subtitle="via LangChain" icon="✨" color="purple"
              items={["Tool selection", "Agent reasoning", "Final streaming response"]} />
            <Box title="AWS EKS" subtitle="Kubernetes" icon="☸️" color="accent"
              items={["Batch simulation jobs", "AWS ECR images", "Auto-scaling"]} />
          </div>
        </div>
      )}

      {/* ========== TAB: LLM Pipeline ========== */}
      {activeTab === "llm" && (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>

            <Box title="User Message" subtitle="POST /chat-messages-v2/{id}" icon="💬" color="primary" wide
              items={["Manager types a question about a sales rep", "Auth: x-user-email header validated"]} />
            <Arrow direction="down" color={colors.primary} />

            <Box title="prepare_required_data_v2()" icon="📦" color="accent" wide
              items={[
                "Saves user message to DB",
                "Fetches prior chat history → format_chat_history()",
                "df_preparation(): SQL → df_vrt (VRT DB)",
                "df_preparation(): SQL → df_coachai (Coach DB)",
                "Loads pickled embeddings from r_chat_sessions_dev",
              ]} />
            <Arrow direction="down" color={colors.accent} />

            <Box title="LLM Tool Selection" subtitle="load_prompt_by_category('tool_selection')" icon="🔀" color="purple" wide
              items={[
                "Sends query to GPT-4o with tool_selection prompt",
                "Returns: 'VRT', 'CoachAI', or 'both'",
                "Yields { action: 'tool_decision', text: '...' } to client",
              ]} />
            <Arrow direction="down" color={colors.purple} />

            <Section title="Parallel Agent Execution — ThreadPoolExecutor" color="primary">
              <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <Box title="VRT Agent" icon="🧪" color="accent"
                    items={["ZERO_SHOT_REACT_DESCRIPTION", "Tool: VRT Query Executor", "Runs pandas eval() on df_vrt", "Returns simulation scores"]} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <Box title="CoachAI Agent" icon="🎯" color="green"
                    items={["ZERO_SHOT_REACT_DESCRIPTION", "Tool: CoachAI Query Extractor", "Runs pandas eval() on df_coachai", "Returns coaching feedback"]} />
                </div>
              </div>
            </Section>
            <Arrow direction="down" color={colors.primary} />

            <Box title="ContextualSemanticSearch" subtitle="all-mpnet-base-v2" icon="🔍" color="orange" wide
              items={[
                "Enriches query with last 3 conversation turns",
                "Encodes enriched query → tensor",
                "Cosine similarity vs. stored embeddings",
                "Returns top-5 results (threshold: 0.5)",
              ]} />
            <Arrow direction="down" color={colors.orange} />

            <Box title="Final Analysis Prompt" subtitle="load_prompt_by_category('final_analysis')" icon="📝" color="purple" wide
              items={[
                "Injects: user_query, manager_name, sales_rep_name",
                "Injects: vrt_result, coach_result",
                "Injects: embeddings (semantic context)",
                "Injects: mainstay_instructions (coaching guidelines)",
                "Injects: previous_conversations",
              ]} />
            <Arrow direction="down" color={colors.purple} />

            <Box title="GPT-4o Streaming" subtitle="LLMWrapper.stream_chat()" icon="✨" color="primary" wide
              items={[
                "Converts dict messages → LangChain message objects",
                "Calls llm.astream() for token-by-token streaming",
                "Yields { action: 'streaming', text: chunk } via SSE",
                "Retry: 2 attempts with exponential backoff + jitter",
              ]} />
            <Arrow direction="down" color={colors.primary} />

            <Box title="Post-Processing" icon="💾" color="green" wide
              items={[
                "update_summary(): GPT summarizes full conversation",
                "update_embeddings(): saves new corpus + tensor to DB",
                "udpate_chat_title(): auto-generates session title",
                "LLMInteractions logged with prompt_category + model",
              ]} />
          </div>
        </div>
      )}

      {/* ========== TAB: Data Layer ========== */}
      {activeTab === "data" && (
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>

          <Section title="Coach DB — Primary Database (Read/Write)" color="orange">
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <Box title="r_employee_hierarchy_dev" icon="👤" color="orange"
                items={["id, name, manager_id", "email, phone_number", "region, district", "designation, status, gender"]} />
              <Box title="r_chat_sessions_dev" icon="💬" color="orange"
                items={["chat_session_id, employee_id", "summary (text)", "chat_embedding (binary pickle)", "title, is_deleted, deleted_at"]} />
              <Box title="r_chat_conversation_dev" icon="📩" color="orange"
                items={["id, chat_session_id, sender_id", "chat_message (JSON)", "reinforcement_learning (float)"]} />
              <Box title="f_coaching_sessions_dev" icon="🗓" color="orange"
                items={["id, employee_id", "coaching_session_completed_date_time", "hours_spent"]} />
              <Box title="f_computed_metrics_dev" icon="📋" color="orange"
                items={["employee_id, coaching_id", "original_text (feedback)", "form_status, form_submitted_date"]} />
              <Box title="f_action_items_dev" icon="✅" color="green"
                items={["task_id, employee_id, manager_id", "task_name, description, subject", "status, due_date, priority"]} />
              <Box title="prompts" icon="🤖" color="purple"
                items={["id, category, version", "prompt_text (long)", "active_flag, company_id"]} />
              <Box title="llm_interactions" icon="📊" color="accent"
                items={["id, user_id, message_id", "prompt_text, prompt_category", "model_used, status", "response_text, latency_ms"]} />
            </div>
          </Section>

          <Section title="VRT DB — Read-Only (Virtual Role-play Training)" color="accent">
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <Box title="v_evaluated_conversations" icon="🎙" color="accent"
                items={["customer_id, user_id", "conversation (JSON array)", "scores (JSON)", "evaluated_on (date)"]} />
              <Box title="v_customers" icon="🏥" color="accent"
                items={["customer_id", "name (doctor name)"]} />
              <Box title="v_users" icon="👤" color="accent"
                items={["user_id", "user_name (sales rep name)"]} />
            </div>
          </Section>

          <Section title="Async DB Architecture" color="gray">
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <Box title="db/main.py" subtitle="Coach DB Engine" icon="⚡" color="primary"
                items={["AsyncEngine via asyncpg", "get_session() → AsyncSession", "init_db() for startup"]} />
              <Box title="db/main_vrt.py" subtitle="VRT DB Engine" icon="⚡" color="primary"
                items={["Separate AsyncEngine", "get_vrt_session() → AsyncSession", "Read-only workload"]} />
              <Box title="db/service.py" subtitle="CRUD Operations" icon="🔧" color="gray"
                items={["save_new_chat_message()", "get_all_chat_messages()", "save_summary() / save_embeddings_to_db()", "get_rep_id_from_chat_session()"]} />
            </div>
          </Section>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "32px", color: colors.textMuted, fontSize: "11px" }}>
        Coach.AI — Sales Force Effectiveness Platform &nbsp;·&nbsp; FastAPI + GPT-4o + LangChain + PostgreSQL + K8s
      </div>
    </div>
  );
}
