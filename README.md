---

### 2. REPO BACKEND (`be-circle`)

```markdown
# ⚙️ Circle - Backend Engine (Real-time & High Performance)

[![Deployment Status](https://img.shields.io/badge/Render/Railway-Deployed-success)](https://be-circle-theta.vercel.app/)
[![Frontend Repo](https://img.shields.io/badge/Frontend-Source_Code-blue)](https://github.com/hanif411/circle-fe)

> **The Engine behind Circle.** High-performance API with Redis Caching and WebSocket integration.

---

## 🌟 Executive Summary

Backend ini adalah otak dari Circle App, dibangun dengan fokus pada kecepatan akses data (low latency) dan skalabilitas. Mengingat beban kerja media sosial yang berat pada proses "Read", sistem ini dirancang untuk menangani ribuan query dengan efisien.

- **Performance:** Menggunakan Redis Caching untuk mempercepat response time data yang sering diakses.
- **Scalability:** Arsitektur database yang terstruktur untuk menangani relasi sosial yang kompleks.

---

## 🛠️ Technical Deep Dive (English)

Designed to handle high-traffic social interactions with modern backend strategies:

- **Runtime & Framework:** Node.js with Express.js (TypeScript).
- **Performance Layer:** **Redis** implementation for caching "hot data" (threads), significantly reducing PostgreSQL load and improving response times.
- **Database & ORM:** PostgreSQL for persistent storage, managed through Prisma ORM for type-safety.
- **Real-time Engine:** WebSockets (Socket.io) for instant bi-directional communication.
- **Authentication:** Secure JWT-based auth with Bcrypt for password hashing.

---

## 🚀 Key Features & Logic

1. **Redis Caching Strategy:** Caching trending or recent threads in RAM (O(1) lookups) to avoid redundant disk-based DB queries.
2. **Complex Relations:** Managed follower/following logic, thread nested replies, and like systems.
3. **Real-time Events:** Emitting socket events for new posts and interactions.
4. **Cloudinary Integration:** Handling secure image uploads and storage.

---

## 💻 Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL & Redis
- **ORM:** Prisma
- **Real-time:** Socket.io

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/hanif411/be-circle.git](https://github.com/hanif411/be-circle.git)
   cd be-circle
   ```
2. **Install dependencies:**

   ````bash
   npm install
     ```

   ````

3. **Configure Environment Variables:**

   Create a .env file based on your database and Redis credentials.

   ```bash
   DATABASE_URL=  Your database postgres
   JWT_SECRETKEY= Your jwt secret key
   ```

4. **Run the App**

   ```bash
   npm run dev
   ```
