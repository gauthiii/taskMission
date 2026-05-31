export type AiGovernanceUseCase = {
  title: string
  module: string
  useCase: string
  benefits: string
  howWeDo: string
  stack: string[]
  savings: string
  savingsPct: number
  savingsNote: string
  complexity: number
  duration: string
}

export const aiGovernanceUseCases = [
  {
    "title": "Shadow AI discovery & inventory",
    "module": "AI Control Tower — Discover",
    "useCase": "Automatically scan cloud infrastructure (AWS, Azure, GCP), SaaS apps, internal repos, and network traffic to detect every unauthorized LLM API connection, rogue AI agent, or local model in the estate. All findings populate the CMDB as AI Configuration Items.",
    "benefits": "CISOs, IT Risk teams, Compliance officers. Any org that has given employees broad SaaS access and suspects unsanctioned AI tools are in use.",
    "howWeDo": "Deploy AI Control Tower's Discover module with API connectors to cloud accounts and SaaS directories. Run scheduled scans + real-time alerting. Deliver a live AI asset register dashboard and remediation workflow for unapproved tools.",
    "stack": [
      "AI Control Tower",
      "CMDB",
      "Cloud connectors (AWS/Azure/GCP)",
      "SaaS integrations",
      "ServiceNow Discovery"
    ],
    "savings": "$800K–$2M/yr",
    "savingsPct": 72,
    "savingsNote": "Avoids average $4.5M cost of a shadow AI-sourced data breach (IBM 2024). Reduces manual audit hours by 80%.",
    "complexity": 3,
    "duration": "8–12 weeks"
  },
  {
    "title": "AI agent access governance (least privilege)",
    "module": "AI Control Tower — Veza integration",
    "useCase": "Map and enforce permissions for every AI agent identity across enterprise systems. Ensure a support bot can read tickets but cannot query HR payroll APIs, even if an attacker hijacks it via prompt injection.",
    "benefits": "IAM teams, Security architects, Data privacy officers. Critical for orgs running multi-agent orchestration (LangChain, AutoGen, Copilot Studio).",
    "howWeDo": "Integrate Veza's identity graph into ServiceNow. Build a visual permission map for all non-human identities. Enforce policy-based least-privilege via automated access reviews, with violations triggering IRM risk events.",
    "stack": [
      "AI Control Tower",
      "Veza (identity graph)",
      "IRM",
      "ServiceNow Access Reviews",
      "Active Directory / Okta"
    ],
    "savings": "$1.2M–$3M/yr",
    "savingsPct": 85,
    "savingsNote": "Prevents privilege escalation breaches. Reduces over-provisioned AI access cleanup time from weeks to hours.",
    "complexity": 4,
    "duration": "12–16 weeks"
  },
  {
    "title": "Real-time AI agent containment",
    "module": "AI Control Tower — SecOps SIR",
    "useCase": "When an AI agent shows signs of prompt injection, recursive looping, or behavioral anomaly, automatically kill its API access within seconds — not hours — before damage scales.",
    "benefits": "SOC teams, AI ops engineers, CROs. Any org running production autonomous agents where a rogue agent could corrupt data or drain cloud spend.",
    "howWeDo": "Configure Traceloop observability to stream agent telemetry into ServiceNow SecOps. Define behavioral thresholds (token spike, off-scope API calls, confidence drop). Build automated SIR playbooks that isolate the agent CI and page the on-call team.",
    "stack": [
      "AI Control Tower",
      "Traceloop (observability)",
      "SecOps SIR",
      "CMDB CI automation",
      "PagerDuty / Teams alerting"
    ],
    "savings": "$500K–$5M/incident",
    "savingsPct": 90,
    "savingsNote": "Stops runaway agent API costs and data corruption events in seconds vs hours of manual detection.",
    "complexity": 4,
    "duration": "10–14 weeks"
  },
  {
    "title": "EU AI Act & NIST compliance automation",
    "module": "IRM / GRC + AI Control Tower",
    "useCase": "Automatically assess every AI project against EU AI Act risk tiers, NIST AI RMF, and ISO 42001 controls. Generate audit-ready evidence packs without manual questionnaires.",
    "benefits": "GRC teams, Legal/Compliance, CDOs. Essential for any EU-market business or US federal contractor where AI regulation is now enforceable.",
    "howWeDo": "Deploy out-of-the-box IRM compliance content for EU AI Act. Map AI CIs from CMDB to regulation controls. Build a Service Catalog intake form that auto-triggers a scored risk assessment workflow for every new AI project request.",
    "stack": [
      "IRM / GRC",
      "AI Control Tower",
      "CMDB",
      "Service Catalog",
      "Policy & Compliance Management"
    ],
    "savings": "$2M–$6M/yr",
    "savingsPct": 78,
    "savingsNote": "Avoids EU AI Act fines (up to €35M or 7% global turnover). Cuts compliance prep time by ~70%.",
    "complexity": 3,
    "duration": "10–14 weeks"
  },
  {
    "title": "Third-party AI vendor risk ratings",
    "module": "Third-Party Risk Management (TPRM)",
    "useCase": "Continuously score every external AI vendor (OpenAI, Anthropic, Hugging Face, embedded AI in SaaS tools) on data training practices, vulnerability management, SLA compliance, and model transparency — with live risk ratings updated automatically.",
    "benefits": "Procurement, Vendor Risk, Legal. Any org using third-party AI APIs where customer data may be processed externally.",
    "howWeDo": "Build AI-specific vendor questionnaires in TPRM. Automate distribution, scoring, and escalation. Integrate with BitSight or SecurityScorecard for real-time vendor posture signals. Surface ratings in exec dashboards.",
    "stack": [
      "TPRM",
      "AI Control Tower",
      "BitSight / SecurityScorecard integration",
      "Vendor Portal",
      "IRM"
    ],
    "savings": "$1M–$4M/yr",
    "savingsPct": 65,
    "savingsNote": "Reduces third-party AI breach exposure. Cuts manual vendor review cycles from 3 months to 2 weeks.",
    "complexity": 2,
    "duration": "6–10 weeks"
  },
  {
    "title": "Prompt injection & data loss detection",
    "module": "SecOps + AI Control Tower",
    "useCase": "Detect when employees paste PHI, PII, or IP into public LLMs, or when external actors use prompt injection to extract sensitive data through enterprise AI interfaces.",
    "benefits": "SOC analysts, Data Privacy officers, HIPAA/GDPR compliance teams. High priority for healthcare, finance, and legal sectors.",
    "howWeDo": "Ingest API gateway and LLM proxy logs into SecOps. Apply DLP pattern matching and ML anomaly detection. Auto-raise categorized incidents for data exfiltration attempts, with SOAR playbooks that block the session and notify the user's manager.",
    "stack": [
      "SecOps",
      "AI Control Tower",
      "API gateway (Apigee / Kong)",
      "DLP engine",
      "SOAR playbooks"
    ],
    "savings": "$3M–$8M/yr",
    "savingsPct": 88,
    "savingsNote": "Average HIPAA breach fine is $1.9M per incident. Catching one PHI leak in an LLM session pays for the entire program.",
    "complexity": 4,
    "duration": "10–16 weeks"
  },
  {
    "title": "AI cost & token consumption governance",
    "module": "AI Control Tower — Measure",
    "useCase": "Aggregate API token usage, cloud AI spend, and ROI metrics across every department and workflow. Set spend thresholds, auto-throttle runaway consumers, and give finance a real cost-per-outcome view of AI investment.",
    "benefits": "CFOs, FinOps teams, AI product owners. Any org with $500K+ in annual AI API spend that currently has limited visibility into where the money goes.",
    "howWeDo": "Connect AI Control Tower's Measure module to cloud billing APIs and LLM gateway logs. Map token consumption to CMDB-linked departments and projects. Build automated throttling rules and monthly exec cost dashboards with ROI trend lines.",
    "stack": [
      "AI Control Tower — Measure",
      "Cloud billing APIs (AWS Cost Explorer / Azure Cost Mgmt)",
      "CMDB",
      "Financial Reporting dashboards",
      "ServiceNow Performance Analytics"
    ],
    "savings": "$400K–$2M/yr",
    "savingsPct": 55,
    "savingsNote": "Typical enterprises waste 30–40% of AI API spend on idle agents and loop errors. This recaptures it.",
    "complexity": 2,
    "duration": "6–8 weeks"
  },
  {
    "title": "AI model drift & hallucination monitoring",
    "module": "AI Control Tower — Evaluation Suite",
    "useCase": "Continuously benchmark production AI and LLM applications for accuracy degradation, bias drift, and hallucination rate increases. Auto-generate ITSM tickets for data science teams when models fall below defined confidence thresholds.",
    "benefits": "AI/ML engineering teams, Product owners, Risk teams. Critical for any regulated use case where AI output drives real decisions (lending, diagnostics, legal review).",
    "howWeDo": "Configure the Evaluation Suite with custom metrics per model (accuracy, BLEU score, hallucination rate, latency). Connect to model endpoints. Build threshold-based ITSM task creation for retraining flags, with trend dashboards for leadership.",
    "stack": [
      "AI Control Tower — Evaluation Suite",
      "ITSM",
      "Model endpoints (REST APIs)",
      "Performance Analytics",
      "Traceloop observability"
    ],
    "savings": "$600K–$2.5M/yr",
    "savingsPct": 60,
    "savingsNote": "Prevents costly model failures in production. One avoided bad-decision event in finance or healthcare can exceed the entire program cost.",
    "complexity": 3,
    "duration": "8–12 weeks"
  },
  {
    "title": "Governed external agent action fabric",
    "module": "AI Control Tower — Action Fabric",
    "useCase": "Instead of allowing external AI agents (Microsoft Copilot, custom LangChain bots, partner AI tools) to write directly to enterprise databases, force all AI-driven actions through ServiceNow's permissioned workflow layer — creating a complete audit trail and blocking unauthorized state changes.",
    "benefits": "Enterprise architects, SecOps, Data integrity teams. Any org integrating external AI vendors who need to take actions in core systems (ERP, CRM, HRIS).",
    "howWeDo": "Expose ServiceNow Action Fabric as the integration gateway for all external AI agents. Build governed workflow wrappers for every permitted action type. All agent calls are authenticated, logged, and auditable. Deploy in parallel with existing integrations.",
    "stack": [
      "AI Control Tower — Action Fabric",
      "ServiceNow Integration Hub",
      "OAuth 2.0 / API gateway",
      "CMDB audit trail",
      "IRM policy controls"
    ],
    "savings": "$1.5M–$4M/yr",
    "savingsPct": 75,
    "savingsNote": "Eliminates uncontrolled AI writes to core systems. One undetected corrupt record in an ERP system can cost millions in reconciliation.",
    "complexity": 5,
    "duration": "14–20 weeks"
  },
  {
    "title": "AI project intake & approval governance",
    "module": "AI Control Tower + Service Catalog + IRM",
    "useCase": "Create a governed front door for every AI initiative in the organization — from a team wanting to connect ChatGPT to a business process, to a full internal LLM deployment. No AI goes live without a documented risk score, data classification, and C-suite approval trail.",
    "benefits": "AI governance boards, CDOs, Legal, Business unit leaders. Ideal for enterprises that have had AI projects launched ad-hoc and now need to retrofit governance.",
    "howWeDo": "Build a multi-stage AI Project Intake form in the Service Catalog. Auto-route to IRM risk scoring (data sensitivity, model type, regulation applicability, bias risk). Integrate approval workflows with RACI roles. Output: a signed AI governance record per project, stored in CMDB.",
    "stack": [
      "Service Catalog",
      "IRM / GRC",
      "AI Control Tower",
      "CMDB",
      "Workflow approval engine",
      "ServiceNow Now Assist"
    ],
    "savings": "$800K–$3M/yr",
    "savingsPct": 68,
    "savingsNote": "Prevents costly shadow AI deployments and regulatory fines. Reduces average AI project governance admin from 6 weeks to 4 days.",
    "complexity": 2,
    "duration": "6–10 weeks"
  }
] satisfies AiGovernanceUseCase[]
