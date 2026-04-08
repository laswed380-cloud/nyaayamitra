# NyaayaMitra Launchpad

Standalone India company-launch workspace for:

- incorporation planning
- DIN / DSC / director KYC readiness
- registered office and address proof
- linked registrations and post-incorporation sequencing
- service connector planning
- evidence exports and workflow tracking

It is a separate app and does **not** remove NyaayaMitra from Gas Shield OS.

## Run

```powershell
node server/index.js
```

Open `http://localhost:4317`.

## Test

```powershell
node tests/run-tests.js
```

## Main flows

- Launch Autopilot
- Incorporation Runbook
- Director / DIN / DSC / KYC Pack
- Registered Office Proof Plan
- Linked Registrations Roadmap
- Service Connector Plan
- Matters, Workflows, Governance, and Exports

## What it does

- turns a founder brief into ordered launch workstreams
- explains what to do first and what to stop before filing
- lists forms and applications in order
- lists document packs to collect
- gives founder / CA / CS / ops owner split
- gives email draft text for handoffs
- saves exports into an evidence locker
- keeps official source anchors visible in the workflow

## What it does not do yet

- submit directly to MCA, GST, Udyam, EPFO, or ESIC
- buy DSCs or onboard live service providers automatically
- store secrets or portal credentials

Those last-mile steps need chosen providers and real portal connectors later.

## Important source anchors used in the app

- MCA SPICe+
- MCA AGILE-PRO-S
- MCA DIR-3
- MCA DIR-3 KYC
- MCA INC-22
- MCA INC-20A
- Controller of Certifying Authorities
- GST Portal
- Udyam Registration
- EPFO
- ESIC
- Income Tax portal
