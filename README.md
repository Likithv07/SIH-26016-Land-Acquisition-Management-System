# 🇮🇳 Bhoomi Setu --- National Land Acquisition & Management System

### Smart India Hackathon 2026 \| Problem Statement 26016

> **Real-Time National Land Acquisition & Management System for
> End-to-End Digital Monitoring and Decision Support**

Bhoomi Setu is a digital platform prototype designed to support the
complete land acquisition lifecycle through a unified, transparent and
role-based interface for citizens, project agencies and government
authorities.

The solution is aligned with **SIH 2026 Problem Statement 26016** and
focuses on workflow digitization, GIS-based land monitoring,
compensation tracking, document management, field verification,
dashboards, analytics and citizen services.

------------------------------------------------------------------------

## 🎯 Problem Statement

Land acquisition for infrastructure and public welfare projects involves
multiple stakeholders including project implementing agencies, district
authorities, state governments, central ministries and affected
citizens.

Fragmented systems, manual documentation, inconsistent processes and
limited real-time visibility can lead to:

-   Delays in approvals and acquisition
-   Data duplication and inconsistent records
-   Limited transparency for affected citizens
-   Difficulty monitoring compensation and possession
-   Challenges in Rehabilitation & Resettlement (R&R)
-   Limited coordination between departments
-   Difficulty tracking project timelines and milestones

Bhoomi Setu aims to provide a unified digital interface for monitoring
these activities across the land acquisition lifecycle.

------------------------------------------------------------------------

## 💡 Solution

The platform models the complete workflow:

``` text
Project Proposal
       ↓
Land Identification & GIS Analysis
       ↓
Multi-Level Review & Approval
       ↓
Acquisition & Legal Management
       ↓
Compensation & Rehabilitation
       ↓
Final Possession & Handover
       ↓
Project Monitoring
```

The frontend provides role-specific interfaces and connects to a
structured API layer for projects, parcels, workflows, compensation,
documents, field evidence, grievances, R&R, notifications and GIS
services.

------------------------------------------------------------------------

# 🚀 Key Features

## 👤 1. Citizen Portal

The citizen-facing interface provides access to:

-   Land and parcel information
-   Acquisition status
-   Compensation information
-   Payment status
-   Consent workflow
-   Grievance / objection submission
-   Document access
-   Rehabilitation & Resettlement information
-   Citizen assistance through BhoomiMitra

------------------------------------------------------------------------

## 🗺️ 2. GIS & Land Parcel Monitoring

The GIS interface provides map-based visualization and parcel
inspection.

Capabilities represented in the frontend include:

-   Interactive map
-   Parcel visualization
-   Parcel selection and inspection
-   Parcel history
-   Spatial information
-   Risk visualization
-   Right-of-Way (ROW) impact information
-   Field evidence visualization
-   Parcel 360 information

The frontend uses **Leaflet** for interactive mapping and is designed to
consume spatial data through the API layer.

------------------------------------------------------------------------

## 🏛️ 3. Role-Based Dashboards

The prototype contains dedicated dashboard experiences for different
administrative levels:

-   Central dashboard
-   State dashboard
-   Officer / district dashboard
-   Sector dashboard
-   Citizen dashboard

These interfaces are intended to provide role-specific project, land,
compensation, R&R and workflow information.

------------------------------------------------------------------------

## 📋 4. Project & Workflow Management

The frontend supports project lifecycle monitoring through:

-   Project listing
-   Project details
-   Project status
-   Workflow stages
-   Workflow history
-   Pending actions
-   Timeline monitoring
-   Project progress
-   Land proposed / acquired information

The workflow is designed around the end-to-end acquisition lifecycle
defined by PS 26016.

------------------------------------------------------------------------

## 💰 5. Compensation Management

The prototype contains citizen and authority-facing compensation
workflows.

Capabilities include:

-   Compensation assessment
-   Compensation calculation interface
-   Compensation breakdown
-   Asset valuation information
-   Solatium information
-   Award information
-   Compensation approval / rejection workflow
-   Payment / disbursement tracking
-   Citizen compensation view

The frontend is designed to retrieve and submit compensation information
through the API service layer.

------------------------------------------------------------------------

## 📑 6. Document Management

The document repository provides interfaces for managing
acquisition-related records.

Supported workflow concepts include:

-   Document listing
-   Document upload
-   Document versioning
-   Document verification
-   Document download
-   Field documents
-   Statutory documents
-   Document status tracking

------------------------------------------------------------------------

## 📸 7. Field Survey & Evidence

The field interface supports digital field-level verification workflows.

Capabilities include:

-   Field assignments
-   Survey creation
-   GPS coordinate capture
-   Field evidence upload
-   Photo metadata
-   Evidence verification
-   Parcel-based field records
-   Spatial validation

This supports the PS requirement for mobile-responsive field-level
collection and verification.

------------------------------------------------------------------------

## ⚖️ 8. Grievance & Citizen Support

The platform includes a grievance portal for citizen-facing issues and
objections.

Capabilities include:

-   Grievance creation
-   Grievance status
-   Grievance history
-   Supporting document upload
-   Assignment
-   Resolution workflow

------------------------------------------------------------------------

## 🏡 9. Rehabilitation & Resettlement

The R&R interface provides workflows for monitoring affected families
and rehabilitation benefits.

The prototype includes interfaces for:

-   Affected-family records
-   Eligibility
-   R&R benefits
-   Resettlement colonies
-   Benefit verification
-   Disbursement tracking
-   R&R dashboard

------------------------------------------------------------------------

## 🤖 10. AI-Assisted Risk & Analytics Interfaces

The platform includes interfaces for AI-assisted risk and analytics
capabilities.

The frontend can consume risk information such as:

-   Project risk
-   Parcel risk
-   Risk score
-   Risk level
-   Contributing factors
-   Risk heatmap information

These interfaces are designed to support predictive decision-making as
described in the proposed system architecture.

> The current citizen assistant in the frontend is implemented as a
> guided knowledge-based assistant with multilingual responses and quick
> actions. It should not be interpreted as a live government AI service.

------------------------------------------------------------------------

## 🔔 11. Notifications & Timeline Monitoring

The application provides interfaces for:

-   Notifications
-   Pending actions
-   Workflow deadlines
-   Timeline monitoring
-   Project milestones
-   SLA-related status information

------------------------------------------------------------------------

# 🏗️ Frontend Architecture

``` text
┌──────────────────────────────────────────────┐
│              User Interface                  │
│                                              │
│ Citizen | Officer | State | Central | PIA   │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│             React Application                │
│                                              │
│ Dashboards | GIS | Compensation | Documents │
│ Projects | Field | R&R | Grievances         │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│          Application State / Context         │
│                                              │
│ AppContext | Typed Models | UI State         │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│             Typed API Layer                  │
│                                              │
│ Authentication                               │
│ Projects / Parcels                           │
│ Workflows                                    │
│ GIS / Risk                                   │
│ Compensation                                 │
│ Documents                                    │
│ Field Evidence                               │
│ Grievances                                   │
│ R&R / Notifications                          │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
                 /api/v1 Backend
```

------------------------------------------------------------------------

# 🧩 Main Frontend Modules

``` text
src/
├── components/
│   ├── analytics/       # AI/risk analytics interface
│   ├── audit/           # Audit trail interface
│   ├── auth/            # Login and role selection
│   ├── citizen/         # Citizen portal and assistance
│   ├── common/          # Shared UI components
│   ├── compensation/    # Compensation workflows
│   ├── consent/         # Consent / mock eSign workflow
│   ├── dashboards/      # Central, State, Officer, Sector dashboards
│   ├── documents/       # Document repository
│   ├── field/           # Field survey and evidence
│   ├── gis/             # GIS and parcel intelligence
│   ├── landing/         # Landing page
│   ├── navigation/      # Navbar and sidebar
│   ├── projects/        # Project management
│   ├── rr/              # Rehabilitation & Resettlement
│   ├── scope/           # Scope of study
│   └── timeline/        # Timeline monitoring
│
├── context/
│   └── AppContext.tsx   # Application state and user context
│
├── data/
│   ├── mockData.ts      # Prototype/demo data
│   └── sectorData.ts    # Sector data
│
├── hooks/
│   └── useApiResource.ts
│
├── services/
│   ├── api.ts           # Typed API service layer
│   ├── apiTypes.ts      # API DTO/type definitions
│   ├── http.ts          # HTTP and authentication handling
│   └── mappers.ts       # Backend/frontend data mapping
│
├── App.tsx
├── main.tsx
├── index.css
└── types.ts
```

------------------------------------------------------------------------

# 💻 Technology Stack

### Frontend

  Technology     Purpose
  -------------- ---------------------------
  React 19       UI framework
  TypeScript     Type-safe development
  Vite           Development/build tooling
  Tailwind CSS   UI styling
  Leaflet        Interactive GIS maps
  Lucide React   Icons
  Motion         UI animations

### API Integration

The frontend contains a typed service layer for communication with the
proposed/connected backend through:

``` text
/api/v1
```

The service layer centralizes authentication, API requests, file
uploads, error handling and data mapping.

------------------------------------------------------------------------

# 🗂️ Repository Structure

This repository is intended to contain the **frontend prototype**.

``` text
SIH-26016-Land-Acquisition-Management-System/
│
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── services/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

> **Submission note:** The SIH submission repository contains the
> frontend prototype. Backend implementation, database services and
> production government integrations are separate implementation layers
> and are not represented as part of this frontend-only repository.

------------------------------------------------------------------------

# ▶️ Run the Project Locally

## Prerequisites

Install:

-   Node.js 18+
-   npm

Check your installation:

``` bash
node --version
npm --version
```

------------------------------------------------------------------------

## 1. Clone the repository

``` bash
git clone https://github.com/<YOUR-USERNAME>/SIH-26016-Land-Acquisition-Management-System.git
```

``` bash
cd SIH-26016-Land-Acquisition-Management-System
```

------------------------------------------------------------------------

## 2. Install dependencies

``` bash
npm install
```

------------------------------------------------------------------------

## 3. Start the development server

``` bash
npm run dev
```

The Vite development server will display the local URL in the terminal.

The configured development command uses:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

## 4. Build for production

``` bash
npm run build
```

To preview the production build:

``` bash
npm run preview
```

------------------------------------------------------------------------

# 🔌 Backend Connectivity

The frontend contains a dedicated API layer and expects backend services
under:

``` text
/api/v1
```

The API layer covers areas including:

``` text
Authentication
Projects
Parcels
GIS
Workflows
Compensation
Documents
Field Surveys
Field Evidence
Grievances
Consent
R&R
Notifications
AI/Risk
Audit
```

If the backend is not available, API-dependent screens may display
unavailable/error states. Prototype data is also maintained in the
frontend for demonstration purposes.

------------------------------------------------------------------------

# 🗺️ Proposed End-to-End Workflow

The platform follows the lifecycle described in SIH PS 26016:

``` text
1. Project Proposal & Planning
          ↓
2. Land Identification & GIS Analysis
          ↓
3. Multi-Level Review & Approvals
          ↓
4. Acquisition Process & Legal Management
          ↓
5. Compensation & Rehabilitation
          ↓
6. Final Possession & Handover
          ↓
7. Monitoring & Compliance
```

------------------------------------------------------------------------

# 🔐 Security & Governance

The proposed full-scale platform is designed to support:

-   Role-Based Access Control
-   Secure authentication
-   Audit trails
-   Controlled document access
-   Data validation
-   Secure API communication
-   Evidence integrity
-   Versioned documents
-   Government-standard security and governance requirements

Production deployment would require appropriate government
authorization, security review, infrastructure and integration
approvals.

------------------------------------------------------------------------

# 🔗 Proposed Integrations

The complete solution is designed for future integration with relevant
government and external systems such as:

-   Land record systems
-   Cadastral map systems
-   GIS platforms
-   Registration and Stamps systems
-   Court information systems
-   Financial / DBT systems
-   Notification services
-   Other authorized government databases

These integrations are part of the proposed production architecture and
are not claimed here as live government integrations.

------------------------------------------------------------------------

# 📊 Expected Impact

Bhoomi Setu aims to improve:

### Transparency

Provide stakeholders with better visibility into land acquisition
progress, compensation and possession.

### Accountability

Track workflows, actions, approvals and milestones.

### Efficiency

Reduce dependence on fragmented and paper-heavy workflows.

### Coordination

Create a common digital interface for multiple administrative
stakeholders.

### Data-Driven Decision Making

Provide dashboards, analytics and risk information for better project
monitoring.

### Citizen Experience

Give affected citizens access to land, compensation, grievance and R&R
information through a unified portal.

------------------------------------------------------------------------

# 📱 Scalability

The proposed solution is designed with nationwide deployment in mind.

Future implementation can support:

-   States and Union Territories
-   Multilingual interfaces
-   Mobile field operations
-   Standardized data formats
-   API-based interoperability
-   State-specific integrations
-   Additional government systems
-   Policy and legislative changes

------------------------------------------------------------------------

# 🏆 Smart India Hackathon 2026

  -----------------------------------------------------------------------
  Field                               Details
  ----------------------------------- -----------------------------------
  Problem Statement                   26016

  Problem Title                       Real-Time National Land Acquisition
                                      & Management System for End-to-End
                                      Digital Monitoring and Decision
                                      Support

  Theme                               Smart Automation

  Category                            Software

  Team                                Tru\$t_Me_Br0

  Project                             Bhoomi Setu
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# ⚠️ Prototype & Implementation Disclaimer

This repository represents the **frontend prototype** of Bhoomi Setu for
Smart India Hackathon 2026.

Some interfaces demonstrate workflows using prototype/mock data, while
other screens are designed to communicate with backend APIs.

The following should not be interpreted as live production integrations
unless explicitly connected and configured:

-   Government land records
-   PFMS / DBT
-   UIDAI / Aadhaar eSign
-   e-Courts
-   State land-record portals
-   Government GIS services
-   Production AI services

Any production deployment would require the relevant government
approvals, APIs, security controls, infrastructure and data-sharing
agreements.

------------------------------------------------------------------------

# 👥 Team

### Tru\$t_Me_Br0

Developed for:

**Smart India Hackathon 2026**

**Problem Statement 26016**

------------------------------------------------------------------------

## 🇮🇳 Bhoomi Setu

> **One digital thread from project proposal to final possession.**
