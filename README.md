#  GenAI-Based Common Illness Awareness & Early Guidance System


---

##  Problem Statement

**Lack of early awareness and proper guidance about common illnesses leads to delayed medical care, increased complications, and avoidable health risks.**

Many people, especially in rural and semi-urban regions, fail to recognize early warning signs of common illnesses such as fever-related conditions due to misinformation, myths, or lack of accessible guidance.

---

##  Proposed Solution

### **GenAI-Powered Common Illness Awareness & Early Guidance Assistant**

 **Mandatory Disclaimer (Displayed in App & README):**

> **“This system does not diagnose diseases or replace doctors.  
> It provides awareness and guidance to encourage timely medical consultation.”**

The system focuses **only on health awareness and early guidance**, not diagnosis or treatment.

---

##  System Overview

### User Inputs
- Symptoms (e.g., fever, headache, body pain, cough, nausea, fatigue)
- Duration of symptoms
- Age group (Child / Adult / Elderly)

###  GenAI Outputs
- Early warning signs 
- Symptom severity awareness (Mild / Monitor / Seek Care)
- Facial Analysis
- When to visit a hospital
- Do’s and Don’ts
- Emergency red flags
---

##  Example Use Case

> “A user experiencing fever and body pain for three days enters symptoms in simple language.  
> The GenAI assistant explains possible risks, highlights warning signs, and clearly advises when hospital care is required.”

---


##  Tech Stack (MERN)

###  Frontend
- React.js
- Bootstrap/CSS

###  Backend
- Node.js
- Express.js
- RESTful APIs for GenAI interaction

###  GenAI Integration
- Groq API
- Carefully prompt-engineered for **health awareness only**
- Safety-filtered outputs with disclaimers

---
###Data Flow Architecture
React (UI)
   ↓
Node.js (API Gateway)
   ↓
Groq AI (Health Guidance)
   ↓
Flask + OpenCV (Facial Analysis)

##  Project Structure

```bash
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│
├── server/                 # Node + Express Backend
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── server.js
│
├── .env
├── README.md
└── package.json
