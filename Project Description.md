# Coach.AI — Project Description, Tech Stack & Outcomes

---

## Project Description

**Coach.AI** is an intelligent, AI-powered coaching platform built for pharmaceutical and enterprise sales organizations. It gives sales managers a conversational interface to access deep, data-driven insights about their sales representatives — combining coaching session history, AI-evaluated call simulations, and LLM-generated analysis into a single unified experience.

The platform addresses a real operational gap: managers typically need to navigate multiple disconnected tools to prepare for a coaching session — checking call recordings, reviewing form submissions, and manually synthesizing performance trends. Coach.AI collapses this workflow into a natural-language chat interface where a manager can simply ask: *"How has Jack been performing on patient-centric conversations this quarter?"* — and receive a structured, evidence-backed response in seconds.

### Who Uses It

- **Sales Managers** — primary users of the chat interface; ask questions about their direct reports and receive coaching guidance
- **Sales Representatives** — subjects of the coaching analysis; their performance data is pulled from both simulation and field coaching sources
- **Operations / AI Team** — maintains prompt templates, manages K8s batch jobs, monitors LLM interaction logs

### Core User Flows

1. **Pre-Coaching Prep** — Manager opens a chat session for a rep before a 1:1 coaching meeting, asks questions about recent call quality, identifies patterns, generates action items
2. **Post-Session Follow-Up** — Manager logs action items via MCP interface; system persists and tracks them
3. **Dashboard Analytics** — Manager reviews team-level KPIs, coaching hours, and topic frequency charts
4. **Rep Evaluation Matrix** — Single view of a rep's Simulate.AI scores and Assess.AI ratings

---

## Tech Stack

### Backend Framework
**FastAPI (Python)** — chosen for its native async support, automatic OpenAPI generation, and SSE streaming capabilities. The app registers 8+ routers and mounts a FastMCP sub-application for the Model Context Protocol server.

### LLM & AI
| Component | Technology | Purpose |
|---|---|---|
| LLM | OpenAI GPT-4o | Tool selection, agent reasoning, final coaching response |
| LLM Client | LangChain (`langchain-openai`) | Structured agent building, prompt chaining |
| Agents | LangChain `initialize_agent` (ZERO_SHOT_REACT_DESCRIPTION) | Autonomous data retrieval via pandas queries |
| Embeddings | `sentence-transformers` (`all-mpnet-base-v2`) | Semantic search over conversation history |
| Vector Ops | PyTorch (`torch.cosine_sim`) | In-memory cosine similarity scoring |
| Streaming | FastAPI `StreamingResponse` + SSE | Real-time token streaming to the client |

### Data & ORM
| Component | Technology |
|---|---|
| ORM | SQLModel + SQLAlchemy (async) |
| Async DB Driver | asyncpg |
| Database | PostgreSQL (dual instances: Coach DB + VRT DB) |
| Embeddings Storage | PostgreSQL `LargeBinary` (pickled PyTorch tensors) |
| Conversation Storage | PostgreSQL `JSON` column (chat messages) |

### Infrastructure
| Component | Technology |
|---|---|
| Containerization | Docker |
| Container Registry | AWS ECR |
| Orchestration | Kubernetes (AWS EKS) |
| Batch Jobs | Kubernetes `BatchV1` jobs (Python `kubernetes` client) |
| Config Management | `pydantic-settings` (env vars) |

### MCP Protocol
**FastMCP** — exposes a Model Context Protocol server at `/mcp-server`, enabling external AI agents to programmatically read/write coaching action items and query user data. Sub-servers are mounted for `action_items` and `users`.

### Testing
**pytest** + **pytest-asyncio** — route-level and service-level tests for charts, KPIs, and user endpoints.

---

## Challenges & Outcomes

### Challenge 1: Dual-Database Async Session Management

**Problem:** The application needs to query two separate PostgreSQL databases (Coach DB and VRT DB) within the same API request. Both sessions must be properly lifecycle-managed to avoid connection pool exhaustion in a high-concurrency async environment.

**Solution:** Two separate async engine instances are defined in `db/main.py` and `db/main_vrt.py`. FastAPI's `Depends()` system creates fresh `AsyncSession` instances per request. Sessions are always closed in `finally` blocks, and the data preparation layer (`prepare_required_data_v2`) explicitly manages both sessions to ensure cleanup regardless of exceptions.

**Outcome:** Clean, non-leaking session management with predictable behavior under load.

---

### Challenge 2: Sync LangChain Agents Inside Async FastAPI

**Problem:** LangChain's `initialize_agent().run()` is a synchronous blocking call. Calling it directly from an `async def` route would block the entire event loop, making the API unresponsive for the duration of agent execution.

**Solution:** Agent calls are wrapped in `ThreadPoolExecutor` using Python's `concurrent.futures`. Since the application needs two agents (VRT and CoachAI) to potentially run simultaneously, both are submitted as futures and collected via `as_completed()` — enabling true parallelism while keeping the FastAPI event loop free.

**Outcome:** VRT and CoachAI agents run in parallel in separate threads, cutting total latency roughly in half for dual-source queries.

---

### Challenge 3: Persistent Conversational Memory Without a Vector Database

**Problem:** Providing semantically relevant context from past conversations requires vector similarity search. Introducing a dedicated vector database (Pinecone, Weaviate, etc.) would add operational complexity and cost.

**Solution:** Conversation embeddings are generated using `sentence-transformers/all-mpnet-base-v2` and stored as binary-pickled PyTorch tensors in a `LargeBinary` column in PostgreSQL. At query time, the persisted tensor is loaded, the new query is enriched with the last 3 conversation turns, encoded, and compared via cosine similarity. Results above a 0.5 threshold are injected into the final prompt as context.

**Outcome:** Effective semantic memory with zero additional infrastructure — sessions feel contextually aware across multiple conversations without replay of full history.

---

### Challenge 4: Real-Time Streaming with Multi-Step Orchestration

**Problem:** The full pipeline — data prep, tool selection, agent execution, semantic search, final LLM call — takes several seconds. Waiting for the full response before sending anything to the client creates a poor UX.

**Solution:** The pipeline is implemented as an async generator that yields incremental status events at each stage:
- `{ action: "tool_decision", text: "Fetching data from CoachAI" }` — emitted immediately after tool selection
- `{ action: "streaming", text: "<token>" }` — emitted for each GPT-4o output token
- `{ action: "exception", text: "<error>" }` — emitted on failure for transparent error handling

This is served as a `StreamingResponse` using Server-Sent Events.

**Outcome:** Users see immediate feedback (which data sources are being queried) and then a smooth token-by-token response — consistent with modern AI chat UX patterns.

---

### Challenge 5: Dynamic Prompt Management at Runtime

**Problem:** Prompt engineering is iterative. Hard-coding prompts in source files means every prompt change requires a code deployment cycle.

**Solution:** All prompts (tool selection, VRT agent, CoachAI agent, final analysis, mainstay instructions) are stored in a `prompts` database table with `category`, `version`, and `active_flag` fields. The `load_prompt_by_category()` function fetches the active prompt at request time, enabling prompt iteration without redeployment.

**Outcome:** The AI/ops team can test and activate new prompt versions in production independently of code releases, dramatically shortening the iteration loop.

---

### Challenge 6: MCP Protocol Inside a FastAPI App

**Problem:** FastMCP and FastAPI have different ASGI lifespan patterns. Mounting an MCP server as a sub-application requires reconciling how each framework initializes and tears down.

**Solution:** The FastAPI app's `lifespan` parameter is set to `mcp_app.lifespan` — delegating lifecycle management to FastMCP. The main app's routes, routers, and middleware are all registered on the FastAPI app, while the MCP server handles its own startup/shutdown within the same process.

**Outcome:** A single deployable service exposes both a REST API and a Model Context Protocol server — no additional microservice required.

---

## Outcomes

| Outcome | Impact |
|---|---|
| AI-assisted coaching conversations | Managers access rep insights on-demand, reducing prep time |
| Semantic conversation memory | Follow-up questions are contextually aware across sessions |
| Parallel dual-agent data retrieval | Faster responses for queries spanning both data sources |
| Zero-infrastructure vector search | Eliminates need for dedicated vector DB deployment |
| Dynamic prompt versioning | AI team iterates prompts without code releases |
| MCP task management | Coaching action items accessible to external AI agents |
| K8s batch job integration | Async simulation scoring at scale without blocking the API |
| Streaming response UX | Immediate visual feedback during multi-second AI pipeline |
