# AI Dataset Architecture Analysis
## Liberia Malaria Diagnosis & Early Warning System

---

## Overview
The Liberia Malaria AI system uses a **hybrid architecture** combining **embedded epidemiological datasets** with **LLM-powered inference** (Google Gemini 2.5 Flash). Unlike traditional ML models that require training on large datasets, this system **encodes domain knowledge directly into the system prompt**, creating an intelligent chatbot without explicit model retraining.

---

## 1. Dataset Integration Architecture

### A. **Embedded Epidemiological Data** (System-Level)

#### Location: `supabase/functions/malaria-chat/index.ts` (System Prompt)

The AI is trained through a comprehensive **system prompt** containing hardcoded datasets:

```
EMBEDDED DATASETS:
├── National Epidemiology (1.8M cases/year, 1,200 deaths/year)
├── County-Level Burden Data (Montserrado: 450K, Nimba: 280K, Bong: 220K, etc.)
├── Clinical Symptom Classification (Cardinal, Associated, Danger Signs)
├── Vulnerable Population Risk Factors (40% child mortality, 3x pregnant women risk)
├── Diagnostic Guidelines (RDT, Microscopy availability)
├── Prevention Strategies (ITN 55% coverage, IRS, SMC)
├── Treatment Protocols (ASAQ, AL, IV Artesunate)
├── Healthcare Infrastructure (725+ facilities, 3 major hospitals)
└── Risk Assessment Criteria (HIGH/MEDIUM/LOW risk stratification)
```

### B. **Frontend-Level Data** (UI Visualization)

#### Location: `src/components/`

**EducationSection.tsx** - Educational Content Dataset:
- Symptom classification (4 categories)
- Prevention methods (5 strategies)
- Treatment information
- County burden statistics
- High-risk demographic groups

**OutbreakWarning.tsx** - Epidemiological Monitoring Dataset:
- Real-time county-level statistics
- Population at-risk calculations
- Malaria species prevalence (98% P. falciparum)
- Transmission season patterns
- Key health facts

**FacilityFinder.tsx** - Healthcare Facility Dataset:
- Mock health facility locations
- Hours of operation
- Lab testing availability
- Distance calculations

---

## 2. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
│                   (React Frontend)                          │
│              src/components/MalariaChat.tsx                 │
└────────────────────────┬────────────────────────────────────┘
                         │ User symptom query
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTION                         │
│      supabase/functions/malaria-chat/index.ts              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 1. Receive messages from client                     │  │
│  │ 2. Assemble SYSTEM PROMPT with embedded datasets:  │  │
│  │    - Liberia epidemiology (hardcoded)              │  │
│  │    - Clinical guidelines (hardcoded)               │  │
│  │    - Risk assessment criteria (hardcoded)          │  │
│  │ 3. Add conversation history                        │  │
│  │ 4. Call LLM API with full context                  │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP POST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         LOVABLE API GATEWAY (LLM Provider)                 │
│                                                             │
│  Model: Google Gemini 2.5 Flash                           │
│  Input: System Prompt + Message History                   │
│  Output: Contextualized response for Liberia              │
│                                                             │
│  Authentication: LOVABLE_API_KEY (env variable)           │
│  Endpoint: https://ai.gateway.lovable.dev/v1/chat/completions
└────────────────────────┬──────────────────────────────────────┘
                         │ Response
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              RESPONSE TO CLIENT                            │
│   MalariaChat component renders AI assessment             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Dataset Components

### A. **Epidemiological Dataset**

**National Level:**
- Total Annual Cases: 1,800,000
- Annual Deaths: 1,200
- Population at Risk: 5,000,000 (100%)
- Case Fatality Rate: 0.067% (1,200/1,800,000)

**County-Level Breakdown:**
| County | Cases/Year | % of Total | Population |
|--------|-----------|-----------|------------|
| Montserrado | 450,000 | 25% | 1,500,000 |
| Nimba | 280,000 | 15.5% | 462,000 |
| Bong | 220,000 | 12.2% | 333,000 |
| Lofa | 180,000 | 10% | 276,000 |
| Grand Bassa | 150,000 | 8.3% | 221,000 |
| Margibi | 140,000 | 7.8% | 199,000 |
| Others | 400,000 | 21.2% | ~1,000,000 |

**Disease Characteristics:**
- Parasite Species: P. falciparum (98%), P. malariae (2%)
- Transmission: Year-round endemic
- Peak Season: May-October (rainy season)
- Leading Cause: #1 morbidity and mortality in Liberia

### B. **Clinical Dataset**

**Cardinal Symptoms (High Diagnostic Value):**
1. Cyclical fever (every 48-72 hours)
2. Chills and rigors (severe shaking)
3. Profuse sweating post-fever

**Associated Symptoms:**
1. Severe headache
2. Nausea and vomiting
3. Muscle pain (myalgia)
4. Joint pain (arthralgia)
5. Fatigue and malaise
6. Abdominal discomfort

**Danger Signs (Cerebral/Severe Malaria):**
1. Confusion or altered consciousness
2. Respiratory distress
3. Severe anemia (extreme pallor)
4. Jaundice (eyes/skin yellowing)
5. Dark/reduced urine (renal involvement)
6. Convulsions
7. Prostration (inability to sit/stand)

**Vulnerable Populations:**
- Children <5 years: 40% of all malaria deaths
- Pregnant women: 3x higher risk of severe malaria
- Rural populations: Limited healthcare access
- Displaced persons: Inadequate shelter/protection

### C. **Diagnostic Dataset**

**Available Testing Methods in Liberia:**
1. **Rapid Diagnostic Tests (RDTs):** Widely available
2. **Microscopy:** Available at hospitals/larger clinics
3. **Community Health Assistants:** Can perform RDTs in rural areas

**Diagnostic Guidance:**
- Clinical diagnosis alone is unreliable
- Always recommend testing
- RDTs available within 24 hours of fever onset

### D. **Treatment Dataset**

**Treatment Protocols (National Guidelines):**
- **First-line:** Artesunate-Amodiaquine (ASAQ) - uncomplicated malaria
- **Alternative:** Artemether-Lumefantrine (AL)
- **Severe Cases:** IV/IM Artesunate (hospital level)
- **Pre-referral:** Rectal artesunate for children (if hospital is distant)
- **Duration:** Complete full 3-day course
- **Cost:** FREE at public health facilities

### E. **Prevention Dataset**

**Prevention Methods in Liberia:**
1. **ITN (Insecticide-Treated Bed Nets):** 55% household coverage
2. **IRS (Indoor Residual Spraying):** Implemented in select counties
3. **SMC (Seasonal Malaria Chemoprevention):** For children in some areas
4. **Environmental:** Eliminate standing water (tires, containers, gutters)
5. **Personal Protection:** DEET/picaridin repellents
6. **Behavioral:** Close windows/doors at dusk (peak mosquito activity)

### F. **Healthcare Infrastructure Dataset**

**Facility Statistics:**
- Total Health Facilities: 725+
- Community Health Assistants: Deployed in rural areas

**Major Hospitals:**
1. **JFK Medical Center** - Monrovia (primary referral)
2. **Phebe Hospital** - Bong County
3. **Jackson F. Doe Hospital** - Nimba County

**Healthcare Protocols:**
- Encourage facility visit within 24 hours of fever onset
- 725+ health centers provide accessible care

### G. **Risk Assessment Dataset**

**HIGH RISK (Urgent - Go to Hospital NOW):**
- Any danger sign present
- Child <5 with fever >2 days
- Pregnant woman with any malaria symptoms
- Multiple cardinal symptoms + fever >3 days
- Previous severe malaria history

**MEDIUM RISK (Seek Testing Within 24 Hours):**
- Fever with 1-2 associated symptoms
- Adult with symptoms persisting 2+ days
- Symptoms during rainy season (May-October)

**LOW RISK (Monitor, Seek Care If Worsening):**
- Mild symptoms <24 hours without progression
- Single symptom without fever

---

## 4. AI Training & Inference Model

### Architecture Type: **Prompt-Based Knowledge Encoding**

Rather than traditional supervised learning, this system uses:

```
TRAINING METHOD: In-Context Learning (ICL)
├── System Prompt: 600+ lines of structured knowledge
│   ├── Role Definition
│   ├── Epidemiological Context
│   ├── Clinical Guidelines
│   ├── Risk Stratification
│   ├── Communication Style
│   └── Healthcare Infrastructure
│
├── Input: User messages (conversation history)
│
├── LLM Model: Google Gemini 2.5 Flash
│   ├── Parameters: temperature=0.7
│   ├── Max Tokens: 800
│   └── No explicit fine-tuning
│
└── Output: Contextualized response
    ├── Risk assessment
    ├── Recommended actions
    ├── Educational content
    └── Healthcare referrals
```

### Key Characteristics:

1. **No Traditional Training Data:** No labeled CSV/JSON datasets
2. **No Model Fine-tuning:** Uses base Gemini model
3. **Knowledge Injection:** All Liberia-specific data in system prompt
4. **Few-Shot Learning:** Prompt provides examples of assessment patterns
5. **Real-time Inference:** Each message triggers immediate LLM call

---

## 5. Data Sources & Attribution

### Primary Data Sources:
1. **Liberia National Malaria Control Program** - Epidemiological statistics
2. **WHO Estimates** - Global burden and local estimates
3. **Clinical Guidelines** - Standard malaria assessment protocols
4. **Healthcare Facility Registry** - Infrastructure and capacity data

### Data Freshness:
- County-level statistics: Annual (National Malaria Control Program)
- Clinical guidelines: Static (WHO/National protocols)
- Healthcare facilities: Static (as of deployment)
- **Limitation:** No real-time outbreak updates (would require database integration)

---

## 6. Data Integration Points

### A. **Frontend Integration**

**EducationSection.tsx:**
```tsx
const liberiaStats = {
  totalCases: 1800000,
  totalDeaths: 1200,
  childDeaths: 40, // percentage
  populationAtRisk: 100, // percentage
  healthFacilities: 725,
};

const countyBurden = [
  { county: 'Montserrado', cases: 450, color: 'bg-destructive', percentage: 25 },
  // ... county data
];
```

**OutbreakWarning.tsx:**
```tsx
const liberiaData = {
  casesPerYear: 1800000,
  deathsPerYear: 1200,
  populationAtRisk: 5000000,
  transmissionSeason: 'Year-round (peaks May-October)',
  prevalentSpecies: ['P. falciparum (98%)', 'P. malariae (2%)'],
  // ... epidemiological data
};
```

### B. **Backend Integration**

**malaria-chat function:**
```typescript
const systemPrompt = `...EMBEDDED_DATASETS...`;

const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages, // User conversation
    ],
    temperature: 0.7,
    max_tokens: 800,
  }),
});
```

### C. **Database Potential** (Currently Unused)

```typescript
// supabase/functions/malaria-chat/index.ts configuration:
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Current usage: Only for Supabase Functions invocation
// Potential: Could connect to PostgreSQL for:
// - Real-time outbreak data
// - User assessments (anonymized)
// - Healthcare facility updates
// - Dynamic risk scoring
```

---

## 7. Data Quality & Limitations

### Strengths:
✅ **Epidemiologically Accurate** - Based on WHO/National Control Program data
✅ **Clinically Validated** - Follows international malaria diagnosis guidelines
✅ **Context-Specific** - Liberia-tailored recommendations
✅ **Real-time Response** - LLM provides dynamic, conversational outputs
✅ **Scalable** - No need to retrain models for updates

### Limitations:
❌ **Static Datasets** - No real-time outbreak tracking
❌ **Mock Facility Data** - Health facility finder uses hardcoded examples
❌ **No Individual Tracking** - Doesn't store user assessments for analysis
❌ **No Continuous Learning** - System doesn't improve from interactions
❌ **No Feedback Loop** - No mechanism to validate AI recommendations against clinical outcomes

---

## 8. Future Enhancement Opportunities

### High Priority:
1. **Real-time Outbreak Integration**
   - Connect Supabase PostgreSQL to National Malaria Control Program
   - Auto-update county risk levels based on surveillance data
   - Trigger alerts for outbreak thresholds

2. **User Assessment Logging**
   - Store anonymized user assessments (with consent)
   - Enable outcome tracking (validated diagnoses)
   - Build evaluation metrics for model performance

3. **Dynamic Facility Mapping**
   - Replace mock data with actual GPS coordinates
   - Integrate Google Maps API for real directions
   - Track facility opening hours and lab availability

### Medium Priority:
4. **Vector Surveillance Integration**
   - Link mosquito density data by county
   - Adjust risk assessments seasonally/geographically
   - Predict transmission hotspots

5. **Treatment Outcome Analytics**
   - Track treatment efficacy by region
   - Monitor drug resistance patterns
   - Adjust protocols based on surveillance

6. **Model Fine-tuning**
   - Collect sufficient user interaction data
   - Fine-tune Gemini on Liberia malaria assessment patterns
   - Improve cultural/linguistic appropriateness

---

## 9. Technical Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React + TypeScript | UI/visualization of datasets |
| **LLM Provider** | Google Gemini 2.5 Flash | AI inference engine |
| **Backend** | Supabase Edge Functions (Deno) | System prompt + LLM orchestration |
| **Database** | Supabase PostgreSQL | Currently unused, ready for expansion |
| **API Gateway** | Lovable AI Gateway | Credentials management + rate limiting |
| **Auth** | Supabase Auth | User authentication (not yet implemented) |

---

## 10. Conclusion

The Liberia Malaria AI system uses a **prompt-engineered knowledge base** rather than traditional ML training. All datasets are **embedded in the system prompt** of a Supabase Edge Function, which calls Google's Gemini 2.5 Flash model. This approach enables:

- **Rapid Deployment** without lengthy training cycles
- **Easy Updates** by modifying the system prompt
- **Domain Accuracy** through expert-crafted guidelines
- **Transparent Decisions** with explainable recommendations

However, to achieve true intelligent learning and continuous improvement, the system would benefit from:
- Real-time data integration (Supabase PostgreSQL)
- User interaction logging and analysis
- Outcome validation and feedback loops
- Model fine-tuning on local assessment patterns
