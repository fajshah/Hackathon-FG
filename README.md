# 🌐 CoolRoute — Autonomous Multi-Agent Climate Intelligence Core

> **Built for FortyGuard Hackathon '26**  
> 🏆 **Tracks:** Track 1: Resilient Cities & Infrastructure | Track 6: Agentic Solutions  
> ⚡ **Powered by:** FortyGuard 20m²/60m² Large Temperature Model (LTM) + Google Gemini AI  

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📌 Overview

**CoolRoute** is an autonomous multi-agent climate resilience and street-level routing intelligence engine. Unlike traditional mapping tools that route purely based on distance or traffic, CoolRoute routes for **human physiological thermal safety** by ingesting FortyGuard's hyper-localized 20m² street-level temperature grids and Mean Radiant Temperature ($T_{\text{mrt}}$).

It provides real-time, auditable safety briefs that ensure **OSHA 29 CFR 1910** and **NIOSH** regulatory compliance for municipal crews, delivery couriers, and vulnerable citizens during extreme heat waves.

---

## 🏛️ Tripartite Multi-Agent Architecture

```
                    FORTYGUARD LTM SENSOR TELEMETRY (20m²/60m²)
                       [POST /v1/heatmap | GET /v1/status/{id}]
                                         │
                                         ▼
          ┌─────────────────────────────────────────────────────────────┐
          │ 🤖 AGENT 01: SPATIAL RASTER INGESTION & GEOMETRY AGENT       │
          │ • Ingests 20m/60m raster GeoJSON FeatureCollections         │
          │ • Computes spatial stats (mean, peak, σ, solar flux W/m²)   │
          └──────────────────────────────┬──────────────────────────────┘
                                         │
                                         ▼
          ┌─────────────────────────────────────────────────────────────┐
          │ 🔬 AGENT 02: THERMAL PHYSICS & RADIATIVE ATTENUATION AGENT   │
          │ • Calculates Mean Radiant Temp (T_mrt) & Solar Irradiance   │
          │ • Quantifies vegetative canopy attenuation & albedo shifts  │
          └──────────────────────────────┬──────────────────────────────┘
                                         │
                                         ▼
          ┌─────────────────────────────────────────────────────────────┐
          │ 📋 AGENT 03: OSHA & EPA PHYSIOLOGICAL COMPLIANCE AGENT       │
          │ • Evaluates OSHA 29 CFR 1910 / NIOSH WBGT thresholds        │
          │ • Solves for core body temp (T_core), sweat rate, & rest    │
          └──────────────────────────────┬──────────────────────────────┘
                                         │
                                         ▼
                     📜 CERTIFIED AUDITABLE DECISION BRIEF
```

---

## ✨ Key Features

- **FortyGuard 20m² / 60m² Microclimate Ingestion**: Reads 2-metre street-level ambient air temperatures ($T_{\text{air}}$), solar flux ($W/\text{m}^2$), and Mean Radiant Temperature ($T_{\text{mrt}}$).
- **Persona-Adaptive Physiological Engine**:
  - 👷 **Marcus Vance** (Municipal Utility & Infrastructure Crew — 420W Heavy Labor in Arc-Rated PPE)
  - 🚴 **Active Logistics Courier** (Medium-High Metabolic Rate)
  - 🚶 **Vulnerable Citizen / Commuter** (Pedestrian Heat Health)
- **OSHA 29 CFR 1910 Compliance**: Automates mandatory work/rest intervals, core body temperature ($T_{\text{core}}$) thresholds, and hydration schedules ($\text{mL/hr}$).
- **Interactive Microclimate Map**: Dual heat corridor visualizer comparing exposed asphalt vs. shaded cool canopies.
- **Enterprise PDF/Markdown Audit Export**: Generates verifiable compliance records with digital authentication signatures.
- **Zero-Downtime Resilience**: Seamless dual-engine fallback combining Gemini AI with a local deterministic FortyGuard physics model.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js 18+ installed
- npm / yarn / pnpm

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/coolroute.git
cd coolroute
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 How to Push to GitHub & Deploy to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Stage all files
git add .

# Commit changes
git commit -m "feat: initial commit of CoolRoute Climate Intelligence Core"

# Set branch to main
git branch -M main

# Add your GitHub remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
2. Import your GitHub repository (`YOUR_REPO_NAME`).
3. Set the Framework Preset to **Vite** or **Other**.
4. Configure Build and Output Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key)*
   - `GEMINI_MODEL`: `gemini-2.5-flash`
6. Click **Deploy**! 🚀

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas/SVG Rendering
- **Backend / API**: Node.js, Express, Vite Server Middleware
- **AI Core**: Google Gemini (`@google/genai`) Multi-Agent Engine
- **Climate Data**: FortyGuard Large Temperature Model (LTM) 20m² Geometries & Physics

---

## 📄 License & Attribution

Developed for **FortyGuard Hackathon '26**.  
Licensed under the [MIT License](LICENSE).
