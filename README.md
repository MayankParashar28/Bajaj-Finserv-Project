<div align="center">
  <h1>🚀 BFHL Full Stack Challenge</h1>
  <p><strong>A production-ready, enterprise-grade graph processing application.</strong></p>
</div>

<br />

This repository contains a highly modular, full-stack application built for the **SRM Full Stack Challenge**. It is designed to parse, validate, and construct complex hierarchical node graphs (trees and cycles) from raw user input, complete with a premium, interactive frontend visualization.

## ✨ Key Features

- **Robust Graph Engine**: Custom algorithms implementing Union-Find for component grouping and DFS for deep cycle detection.
- **Enterprise Frontend**: A stunning React (Vite) Single Page Application featuring a Vercel-inspired clean UI architecture, glassmorphism tokens, and responsive layout.
- **Interactive Visualization**: Drag-and-drop node graph rendering using `React Flow` and `Dagre` layout engines.
- **Strict Validation**: Bulletproof input sanitization, capturing exact duplicates, handling multi-parent conflicts ("first-parent-wins"), and discarding invalid formats.
- **Modular Backend**: Clean separation of concerns (Routes, Controllers, Services) built on Node.js and Express.

---

## 📂 Architecture

The project is structured as a monorepo containing two decoupled services:

```text
bfhl-challenge/
├── backend/                  ← Node.js REST API
│   ├── controllers/          ← Request handling & response formatting
│   ├── routes/               ← API Endpoint definitions
│   ├── services/             ← Core Business Logic (Validation & Graph Math)
│   └── server.js             ← Express initialization
│
└── frontend/                 ← React (Vite) UI
    ├── src/
    │   ├── components/       ← UI Components (TreeViewer, VisualGraph)
    │   ├── App.jsx           ← Main Application View
    │   └── index.css         ← Enterprise Design System (Tokens & Variables)
    └── package.json
```

---

## 🚀 Getting Started

### 1. Run the Backend API

The backend runs on **Node.js**.

```bash
cd backend
npm install
npm run start   # Starts the Express server on port 3001
```

### 2. Run the Frontend Application

The frontend is powered by **React** and **Vite** for lightning-fast HMR.

Open a *new* terminal window:

```bash
cd frontend
npm install
npm run dev     # Starts the Vite dev server on port 5173
```

Navigate to `http://localhost:5173` in your browser. The UI will automatically connect to your local backend.

---

## 📡 API Reference

### `POST /bfhl`
Processes an array of directed edge strings and returns structured graph insights.

**Headers:**  
`Content-Type: application/json`

**Request Payload:**
```json
{
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X", "hello"]
}
```

**Response Format (200 OK):**
```json
{
  "user_id": "mayank_parashar_28082005",
  "email_id": "mp0120@srmist.edu.in",
  "college_roll_number": "RA2311026030144",
  "hierarchies": [
    { 
      "root": "A", 
      "tree": { "A": { "B": { "D": {} }, "C": {} } }, 
      "depth": 3 
    },
    { 
      "root": "X", 
      "tree": {}, 
      "has_cycle": true 
    }
  ],
  "invalid_entries": ["hello"],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

---

## 🧠 Core Logic & Edge Cases Handled

1. **Input Validation**: Accepts strictly `"X->Y"` format. Self-loops (`A->A`) and malformed strings are pushed to `invalid_entries`.
2. **Duplicate Detection**: Perfect string matches are captured exactly once into `duplicate_edges`.
3. **Multi-Parent Resolution**: Adheres to the "first-parent-wins" rule. If a node is assigned a second parent later in the input array, the subsequent edge is silently ignored.
4. **Cycle Isolation**: Complex cycles (e.g., `O->P->Q->R->O`) are correctly isolated, bypassing infinite recursion loops via a custom DFS trace.

---

## 🌍 Production Deployment

### Backend (Render / Railway)
1. Connect your repository to your hosting provider.
2. Set the Root Directory to `backend`.
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`

### Frontend (Vercel / Netlify)
1. Connect your repository.
2. Set the Root Directory to `frontend`.
3. Select **Vite** as the framework preset.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. *Important*: Once your backend is live, paste the production URL into the "API Endpoint" input field at the top of the live frontend UI.
