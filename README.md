# FC26 Career Tools — Career Dashboard

A personal web dashboard for **EA FC 26 Career Mode** analytics. Built to work alongside **FIFA Live Editor** — export your squad data via Lua script, then import the CSV into the dashboard for analysis.

---

## Features

### Squad Analytics Dashboard
Upload your squad CSV and get instant access to:

- **Overview** — Full squad table with search, position/foot filters, sortable columns, contract status
- **Development** — Growth potential chart, Under-25 prospects, Veterans tracker
- **Player Profile** — UT-style card with detailed attribute bars per player
- **Compare** — Side-by-side UT card comparison with full attribute breakdown
- **Contracts** — Urgency-based contract management (Expiring / Renew Soon / Secure)
- **Squad Depth** — Visual pitch with 7 formation options, T1/T2/Youth auto-assignment, drag & drop

---

## Tech Stack

- **React + Vite**
- **Tailwind CSS + DaisyUI**
- **Recharts**
- **@dnd-kit** (drag and drop)
- Hosted on **Vercel**

---

## Getting Started

### 1. Export Squad Data from FIFA Live Editor

> ⚠️ **This Lua script is specifically made for [FIFA Live Editor](https://github.com/xAranaktu/FC-24-Live-Editor) (FC-24/FC-26), using Lua API v2. It will NOT work with Cheat Engine scripts.**

1. Open **FIFA Live Editor** while in Career Mode
2. Go to **Features → Lua Engine → Execute**
3. Copy and paste the contents of `lua/export_squad_to_csv.lua`
4. Click **Execute**
5. Find the exported `squad_export.csv` in your game installation directory

> By default the file is saved to your game install folder, e.g.:
> `C:\Program Files (x86)\Steam\steamapps\common\EA SPORTS FC 26\squad_export.csv`
>
> You can change the output path by editing this line at the top of the script:
> ```lua
> local OUTPUT_FILE = "squad_export.csv"
> ```

### 2. Import into Dashboard

1. Open the dashboard
2. Click **Upload CSV**
3. Select your `squad_export.csv`
4. Done — all tabs populate automatically

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/YOURUSERNAME/fc26-career-tools.git
cd fc26-career-tools

# Install dependencies
npm install

# Run dev server
npm run dev
```

---

## Project Structure

```
fc26-career-tools/
├── lua/
│   └── export_squad_to_csv.lua   ← Live Editor Lua export script
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   └── ui/
│   │       ├── OvrPill.jsx
│   │       ├── PosBadge.jsx
│   │       └── ContractBadge.jsx
│   ├── hooks/
│   │   └── useSquadData.js
│   ├── pages/
│   │   └── squad/
│   │       ├── SquadPage.jsx
│   │       └── tabs/
│   │           ├── OverviewTab.jsx
│   │           ├── DevelopmentTab.jsx
│   │           ├── ProfileTab.jsx
│   │           ├── CompareTab.jsx
│   │           ├── ContractsTab.jsx
│   │           └── DepthTab.jsx
│   └── utils/
│       ├── csvParser.js
│       ├── playerMapper.js
│       ├── formations.js
│       └── squadBuilder.js
└── README.md
```

---

## Notes

- This tool is for **personal use** with Career Mode saves
- Player potential is **hidden by default** — toggle via the "Show Potential" switch
- Squad Depth auto-assigns players by OVR — fully draggable to customize
- The Lua script targets your **managed club automatically** via `career_users` table (compatible with FC-24/FC-26 Live Editor API v2)
- Entirely made using ai so shut up.

---

## Roadmap

- [ ] Season Stats page
- [ ] Match Results / Fixtures page
- [ ] Transfer History page
- [ ] Finance / Budget tracker
- [ ] Youth Academy tracker
