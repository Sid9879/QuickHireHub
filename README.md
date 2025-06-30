# 💼 QuickHireHub – Freelancing Website

QuickHireHub is a full-stack freelancing platform where users can register as Clients or Freelancers, post and apply for jobs, manage profiles, showcase completed projects, and build reputation through client ratings.

### 🌐 Live Demo

👉 [https://quick-hire-hub.vercel.app/login](https://quick-hire-hub.vercel.app/login)

### 📦 GitHub Repository

🔗 [https://github.com/Sid9879/QuickHireHub](https://github.com/Sid9879/QuickHireHub)

---

## 🚀 Features

### 🔐 General

* Secure JWT-based Authentication
* Forgot Password – Users can request a password reset link via their registered email
* Role-based Access (Freelancer / Client)
* Dynamic Profile Management for both user roles
* Google Authentication login

### 👨‍🎓 Freelancer Features

* 📂 Apply to Jobs
* 🧰 Manage Projects

  * Add completed projects with GitHub/live links
  * View, edit, and delete them anytime
* 🌟 Client Ratings

  * View feedback and ratings given by clients
* 📄 Public Profile

  * Display bio, skills, projects, and reviews

### 🧑‍💼 Client Features

* 📝 Post Jobs
* 📊 View List of Applicants
* 🔍 View Full Freelancer Profiles
* ✅ Approve or Reject Freelancers
* 🌟 Rate Freelancers after job completion

---

## 🛠️ Tech Stack

### Frontend:

* React.js (with Vite)
* Redux Toolkit
* React Router
* Axios
* Tailwind CSS

### Backend:

* Node.js
* Express.js
* MongoDB with Mongoose
* JWT Authentication
* bcrypt.js
* Nodemailer (Forgot Password)
* SendGrid (Contact Form)

---

## 📌 Upcoming Features

* 💬 Real-time Chat System (WebSockets)
* 📢 Notifications (job updates, messages)
* 💳 Payment Integration (Stripe or Razorpay)

---

## 👨‍💻 Developer

**Siddharth Singh**
📧 Email: [singhsiddharth1438@gmail.com](mailto:singhsiddharth1438@gmail.com)

---

## 📁 Folder Structure

```
QuickHireHub/
├── public/
│   ├── favicon.ico
│   ├── vite.svg
│   └── index.html
├── src/
│   ├── Job/
│   │   ├── Application.jsx
│   │   ├── ClientPosted.jsx
│   │   ├── Job.jsx
│   │   ├── JobDetailsPage.jsx
│   │   └── JoblistingsPage.jsx
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   └── ViewUserProfile.jsx
│   ├── Mycomponents/
│   │   ├── ClientDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── Pages/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── ForgetPassword.jsx
│   │   ├── Login.jsx
│   │   ├── ManageProjects.jsx
│   │   ├── Profile.jsx
│   │   ├── Signup.jsx
│   │   └── UserProfile.jsx
│   ├── assets/
│   │   ├── google.png
│   │   ├── logo.png
│   │   ├── logovideo.mp4
│   │   ├── photo.avif
│   │   └── react.svg
│   ├── store/
│   │   ├── store.jsx
│   │   └── userSlice.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── README.md
├── eslint.config.js
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```



Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
