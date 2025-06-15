# 🌟 FlexiERP Frontend

> A modern, responsive, and customizable ERP frontend built with **Angular + Tailwind CSS** to empower **MSMEs, small factories, local shops**, and **service providers** with intuitive UI and rich features.

![FlexiERP UI Banner](./assets/flexierp-banner.png)

---

## 🚀 Features

- 🌐 **Modular Navigation Sidebar** with smooth animations
- 🎨 **Dynamic Theme Support** (color wheel, live preview)
- 📱 **Fully Responsive Design** (Mobile + Desktop)
- 🌈 **Animated Background & UI Effects** using Tailwind + AOS
- 🔐 Auth-integrated UI (Login, Sign Up, Profile, Logout)
- 🧠 Smart structure for scalable development
- ⚙️ Pluggable architecture with Angular standalone components

---

## 🛠️ Tech Stack

| Frontend       | Tools / Frameworks                    |
|----------------|----------------------------------------|
| 🧩 Framework    | [Angular 17+](https://angular.io/)     |
| 🎨 Styling      | [Tailwind CSS](https://tailwindcss.com/) + Custom Animations |
| 🧠 Animations   | AOS (Animate On Scroll), Custom keyframes |
| 🧪 Forms        | Angular Reactive & Template Forms       |
| 🔁 Routing      | Angular Router                         |
| 💡 State Mgmt   | Custom Services + RxJS Observables      |

---

## 📁 Project Structure
src/
├── app/
│ ├── components/
│ │ ├── navbar/
│ │ ├── alert/
│ │ ├── wheel/
│ │ └── design/
│ ├── services/
│ │ └── colorservice.service.ts
│ ├── app.component.ts
│ └── app.routes.ts
├── assets/
│ └── (images, icons, overlays)
├── styles.css (Tailwind base + custom)
└── index.html