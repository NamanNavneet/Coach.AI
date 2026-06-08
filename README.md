# 🧠 Coach.AI — Sales Force Effectiveness Coaching Platform

> An intelligent AI-powered coaching assistant that helps sales managers deliver personalized, data-driven coaching to their sales representatives — integrating real-time performance data, conversation simulation scores, and LLM-based analysis into a seamless chat experience.

---

## 📌 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Modules](#api-modules)
- [AI & LLM Pipeline](#ai--llm-pipeline)
- [MCP Server Integration](#mcp-server-integration)
- [Database Schema](#database-schema)
- [Configuration & Environment Variables](#configuration--environment-variables)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Challenges & Outcomes](#challenges--outcomes)

---

## Project Overview

**Coach.AI** is a backend API service for a Sales Force Effectiveness (SFE) platform. It empowers sales managers to have structured, AI-assisted coaching conversations with their sales representatives. The system aggregates data from two sources:

- **CoachAI DB** — stores coaching session records, form submissions, feedback comments, and performance metrics for each sales rep.
- **VRT (Virtual Role-play Training) DB** — stores results of AI-simulated sales call evaluations, including conversation transcripts and skill scores.

A manager interacts with the system through a chat interface. When a question is asked, an LLM pipeline selects the right data source(s), executes analytical queries via LangChain agents, performs semantic search over previous conversations, and streams back a structured, coaching-oriented response in real-time.

---

## Key Features

| Feature | Description |
|---|---|
| 🤖 AI Chat (Streaming) | Real-time streaming LLM responses via SSE using GPT-4o |
| 🧠 Contextual Memory | Semantic search over past conversations using `sentence-transformers` embeddings |
| 🔀 Dual-Agent Tool Routing | Automatic routing to VRT or CoachAI data sources using LLM tool selection |
| 📊 Analytics & Charts | Coaching sessions, hours, KPIs, topical analysis via filtered SQL queries |
| 📋 Action Items (MCP) | Task management for coaching action items via FastMCP protocol |
| 👥 Rep View | Manager's view of all direct reports with region/district hierarchy |
| ⚙️ Kubernetes Jobs | Trigger and monitor async AI simulation jobs on K8s |
| 🔐 Role-Based Auth | Email-header-based auth with manager–rep relationship validation |
| 🌐 Dual Database | Separate async connections to Coach DB and VRT DB |
| 🧪 Test Suite | Unit and integration tests with `pytest` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Frontend)                     │
│              Dashboard / Chat UI / Rep View                  │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP / SSE
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Application                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  /users      │  │  /charts     │  │  /kpis           │  │
│  │  /dashboard  │  │  /coach-assist│  │  /rep-view       │  │
│  │  /jobs       │  │  /hub/convos  │  │  /mcp-server     │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────┘  │
│                           │                                   │
│              ┌────────────▼────────────┐                     │
│              │    Coach Assist Module   │                     │
│              │                          │                     │
│              │  ┌─────────────────┐    │                     │
│              │  │  LLM v2 Pipeline │    │                     │
│              │  │                  │    │                     │
│              │  │  1. Prepare Data │    │                     │
│              │  │  2. Tool Select  │    │                     │
│              │  │  3. Agent Run    │    │                     │
│              │  │  4. Semantic     │    │                     │
│              │  │     Search       │    │                     │
│              │  │  5. Stream LLM   │    │                     │
│              │  └─────────────────┘    │                     │
│              └────────────────────────┘                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MCP Server (FastMCP)                    │   │
│  │   action_items_mcp  |  users_mcp                    │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────┬────────────────────┬────────────────────┘
                    │                    │
          ┌─────────▼─────┐    ┌────────▼────────┐
          │  Coach DB      │    │   VRT DB         │
          │  (PostgreSQL)  │    │  (PostgreSQL)    │
          │                │    │                  │
          │ - employees    │    │ - evaluated      │
          │ - sessions     │    │   conversations  │
          │ - chat         │    │ - customers      │
          │ - metrics      │    │ - skill scores   │
          │ - action items │    └──────────────────┘
          └───────────────┘
                    │
          ┌─────────▼─────────┐
          │   OpenAI GPT-4o   │
          │  (via LangChain)  │
          └───────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Web Framework** | [FastAPI](https://fastapi.tiangolo.com/) |
| **LLM** | OpenAI GPT-4o via [LangChain](https://python.langchain.com/) (`langchain-openai`) |
| **LLM Agents** | LangChain `initialize_agent` with `ZERO_SHOT_REACT_DESCRIPTION` |
| **Embeddings / Semantic Search** | `sentence-transformers` (`all-mpnet-base-v2`) + PyTorch cosine similarity |
| **ORM** | [SQLModel](https://sqlmodel.tiangolo.com/) + SQLAlchemy (async) |
| **Database** | PostgreSQL (dual: Coach DB + VRT DB) |
| **Async DB Driver** | `asyncpg` |
| **MCP Protocol** | [FastMCP](https://github.com/jlowin/fastmcp) |
| **HTTP Client** | `httpx` (async) |
| **Kubernetes Jobs** | `kubernetes` Python client |
| **Streaming** | FastAPI `StreamingResponse` / Server-Sent Events |
| **Config** | `pydantic-settings` |
| **Testing** | `pytest`, `pytest-asyncio` |
| **Containerization** | Docker + AWS ECR |
| **Orchestration** | Kubernetes (AWS EKS) |

---

## Project Structure

```
src/
├── __init__.py                  # FastAPI app factory, router registration
├── config.py                    # Pydantic settings (env vars)
├── mcp_app.py                   # Master FastMCP server, mounts sub-servers
├── middleware.py                # CORS, logging, auth middleware
├── errors.py                    # Global error handlers
│
├── coach_assist/                # Core AI coaching module
│   ├── routes.py                # Chat session & coach-assist endpoints
│   ├── routes_hub_conversations.py  # Hub conversation routes
│   ├── service.py               # Auth guards, session delete
│   ├── schema.py
│   ├── llm/                     # LLM v1 pipeline (legacy)
│   │   ├── Chat_module.py
│   │   ├── service.py
│   │   └── utils.py
│   └── llm_v2/                  # LLM v2 pipeline (current)
│       ├── Chat_module.py       # Dual agent orchestration, streaming
│       ├── LLMWrapper.py        # Retry/fallback wrapper for ChatOpenAI
│       ├── ContextualSemanticSearch.py  # Embedding-based memory
│       ├── prepare_required_data.py     # Data fetching & prep
│       ├── service.py           # Streaming response handler
│       ├── update_required_data.py      # Summary + embedding updates
│       ├── udpate_chat_title.py # Auto-generate chat titles
│       ├── llm_model.py         # Singleton LLMWrapper instance
│       └── instructions/        # Prompt templates
│           ├── mainstay_instructions.py
│           ├── follow_up_instructions.py
│           ├── guardrails_instructions.py
│           └── toolt_seclection_prompt.py
│
├── chart/                       # Analytics chart endpoints
│   ├── routes.py
│   ├── service.py               # Coaching sessions, hours, topic analysis
│   └── schema.py
│
├── kpis/                        # KPI metrics endpoints
│   ├── routes.py
│   ├── service.py
│   └── schema.py
│
├── dashboard/                   # Dashboard config endpoints
│   ├── routes.py
│   ├── service.py
│   └── mock_jsons/
│
├── users/                       # User/employee management
│   ├── routes.py
│   ├── service.py
│   ├── schema.py
│   ├── task_mcp.py              # MCP tools: tasks CRUD
│   └── user_mcp.py              # MCP tools: user queries
│
├── rep_view/                    # Sales rep view
│   ├── routes.py
│   └── data/regions.json
│
├── k8s_jobs/                    # Kubernetes job management
│   ├── routes.py
│   └── service.py
│
├── db/                          # Database layer
│   ├── main.py                  # Coach DB async engine & session
│   ├── main_vrt.py              # VRT DB async engine & session
│   ├── models.py                # SQLModel table definitions
│   ├── service.py               # DB CRUD operations
│   ├── llm_models.py            # LLM interaction models
│   └── tables/
│       ├── Base.py
│       ├── EmployeeHierarchy.py   # Employee + EmployeeRepository
│       ├── CoachingSessions.py
│       ├── FComputedMetricsDev.py
│       ├── ActionItems.py
│       ├── TopicalMapping.py
│       └── ChatConversation.py
│
├── utils/
│   ├── RoleChecker.py           # RBAC utility
│   ├── TimePeriodMiddleware.py  # Date range middleware
│   ├── time_utils.py            # Time formatting helpers
│   └── log_time.py              # Async timing decorator
│
└── tests/
    ├── conftest.py
    ├── test_charts_routes.py
    ├── test_charts_service.py
    ├── test_kpis_routes.py
    ├── test_kpis_service.py
    ├── test_users_routes.py
    └── test_users_service.py
```

---

## API Modules

### `POST /coach-assist/chat-messages-v2/{chat_session_id}`
Main AI chat endpoint. Accepts a message and streams back a coaching response.

**Flow:**
1. Validates manager ↔ rep access
2. Fetches `df_vrt` (simulation data) and `df_coachai` (coaching data) from both DBs
3. Loads prior chat embeddings and summary
4. Routes to VRT agent, CoachAI agent, or both via LLM tool selection
5. Runs agents in parallel with `ThreadPoolExecutor`
6. Streams final GPT-4o response via SSE

### `GET /coach-assist/rep/{rep_id}`
Returns evaluation matrix from Simulate.AI and Assess.AI for a specific rep.

### `GET /charts/...`
Analytics endpoints for coaching sessions count, hours spent, topic frequency, and KPI breakdowns — all filterable by `manager_id`, `start_time`, and `end_time`.

### `GET /kpis/...`
Aggregated KPI metrics for dashboard widgets.

### `GET /users/...`
Employee hierarchy management — list reps, get regions/districts, search by name.

### `GET /rep-view/...`
Manager's overview of their team with regional data.

### `POST /jobs/...`
Triggers Kubernetes batch jobs for async AI simulation processing.

### `/mcp-server` (MCP Protocol)
FastMCP-compatible endpoint exposing:
- `get_all_tasks`, `get_task_by_id`, `create_task`, `update_task_status`
- User info tools

---

## AI & LLM Pipeline

The v2 pipeline (`src/coach_assist/llm_v2/`) is the production implementation:

```
User Message
     │
     ▼
[LLM Tool Selection]
     │ → Decides: "VRT", "CoachAI", or "Both"
     │
     ├──────────────────────────────────────┐
     ▼                                      ▼
[VRT Agent]                          [CoachAI Agent]
 LangChain REACT agent                LangChain REACT agent
 Executes Pandas queries              Executes Pandas queries
 on df_vrt DataFrame                  on df_coachai DataFrame
     │                                      │
     └──────────────┬───────────────────────┘
                    ▼
          [Contextual Semantic Search]
           - Loads persisted embeddings (pickle)
           - Enriches query with 3-turn context window
           - Returns top-5 relevant past exchanges
                    │
                    ▼
          [Final Analysis Prompt]
           - Injects: user query, manager/rep names,
             vrt_result, coach_result, embeddings,
             mainstay_instructions, prior conversations
                    │
                    ▼
          [GPT-4o Stream]
           - Streams token-by-token via SSE
           - Yields { action: "streaming", text: chunk }
```

### LLMWrapper
`LLMWrapper` wraps `ChatOpenAI(gpt-4o)` with:
- **Retry logic** (configurable, default 2 retries)
- **Exponential backoff** with jitter
- **Async/sync detection** — auto-routes to `ainvoke`, async `invoke`, or executor-based sync `invoke`
- **Streaming** via `astream`
- **Token usage logging**

### Contextual Semantic Search
`ContextualSemanticSearch` uses `sentence-transformers/all-mpnet-base-v2` to:
- Encode prior conversations as embeddings stored in PostgreSQL (as binary pickle)
- Enrich new queries with the last 3 conversation turns
- Return top-k results above a cosine similarity threshold of 0.5

---

## MCP Server Integration

The app exposes a [Model Context Protocol](https://modelcontextprotocol.io/) server at `/mcp-server` using **FastMCP**:

```python
main_mcp.mount("action_items", action_items_mcp)  # Task CRUD tools
main_mcp.mount("users", users_mcp)                 # User lookup tools
```

This allows external LLM agents or orchestrators to programmatically manage coaching action items.

---

## Database Schema

### Core Tables (Coach DB)

| Table | Description |
|---|---|
| `r_employee_hierarchy_dev` | Employees — name, manager_id, email, region, district, designation |
| `r_chat_sessions_dev` | Chat sessions — employee_id, summary, title, chat_embedding, is_deleted |
| `r_chat_conversation_dev` | Individual messages — chat_message (JSON), sender_id, RL score |
| `f_coaching_sessions_dev` | Coaching session records — hours_spent, date |
| `f_computed_metrics_dev` | Form metrics — feedback_comments, form_status, form_submitted_date |
| `r_topical_mapping_dev` | Topic categories for coaching analysis |
| `f_action_items_dev` | Task action items — employee_id, status, due_date |
| `llm_interactions` | Prompt/response audit log — model_used, prompt_category, latency |
| `prompts` | Dynamic prompt templates — category, version, active_flag |

### VRT DB Tables (read-only)

| Table | Description |
|---|---|
| `v_evaluated_conversations` | AI-evaluated call transcripts with scores |
| `v_customers` | Doctor/customer records |
| `v_users` | Sales rep user records |

---

## Configuration & Environment Variables

| Variable | Description | Default |
|---|---|---|
| `OPEN_API_KEY` | OpenAI API key | — |
| `IDM_TOKEN` | Service account token for VRT API | — |
| `DB_USER` | PostgreSQL username | — |
| `DB_PASSWORD` | PostgreSQL password | — |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `COACH_DB_NAME` | Coach database name | — |
| `VRT_DB_NAME` | VRT database name | — |
| `ENV` | Environment (`development` / `deployed`) | `deployed` |
| `USE_CREDENTIALS` | Use SSL credentials | `True` |
| `VALIDATE_CERTS` | Validate SSL certificates | `True` |

---

## Running the App

### Prerequisites

- Python 3.10+
- PostgreSQL (two databases: Coach DB + VRT DB)
- OpenAI API key

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Set Environment Variables

```bash
export OPEN_API_KEY=sk-...
export COACH_DB_NAME=coach_db
export VRT_DB_NAME=vrt_db
export DB_USER=postgres
export DB_PASSWORD=secret
export DB_HOST=localhost
export ENV=development
```

### Start the Server

```bash
uvicorn src:app --reload --port 8000
```

Swagger docs available at: `http://localhost:8000/docs`

---

## Testing

```bash
pytest src/tests/ -v
```

Test coverage includes:
- Chart route and service layer tests
- KPI route and service layer tests
- User route and service layer tests

---

## Challenges & Outcomes

### Challenges

**1. Dual-Database Async Architecture**
Managing two separate PostgreSQL connections (Coach DB and VRT DB) within a single async request cycle required careful session lifecycle management. Each request creates independent async sessions for both databases, with explicit `finally` blocks ensuring sessions are always closed — preventing connection pool exhaustion.

**2. Mixing Async FastAPI with Sync LangChain Agents**
LangChain's `initialize_agent` and `agent.run()` are synchronous. Running these inside an async FastAPI route without blocking the event loop required wrapping them in `ThreadPoolExecutor` with `asyncio.wait_for`, balancing parallelism against timeout constraints.

**3. Persistent Semantic Memory**
Storing conversation embeddings in PostgreSQL as binary-pickled PyTorch tensors allowed semantic search to persist across sessions without an external vector database. The challenge was correctly serializing/deserializing tensors and handling the case where no prior embeddings exist for a new session.

**4. Real-Time Streaming with Agent Orchestration**
Coordinating multi-step agent execution (tool selection → parallel agent runs → final LLM stream) while yielding incremental status updates (`tool_decision`, `streaming`, `exception`) to the client via SSE required careful async generator design.

**5. Dynamic Prompt Management**
Prompts are stored in the database (`prompts` table) and loaded at runtime by category. This enabled prompt iteration without redeployment but introduced latency; prompts are fetched per-request requiring careful async session handling.

**6. MCP Protocol Integration**
Embedding a FastMCP server inside a FastAPI app using `app.mount("/mcp-server", mcp_app)` required reconciling their different ASGI lifespan management patterns — the FastAPI app delegates its lifespan to `mcp_app.lifespan`.

### Outcomes

- Delivered a fully streaming, multi-source AI coaching assistant capable of answering nuanced questions about sales rep performance by synthesizing data from simulation transcripts and coaching history.
- Reduced manager prep time for coaching sessions by surfacing rep-specific insights on demand.
- Enabled persistent conversation memory across sessions using embedding-based semantic retrieval, making follow-up questions contextually aware without full history replay.
- Established an MCP-compatible task management interface, enabling AI agents to autonomously create and track coaching action items.
- Deployed on AWS EKS with Kubernetes batch jobs handling computationally intensive simulation scoring asynchronously.

---

## Deployment

The application is containerized and deployed to **AWS EKS**:

- Docker image pushed to **AWS ECR**: `545009826723.dkr.ecr.us-east-1.amazonaws.com/...`
- Production API base: `https://coach.sfe.dev.zsservices.com/api`
- Kubernetes jobs triggered on-demand for batch simulation processing
- Environment-based OpenAPI path adjustment (`/api/openapi.json` in production)

---

*Built for Sales Force Effectiveness — empowering managers to coach with confidence, backed by data.*
