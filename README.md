# BFHL Full Stack Application

This project is a complete, modular full-stack application built for the SRM Full Stack Challenge. It consists of a Node.js/Express backend API and a modern React (Vite) frontend single-page application.

## Directory Structure

```text
bfhl-challenge/
├── backend/            ← Node.js / Express API
│   ├── controllers/
│   ├── routes/
│   ├── services/       ← Graph traversal and validation logic
│   ├── server.js
│   └── package.json
├── frontend/           ← React (Vite) SPA UI
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

## Running Locally

### 1. Start the Backend API

```bash
cd backend
npm install
npm start   # or: node server.js
```

The API will run on `http://localhost:3001`.

### 2. Start the Frontend App

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The React app will typically run on `http://localhost:5173`. Open this URL in your browser.

## API Reference

**POST** `/bfhl`  
**Content-Type:** `application/json`

### Request Payload Format

```json
{
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X", "hello"]
}
```

### Expected Response

```json
{
  "user_id": "john_doe_17091999",
  "email_id": "john@college.edu",
  "college_roll_number": "ABCD123456",
  "hierarchies": [
    { "root": "A", "tree": { "A": { "B": { "D": {} }, "C": {} } }, "depth": 3 },
    { "root": "X", "tree": {}, "has_cycle": true }
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

## Logic Rules implemented

- **Input Validation**: Accepts strictly `"X->Y"` format. Invalid formats are returned in `invalid_entries`.
- **First-parent wins**: If a node gets assigned multiple parents, the first edge processed is kept; subsequent contradictory edges are discarded.
- **Cycles**: Undirected and directed cycle groupings resolve automatically, rendering `"has_cycle": true` and a zero-depth empty tree.
- **Root Resolution**: Determines the correct root even for disjoint valid tree structures. In pure cycle loops, chooses the lexicographically smallest node.

## Deployment Instructions

### Backend Deployment (Render or Railway)

1. Push this repository to GitHub.
2. Sign up on [Render.com](https://render.com).
3. Create a **New Web Service**, connect your repo.
4. Set the Root Directory to `backend`.
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Copy your deployed URL (e.g., `https://bfhl-api.onrender.com`).

### Frontend Deployment (Vercel or Netlify)

1. Sign up on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Connect your GitHub repo.
3. Set the Root Directory to `frontend`.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`.
7. **Important**: Once deployed, open your frontend site and paste your deployed backend URL into the **API Endpoint** field in the UI.
# Bajaj-Finserv-Project
