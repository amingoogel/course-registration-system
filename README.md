# 🎓 University Course Registration System

A full-stack university course registration website with role-based access (**Admin / Professor / Student**).  
It supports **course & user management (admin)**, **course/student management (professor)**, and **course selection (student)**.  
The project includes a **Django REST backend** and a **React + Tailwind frontend**.

---

## ✅ Run the Project (Quick Start)

### 1) Backend (Django + DRF)

Open a **CMD/Terminal** inside the `backend` folder and run:

```bash
pip install django djangorestframework djangorestframework-simplejwt
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

**Superuser (for quick testing):**

- username: `admin`
- password: `admin`

✅ Keep this terminal open (do not close it) while using the frontend.

---

### 2) Frontend (React + Tailwind)

Open another **CMD/Terminal** inside the `frontend` folder and run:

```bash
npm install
npm install -D tailwindcss@3
npx tailwindcss init
npm run dev
```

At the end, you will get a local URL (e.g. `http://localhost:5173`).  
Open it in your browser to access the website.

---

## 🧭 How the Website Works (Workflow)

1. Create a **superuser** and log in as **Admin**.
2. Click the **three-line menu button (☰) on the top-right** to open the dashboard.
3. In **Course Management**, add the courses you need.
4. In **Terms**, create a new term and (optionally) activate/deactivate it.
5. In **User Management**, create **professors** and **students**.
6. In **Prerequisites**, define prerequisites for courses.
7. In **Unit Limit**, set minimum and maximum allowed units.
8. Now users can log in:

### 🔐 Login Rules (Professor / Student)

- **Username:** personnel number (professor) or student number (student)
- **Password:** national ID

### 🎒 Student: Course Selection

- Students can add courses to a **draft** list.
- If conditions are satisfied, they can **finalize** the selection.
- Main condition: total units must stay within **min/max unit limits** (other rules are enforced by the backend).

### 🧑‍🏫 Professor Features

- View students enrolled in a specific course
- Remove a student from that course (based on backend APIs)

---

## ⚙️ Commands (One-line Explanations)

### Backend

- `python -m venv venv` → create a virtual environment
- `venv\Scripts\activate` → activate the virtual environment (Windows)
- `pip install -r requirements.txt` → install Python dependencies
- `python manage.py migrate` → apply database migrations
- `python manage.py createsuperuser` → create an admin user
- `python manage.py runserver 8000` → run backend server on port 8000

### Frontend

- `npm install` → install Node.js dependencies
- `npm run dev` → start the development server

---

## 🧰 Tech Stack

### Backend

- **Python 3.11**
- **Django 4.5**
- **Django REST Framework (DRF)**
- **JWT Authentication** (`djangorestframework-simplejwt`)
- **SQLite**

### Frontend

- **React**
- **Vite** (dev server / build tool)
- **Tailwind CSS v3**
- API communication via a centralized client (`apiClient.js`)

---

## 📌 Notes

- Backend should run on: `http://127.0.0.1:8000`
- Use `admin/admin` for quick testing as the superuser
- Rules like prerequisites, capacity, and selection constraints are enforced by the backend
