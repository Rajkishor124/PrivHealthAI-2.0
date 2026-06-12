# PrivHealthAI 🩺✨

**PrivHealthAI** is a state-of-the-art, enterprise-grade AI-powered healthcare portal designed to streamline patient care, doctor booking, and medical symptom assessment. By integrating robust enterprise backend systems with advanced React frontend layouts and AI consultation pipelines, the platform empowers patients to better understand their health and access high-quality medical professionals efficiently.

---

## 🚀 Key Benefits

### 👤 For Patients
- **Instant Symptom Insights:** Get instant AI-generated symptom assessments with risk scores, potential conditions, and recommended specialists before visiting a clinic.
- **24/7 AI Health Companion:** Consult a real-time AI medical assistant to discuss health queries, understand warning signs, and clarify wellness topics.
- **Simplified Scheduling:** Search, filter, and instantly book appointments with specialized medical professionals.
- **Verified Feedback:** Make informed decisions by reading verified public ratings and reviews left by other patients.
- **Convenient Profile Hub:** Manage booked appointments, maintain a favorites list of doctors, and keep profile details updated.

### 🏥 For Healthcare Providers & Organizations
- **Reduced ER & Clinic Congestion:** Symptom assessments categorize severity levels (Low, Medium, High), preventing unnecessary visits for minor symptoms while prioritizing urgent cases.
- **Accurate Patient Matching:** Symptom assessments route patients to the correct specialization (e.g., Cardiologist, Dermatologist), increasing booking efficiency.
- **Data Integrity & Consistency:** Seamless E.164 phone normalization eliminates duplicate patient registrations and accounts, ensuring unique patient records.

### 🛡️ For Administrators & Security Teams
- **Secure Token Authentication:** Role-based access control secured using JWT (JSON Web Tokens) prevents unauthorized access to private clinical resources.
- **Automated Schema Control:** Flyway-driven database migrations manage structural and seed data alterations safely.
- **Centralized Insights:** Live administrative dashboard monitors user sign-ups, system-wide appointment statistics, and registered doctor directories.

---

## 🌟 Core Features

### 1. 🔒 Enterprise Indian Phone Number Authentication
- **Multi-Format Normalization:** Accepts numerous formats (`9334456119`, `09334456119`, `+919334456119`, `91-9334456119`, `+91 93344 56119`, etc.) and automatically parses/normalizes them to a single E.164 format: `+919334456119`.
- **Duplicate Prevention:** Prevents multiple accounts for the same physical number.
- **Legacy Token Handling:** Validates and matches old/legacy JWT session tokens on-the-fly to guarantee zero downtime login.
- **Display Standardization:** Standardizes the formatting of numbers across the UI as `+91 93344 56119` for premium user aesthetics.

### 2. 🔍 Doctor Directory & Smart Search
- **Advanced Query Filters:** Search doctors by name, specialization, hospital affiliation, or city.
- **Paginated Listing:** High-performance database pagination to ensure fast loading times even under heavy directory loads.
- **Comprehensive Profiles:** View essential information such as operating hours, consult fees, clinic addresses, contact details, and aggregated reviews.

### 3. 🧠 AI-Powered Symptom Assessment
- **Detailed Intake Form:** Patient age, gender, and multi-line symptom entries are analyzed.
- **Intelligent Risk Scoring:** Computes risk indices alongside clear visual indicator levels (Low, Medium, High).
- **Comprehensive Outputs:** Returns possible medical conditions, suggested generic or over-the-counter medicines, recommended specialized doctor paths, and critical AI advice/warnings.

### 4. 💬 AI Healthcare Chatbot
- **Interactive Conversational UI:** Speak directly with an AI chatbot to clarify wellness issues.
- **Emergency Warnings:** Automatically warns patients when symptoms point to emergency indicators.
- **Secure Chat Logging:** Saves chat history securely linked to the patient profile for future reference.

### 5. 📅 Appointment Booking & Management
- **Seamless Scheduling:** Book calendar slots with selected medical specialists.
- **Patient Dashboard:** View scheduled appointments, track state statuses (`BOOKED`, `CANCELLED`, `COMPLETED`), and cancel bookings when plans change.

### 6. ⭐ Verified Reviews & Ratings
- **Double-Blind Submission:** Submit a star rating (1 to 5) and textual comment for consulted doctors.
- **Aggregated Summaries:** Dynamically displays the average score and list of patient feedback on the doctor's profile page.

### 7. ❤️ Patient Bookmarks / Favorites
- **One-Tap Bookmark:** Flag preferred doctors for instant access.
- **Dedicated Panel:** Save time by maintaining a list of favorite doctors in the profile dashboard.

### 8. 📊 Administrative Control Center
- **System Statistics:** Visualize total patient signups, active doctor directories, and overall booked appointments.
- **User & Doctor Management:** View and manage user records, doctors, and scheduling configurations.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite | Modern, blazing-fast, typed web application layout |
| **Styling** | Tailwind CSS 4, CSS 3 | Harmonious colors, sleek layouts, and premium glassmorphism |
| **State Manager**| Redux Toolkit | Centralized state management for user authentication and UI states |
| **Backend** | Java 21, Spring Boot 3.3 | Enterprise-grade REST backend framework |
| **Security** | Spring Security & JWT | Role-based authentication (`ROLE_USER`, `ROLE_ADMIN`) |
| **Database** | PostgreSQL 15+ | Relational data persistence |
| **Migrations** | Flyway DB | Versioned schema control and developer seeding |
| **API Docs** | SpringDoc OpenAPI 3 | Automatic documentation & Swagger UI interface |

---

## 📂 Project Structure

```
PrivHealthAI/
├── backend/            # Spring Boot REST API
│   ├── src/main/java   # Backend source code (com.privhealthai.*)
│   ├── src/resources   # Database migrations (Flyway) & configurations
│   └── pom.xml         # Maven build definitions
├── frontend/           # React SPA Client
│   ├── src/components  # Reusable UI component elements
│   ├── src/pages       # Router page components
│   ├── src/services    # Backend API connectors (Axios client)
│   └── package.json    # Frontend dependency list
└── docs/               # System architecture and specifications
```

---

## ⚙️ Quick Start & Installation

### Prerequisites
- **Java Development Kit (JDK) 21**
- **Apache Maven 3.9+**
- **Node.js 20+** and **npm 10+**
- **PostgreSQL 15+** (Local or cloud database instance)

---

### Step 1: Database Setup
Make sure PostgreSQL is running and create the project database:
```bash
psql -U postgres -c "CREATE DATABASE privhealthai;"
```

---

### Step 2: Backend Configuration & Start
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Copy and configure the environment variables:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and fill in your PostgreSQL username, password, and JWT configurations:
   ```env
   DB_URL=jdbc:postgresql://localhost:5402/privhealthai
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_base64_jwt_secret_key_minimum_256_bits
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will boot on port `8080`. Flyway will run database migrations automatically.*

---

### Step 3: Frontend Configuration & Start
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend client will boot on port `5173` (http://localhost:5173).*

---

## 🔗 Key Endpoints & APIs

- **Client App Interface:** `http://localhost:5173`
- **REST Backend API Base:** `http://localhost:8080/api`
- **Swagger Documentation:** `http://localhost:8080/swagger-ui/index.html`
- **Actuator Health Check:** `http://localhost:8080/actuator/health`

---

## 🔒 Security & Roles
The application implements two main roles:
1. `ROLE_USER` (Patients): Can query doctors, book appointments, submit assessments, chat with the AI chatbot, write reviews, and bookmark favorites.
2. `ROLE_ADMIN` (Administrators): Can access administrative stats, audit users, manage doctors, and view all scheduled appointments.
