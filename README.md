<div align="center">
  <img src="frontend/public/logo.svg" alt="MediCare Logo" width="80" height="80" />
  <h1>MediCare - Clinic Appointment Management System</h1>
  <p>A full-stack MEAN healthcare web application providing patients with online appointment booking and healthcare resources, and clinic staff with streamlined schedule, queue, and content management.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Angular_22-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Architecture & Tech Stack](#-architecture--tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Key Features](#-key-features)
  - [Patient (Public) Portal](#patient-public-portal)
  - [Admin (Staff & Doctor) Portal](#admin-staff--doctor-portal)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Backend Configuration](#1-backend-setup)
  - [Database Seeding](#2-database-seeding)
  - [Frontend Configuration](#3-frontend-setup)
- [API Overview](#-api-overview)
- [Default Admin Credentials](#-default-admin-credentials)
- [License](#-license)

---

## 🌟 About the Project

**MediCare** is an end-to-end clinic appointment and management solution engineered using modern web standards. It bridges the gap between healthcare providers and patients by replacing friction-heavy booking processes with an intuitive digital workflow:

1. **Patient Portal**: Allows visitors to discover clinic services, read medical health articles, schedule appointments with preferred dates and times, and upload payment receipts.
2. **Admin Portal**: Equips doctors and clinic administrators with real-time operational tools, including appointment status management, an interactive patient queue Kanban board, health blog publishing, and clinic schedule configuration.

---

## 💻 Architecture & Tech Stack

### Frontend
- **Framework:** [Angular 22](https://angular.dev/) (Standalone Components, Signals, Reactive API Interceptors)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom medical color palette and design tokens
- **Icons:** `@ng-icons` (Heroicons, Fluent UI, and FontAwesome Brands)
- **State & Data Management:** RxJS, Angular Signals, and typed service layers
- **Testing & Tools:** Vitest, ESLint, Prettier

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework:** [Express 5](https://expressjs.com/)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication & Security:** JSON Web Tokens (JWT), `bcrypt` password hashing, CORS, HTTP cookie parser, and rate limiting
- **File Uploads:** Multer with [Cloudinary](https://cloudinary.com/) storage for payment receipts and blog cover images
- **Notifications:** [Twilio](https://www.twilio.com/) for SMS notifications and WhatsApp Gateway integration for instant booking confirmations
- **Validation & Logging:** Joi schema validation, Winston loggers, and Morgan HTTP middleware

---

## 🚀 Key Features

### Patient (Public) Portal
- **Modern Responsive Landing Page**: Dynamic hero presentation, credential badges, specialty services, patient testimonials, working hours, and clinic location map.
- **5-Step Booking Workflow**:
  1. *Date & Time Selection*: Choose preferred appointment slots with real-time date availability.
  2. *Patient Information*: Capture patient details, contact numbers, and medical notes.
  3. *Payment & Verification*: Instapay transfer instructions and receipt screenshot upload.
  4. *Booking Review*: Summary review prior to final submission.
  5. *Instant Confirmation*: Reference code generation and booking status.
- **Health & Wellness Blog**: Filterable medical articles with rich formatting and category tags.
- **Direct WhatsApp Chat**: Floating contact button for instant support.

### Admin (Staff & Doctor) Portal
- **Dashboard Overview**: At-a-glance KPI metrics (total appointments, today's visits, revenue indicators, pending reviews).
- **Appointment Lifecycle Management**: Filter, search, approve, or reject appointments. Automatically triggers WhatsApp/SMS confirmation notifications to the patient upon approval.
- **Live Queue & Check-in Kanban**: Track patient flow in real time across status columns (*Waiting*, *In Consultation*, *Completed*, *Cancelled*).
- **Blog Publishing Engine**: Full CRUD management with Cloudinary image upload and rich markdown content.
- **Clinic Settings**: Manage working hours per day, consultation fees, contact details, social links, Instapay links, and doctor credentials.
- **Admin Access Control**: Multi-account administrator management with secure credential updates.

---

## 📂 Project Structure

```
clinic-appointment/
├── backend/                        # Node.js + Express REST API
│   ├── config/                     # Cloudinary, Database, and Twilio configs
│   ├── controllers/                # Route logic (admin, appointment, blog, clinic, queue)
│   ├── logs/                       # Winston combined and error log files
│   ├── middlewares/                # JWT auth, error handlers, upload, request validation
│   ├── models/                     # Mongoose schemas (Admin, Appointment, Blog, Clinic, Patient, Queue)
│   ├── routes/                     # Express routes and central API router
│   ├── utils/                      # WhatsApp gateway, SMS helper, async handler
│   ├── validators/                 # Joi validation schemas
│   ├── .env.example                # Sample environment variables
│   ├── index.js                    # Server entry point
│   ├── package.json                # Backend dependencies & scripts
│   └── seed.js                     # Initial database seeding script
│
├── frontend/                       # Angular 22 Single Page Application
│   ├── public/                     # Static assets (logo.svg, favicon.svg, favicon.ico)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # Interceptors, layout shells, auth guard & services
│   │   │   │   ├── api/            # Typed HTTP services (admin, appointment, blog, clinic, queue)
│   │   │   │   ├── auth/           # Authentication state & guard
│   │   │   │   └── layout/         # Public layout (navbar/footer) & Admin sidebar layout
│   │   │   ├── features/           # Feature modules
│   │   │   │   ├── admin/          # Admin portal (dashboard, appointments, queue, blogs, settings)
│   │   │   │   └── public/         # Public portal (home, multi-step booking, blog reader)
│   │   │   ├── shared/             # Reusable UI components (button, logo, cards, spinners, toasts)
│   │   │   ├── app.config.ts       # Angular app configuration & providers
│   │   │   └── app.routes.ts       # Application routing tree
│   │   ├── environments/           # Environment configs (development & production)
│   │   ├── index.html              # HTML shell with MediCare branding and metadata
│   │   ├── main.ts                 # Angular application bootstrap
│   │   └── styles.css              # Global styles & Tailwind CSS v4 directives
│   ├── angular.json                # Angular CLI workspace configuration
│   └── package.json                # Frontend dependencies & scripts
│
└── README.md                       # Project documentation
```

---

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your local environment:
- **Node.js** (v18.x or v20.x+ recommended)
- **npm** (v9+ or v10+)
- **MongoDB** (Local MongoDB Community Server or MongoDB Atlas cloud URI)

---

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/clinic-appointment.git
cd clinic-appointment
```

---

#### 2. Backend Setup

1. **Navigate to the backend directory and install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your actual environment details:
   ```env
   # Server Configuration
   PORT=3000

   # Database
   MONGO_URI=mongodb://localhost:27017/medicare

   # JWT Secret Key
   JWT_SECRET=your_super_secret_jwt_key

   # Cloudinary (Receipt & Blog Image Uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Twilio / WhatsApp Notifications (Optional for local testing)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   WHATSAPP_API_URL=your_whatsapp_api_url
   WHATSAPP_API_KEY=your_whatsapp_api_key

   # Frontend Client URL
   FRONTEND_URL=http://localhost:4200
   ```

3. **Seed the database with initial clinic settings and admin account:**
   ```bash
   npm run seed
   ```

4. **Start the backend server:**
   ```bash
   npm run start
   ```
   The API will be running on `http://localhost:3000`.

---

#### 3. Frontend Setup

1. **In a new terminal window, navigate to the frontend directory:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Angular development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at **`http://localhost:4200`**.

3. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled production bundles will be generated in `frontend/dist/frontend`.

---

## 🔑 Default Admin Credentials

When running `npm run seed` in the backend, the following default credentials are provisioned:

| Parameter | Value |
| :--- | :--- |
| **Login URL** | `http://localhost:4200/admin/login` |
| **Username** | `admin` |
| **Password** | `AdminPassword123!` |

> Change the default admin password in the Admin Settings panel immediately upon deploying to any production environment.

---

## 🔌 API Overview

All backend endpoints are prefixed with `/api`:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Service health check | No |
| `POST` | `/api/admin/login` | Admin authentication & session creation | No |
| `GET` | `/api/admin/profile` | Get authenticated admin profile | Yes |
| `GET` | `/api/clinic/info` | Public clinic info, hours, and contacts | No |
| `PUT` | `/api/clinic/info` | Update clinic settings & schedule | Yes |
| `POST` | `/api/appointment/book` | Submit a new appointment with receipt | No |
| `GET` | `/api/appointment` | List all appointments with filters | Yes |
| `PUT` | `/api/appointment/:id/status`| Approve, reject, or update appointment | Yes |
| `GET` | `/api/queue` | Retrieve active patient queue | Yes |
| `PUT` | `/api/queue/:id` | Update queue status (In consultation, etc.) | Yes |
| `GET` | `/api/blog` | Fetch public blog articles | No |
| `POST` | `/api/blog` | Publish a new blog post with cover image | Yes |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
