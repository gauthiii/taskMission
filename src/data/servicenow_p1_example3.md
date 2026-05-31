# Implementation Playbook: Governed AI Coding Assistant Rollout

**Target Framework:** AI Security & Trust Management (AI TRiSM)

**Timeline:** 14 Days to Live Demo

**Team Size:** 7 Resources

---

## 1. Pre-Requisites & Pre-Project Checklist

Before Day 1 kicks off, the following environment access, credentials, and data assets must be completely provisioned. If these are missing, the 14-day timeline is at risk.

### Required Tech Stack & Environment Access

* **ServiceNow Environment:** A sandbox or Personal Developer Instance (PDI) with `Xanadu` or newer capabilities. Full administrative privileges (`admin`, `secops_admin`) are required.
* **API Layer / Proxy:** An accessible local or cloud-hosted Python server (FastAPI/Flask) to act as the inline IDE/API middleware proxy.
* **LLM API Endpoints:** Active API keys for an accessible LLM provider (e.g., Azure OpenAI or OpenAI API) to simulate the custom code-review AI backend.
* **Mock Repositories:** A local mock codebase folder containing functional but generic code files (Python/JavaScript) to simulate an engineering repository.

### Data Seeds Required (Must be ready before Day 1)

To make the demo realistic and data-driven without exposing actual company assets, prepare these exact synthetic files ahead of time:

```
├── shadow_ai_logs.csv         <-- Synthetic corporate network proxy logs containing traffic rows for OpenAI, Claude, Hugging Face, and unapproved VS Code extensions.
├── mock_identities.json        <-- Entitlement mapping showing 5 Developer profiles and 1 "AI Review Agent" Service Account with its default access scopes.
├── database_secrets.txt       <-- A list of realistic, fake AWS/PostgreSQL connection strings (e.g., "postgresql://prod_admin:FakePassword123@db.internal:5432/main") to test the DLP interceptor.
└── exploit_payloads.txt       <-- 3 distinct indirect prompt injection examples hidden inside markdown code comments designed to trick an LLM into changing deployment flags.
```

---

## 2. Resource Allocation Matrix (The 7-Person Team)

To drive maximum velocity over 14 days, the team is split into functional tracks running in parallel.

* **Resource 1: Project Lead & Architect**
* *Role:* Oversees the 14-day delivery, unblocks dependencies, maps out integration schemas, and owns the execution of the final demo workbook.


* **Resource 2 & 3: ServiceNow Platform Developers**
* *Role:* Configure the CMDB AI Class extensions, build the AI Control Tower layouts, create the Change Management workflows, and configure Action Fabric Flow Designer integrations.


* **Resource 4 & 5: Cyber Security & SecOps Engineers**
* *Role:* Manage mock identity configurations (simulating Veza access graphs), build the SecOps incident ingestion routes, and write the regex-based data loss prevention (DLP) patterns.


* **Resource 6 & 7: Data & AI Integration Engineers**
* *Role:* Build the custom Python middleware API proxy, inject the Traceloop OpenTelemetry hooks into the calling pipeline, and configure the code-review LLM agent scripts.


---

## 3. The 14-Day Implementation Lifecycle (5 Strategic Milestones)

---

### Milestone 1: Asset Foundation & Shadow AI Mapping (Days 1–3)

* **What is this:** Establishing the visibility baseline of your engineering ecosystem by mapping the approved assistants and ingesting unvetted tools into the core tracking engine.

* **How we do each of the 4 use cases:**
* *Shadow AI Discovery:* Configure the AI Control Tower interface to import `shadow_ai_logs.csv`. The dashboard processes the rows, surfaces the "locally hosted Ollama instance" and unapproved VS Code plugins, and displays an automated corporate risk map.
* *Access Governance:* Create the core AI Configuration Item (CI) records in the CMDB for GitHub Copilot and the Custom Review AI, explicitly tagging them as core infrastructure assets.
* *DLP Layer:* N/A for this milestone.
* *Action Fabric:* N/A for this milestone.


* **Effort Estimate:** 72 total hours (Res 1, Res 2, Res 3 working full-time).
* **End Delivery / Milestone Exit Gate:** A live ServiceNow CMDB showing the officially inventoried AI Coding Assistant alongside an AI Control Tower dashboard actively reporting on unapproved shadow extensions.

---

### Milestone 2: Identity Perimeter & Least-Privilege Guardrails (Days 4–5)

* **What is this:** Implementing strict identity mapping to prove that the code-review AI cannot autonomously make state changes to production systems without explicit human oversight.
* **How we do each of the 4 use cases:**
* *Shadow AI Discovery:* N/A for this milestone.
* *Access Governance:* Ingest `mock_identities.json` into a security table to simulate a Veza identity access graph. Configure an alert rule in ServiceNow that flags a violation if anyone manually attempts to add the AI Review Agent’s service account to a production deployment group.
* *DLP Layer:* N/A for this milestone.
* *Action Fabric:* Define the API access token restrictions for the AI assistant's session.


* **Effort Estimate:** 48 total hours (Res 4, Res 5 leading; Res 2 supporting).
* **End Delivery / Milestone Exit Gate:** A visual entitlement graph in your environment showing the AI agent locked to staging environments, with automated ServiceNow policy tasks triggering if a privilege escalation occurs.

---

### Milestone 3: Runtime Proxy & DLP Interception (Days 6–8)

* **What is this:** Setting up the live inline interception engine that acts as a secure buffer between the engineers' workspace and the LLM execution backend.
* **How we do each of the 4 use cases:**
* *Shadow AI Discovery:* N/A for this milestone.
* *Access Governance:* Verify that the proxy reads the incoming user identity token to apply appropriate governance limits.
* *DLP Layer:* Build a regex and entropy parsing engine into the Python API proxy middleware. Test it against `database_secrets.txt` and `exploit_payloads.txt` to ensure it identifies hardcoded connection strings and prompt injection payloads before they reach the model.
* *Action Fabric:* Set up Traceloop OpenTelemetry logging on the proxy to capture blocked attempts and forward the metadata to ServiceNow SecOps.


* **Effort Estimate:** 72 total hours (Res 6, Res 7 leading; Res 4 supporting).
* **End Delivery / Milestone Exit Gate:** A operational Python-based proxy middleware that successfully intercepts raw code files, redacts connection strings in real-time, and surfaces an error block back to the user interface.

---

### Milestone 4: Change Management & Action Fabric Loop (Days 9–11)

* **What is this:** Replacing unsafe, direct AI deployment privileges with a standardized ServiceNow Change Management workflow.
* **What is this:** Replacing unsafe, direct AI deployment privileges with a standardized ServiceNow Change Management workflow.
* **How we do each of the 4 use cases:**
* *Shadow AI Discovery:* N/A for this milestone.
* *Access Governance:* Ensure the workflow maps the execution path to the authorized engineer's approvals.
* *DLP Layer:* Verify that the deployment payload contains clean, audited source files.
* *Action Fabric:* Build an automated ServiceNow Change Request Flow in Flow Designer. Instead of the Custom Review AI triggering a shell command directly, it sends a payload to the ServiceNow Action Fabric. This creates a Normal Change ticket, locks it until a human clicks "Approve," and logs the AI's justification for the release.


* **Effort Estimate:** 72 total hours (Res 2, Res 3 leading; Res 1, Res 6 supporting).
* **End Delivery / Milestone Exit Gate:** A functional Integration Hub Flow Designer script that ingests a deployment request payload from the AI agent, maps it to a standard Change Request lifecycle, and pauses execution for a human signature.

---

### Milestone 5: Scenario Testing & Demo Rehearsal (Days 12–14)

* **What is this:** Hardening the end-to-end user story, cleaning up dashboard user interfaces, and executing mock walkthroughs to ensure zero presentation latency.
* **How we do each of the 4 use cases:**
* *All Use Cases Unified:* Run a complete loop: A developer interacts with the IDE → an unapproved tool is flagged → a secret is leaked and blocked → a valid deployment is requested via the Change Management Action Fabric.


* **Effort Estimate:** 72 total hours (All resources participating).
* **End Delivery / Milestone Exit Gate:** A production-ready live demo workspace accompanied by a finalized, minute-by-minute presentation workbook.

---

## 4. The 14-Day Calendar Breakdown

| Day | Primary Focus Area | Track Assignment | Key Action Items |
| --- | --- | --- | --- |
| **Day 1** | Kickoff & Infrastructure Setup | All Tracks | Confirm sandbox availability; establish code repository routes; verify Azure OpenAI access keys. |
| **Day 2** | Asset Mapping Configuration | ServiceNow Track | Build custom AI CI schema extensions inside the CMDB layout. |
| **Day 3** | Shadow AI Log Ingestion | Data/AI Track | Load `shadow_ai_logs.csv` into the Control Tower interface; build risk categorization rules. |
| **Day 4** | Identity & Privilege Mapping | Security Track | Configure the identity access graph schemas to model the review agent's service limits. |
| **Day 5** | Access Escalation Policies | ServiceNow Track | Code the ServiceNow validation rules to trigger alerts upon unauthorized access modifications. |
| **Day 6** | Proxy Middleware Framework | Data/AI Track | Initialize the local Python proxy runtime environment; inject Traceloop tracing infrastructure. |
| **Day 7** | DLP Engine Integration | Security Track | Code regex expressions optimized to catch secret files, database strings, and structural exploits. |
| **Day 8** | SecOps Event Routing | ServiceNow Track | Configure the security incident intake API rules to transform proxy alerts into actionable records. |
| **Day 9** | Action Fabric Design | ServiceNow Track | Map the incoming JSON payload structure directly to standard ServiceNow change parameters. |
| **Day 10** | Flow Designer Engineering | ServiceNow Track | Develop the automated Change Request approval flow within the Integration Hub engine. |
| **Day 11** | End-to-End Pipeline Linking | All Tracks | Wire the proxy middleware outputs directly into the ServiceNow API endpoints. |
| **Day 12** | Complete System Validations | All Tracks | Run full end-to-end testing of the scenario from initial prompt submission through code change resolution. |
| **Day 13** | User Interface & Dashboard Cleanup | ServiceNow Track | Polish dashboard reporting layouts, chart widgets, and data visualizations. |
| **Day 14** | Live Demo Dress Rehearsal | All Tracks | Conduct full dry runs of the interactive presentation workbook; lock down final demonstration environment. |

---

## 5. Scripted Demo Walkthrough Guide (Day 14 Guide)

To execute a compelling presentation in under 12 minutes during your live review session, structure your presentation narrative into these 4 concise chapters:

### Step 1: The Governance Baseline (Duration: 2 Mins)

* **Action:** Log into ServiceNow and display the **AI Control Tower** landing interface.
* **Narration:** *"We begin our review within the central AI Control Tower hub. Before deploying our official coding framework, our discovery engines identified 3 active shadow AI configurations within the engineering network, including an unapproved localized Ollama runtime. These are now fully cataloged as CIs inside our CMDB to ensure complete operational visibility."*

### Step 2: The Malicious Secret Leak (Duration: 3 Mins)

* **Action:** Switch to your mock code workspace. Copy-paste a code snippet containing a hardcoded database string from `database_secrets.txt` into the prompt input window.
* **Narration:** *"Watch what happens when a developer accidentally includes an active database connection string inside a query optimization request. When I hit submit, our inline DLP proxy immediately catches the credential pattern, flags the security risk, and blocks transmission before the data leaves our corporate parameter."*

### Step 3: The Automated Incident Loop (Duration: 3 Mins)

* **Action:** Return immediately to the ServiceNow interface and open the **SecOps Incident Queue**.
* **Narration:** *"Because our proxy layer is natively integrated with ServiceNow Security Operations, the blocked leak automatically generated a high-priority incident. The platform has pulled data from our access graphs, pinpointed the compromised asset, and assigned a high-priority credential rotation task directly to the platform team."*

### Step 4: The Governed Deployment (Duration: 4 Mins)

* **Action:** Demonstrate a valid deployment request from the AI assistant. Show the creation of a **ServiceNow Change Request**.
* **Narration:** *"Finally, we review our secure execution model. When our code-review AI suggests a deployment, it is blocked from accessing our production environments directly. Instead, it interacts with our Action Fabric, generating a structured Change Request ticket. The update remains safely staged until a human administrator reviews the changes, clicks approve, and authorizes execution."*

---

