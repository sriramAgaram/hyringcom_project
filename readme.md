# Real-Time Shared Task Board

A shared, live-syncing Kanban task board built using a decoupled React and Node.js architecture. Every mutation seamlessly updates across all active browser windows in real-time.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, PrimeReact, Lucide-React, Axios
- **Backend:** Node.js, Express, Socket.IO (MVC Architecture)
- **Database:** PostgreSQL (Supabase) via native `pg` driver

---

## Live Link:
https://hyringcom-project-5h79.onrender.com

## 🚀 Setup & Local Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- A running PostgreSQL database instance (or Supabase project connection string)

### 1. Database Setup
Execute the queries inside `backend/schema.sql` on your Postgres client to initialize the `card_status` ENUM, the `cards` table, the `card_history` table, and the corresponding performance indexes.

### 2. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create your local environment file: `cp .env.example .env` and populate your database string and port.
4. Start the server: `npm run dev` (or `node server.js`)

### 3. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create your local environment file: `cp .env.example .env` and specify your backend URL (`VITE_API_URL=http://localhost:5000`).
4. Start the development server: `npm run dev`

---

## 💡 Key Architectural Decisions & Trade-offs

- **Primary Key Choice (BIGINT Identity):** Used sequential `BIGINT` auto-generation for optimal B-Tree index memory efficiency and ultra-fast writes compared to raw UUIDs.
- **Card Ordering Logic:** Implemented a `DOUBLE PRECISION` float system for card positions. This avoids expensive massive row updates during drag-and-drop actions, allowing middle-inserts via simple math fractions ($pos = \frac{pos_1 + pos_2}{2}$).
- **History Tracking via Transactions:** Card movements write to both `cards` and `card_history` tables within a strict SQL transaction block (`BEGIN` / `COMMIT`). This guarantees atomic safety, ensuring history records are never lost or mismatched if a network connection drops mid-flight.


## ✨ Implemented Bonuses
- **Presence Tracking (+):** Leveraged Socket.IO engine connection tracking to broadcast an instant count of active users currently viewing the board.
- **Movement History Log (+):** Created transactional auditing tables capturing historical card migrations complete with precise state indicators.

