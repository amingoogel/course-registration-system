import { useState } from "react";
import DashboardLayout from "./DashboardLayout.jsx";
import GlassCard from "./GlassCard.jsx";

import CourseManager from "../Management/CourseManager.jsx";
import Courses from "../Management/Courses.jsx";
import PrerequisiteManager from "../Management/PrerequisiteManager.jsx";
import UnitLimitManager from "../Management/UnitLimitManager.jsx";
import UserRegisterManager from "../Management/UserRegisterManager.jsx";
import TermManager from "../Management/TermManager.jsx";
import LoginHistory from "../Management/LoginHistory.jsx";


function AdminDashboard({ auth, onLogout }) {
  const [view, setView] = useState("home");

  const accentColor = "#bdb32b";

  const menuItems = [
    { key: "home", label: "داشبورد", icon: "🏠" },
    { key: "manageCourses", label: "مدیریت دروس", icon: "📚" },
    { key: "courseList", label: "لیست دروس", icon: "📄" },
    { key: "users", label: "مدیریت کاربران", icon: "👤" },
    { key: "managePrerequisites", label: "مدیریت پیش‌نیازها", icon: "📘" },
    { key: "manageUnits", label: "تعیین حد واحدها", icon: "🧮" },
    { key: "terms", label: "نیم‌سال‌ها", icon: "🗓️" },
  ];

  return (
    <DashboardLayout
      accentColor={accentColor}
      headerTitle="پنل مدیریت"
      userPrefix="کاربر:"
      username={auth.username}
      onLogout={onLogout}
      sidebarTitle="پنل مدیریت"
      menuItems={menuItems}
      activeView={view}
      onChangeView={setView}
    >
      {view === "home" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <LoginHistory accessToken={auth.accessToken} accentColor={accentColor} />
          </div>
          <GlassCard className="p-5 md:col-span-2">
            <h2 className="text-sm font-bold mb-2">خوش آمدید 👋</h2>
            <p className="text-xs md:text-sm text-slate-700 leading-6">
              از منوی سمت راست می‌توانید دروس، پیش‌نیازها، نیم‌سال‌ها و تنظیمات انتخاب واحد را
              مدیریت کنید.
            </p>
          </GlassCard>
        </div>
      )}

      {view !== "home" && (
        <div>
          <button
            onClick={() => setView("home")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/8 backdrop-blur-md px-4 py-2 text-xs md:text-sm text-slate-800 hover:bg-white/12 transition shadow-sm"
          >
            <span>⬅</span>
            <span>بازگشت</span>
          </button>
        </div>
      )}

      {view === "manageCourses" && (
        <GlassCard className="p-4 md:p-5">
          <CourseManager accessToken={auth.accessToken} />
        </GlassCard>
      )}

      {view === "courseList" && (
        <GlassCard className="p-4 md:p-5">
          <Courses accessToken={auth.accessToken} title="لیست کامل دروس" />
        </GlassCard>
      )}

      {view === "users" && (
        <GlassCard className="p-4 md:p-5">
          <UserRegisterManager accessToken={auth.accessToken} />
        </GlassCard>
      )}

      {view === "managePrerequisites" && (
        <GlassCard className="p-4 md:p-5">
          <PrerequisiteManager accessToken={auth.accessToken} />
        </GlassCard>
      )}

      {view === "manageUnits" && (
        <GlassCard className="p-4 md:p-5">
          <UnitLimitManager accessToken={auth.accessToken} />
        </GlassCard>
      )}

      {view === "terms" && (
        <GlassCard className="p-4 md:p-5">
          <TermManager accessToken={auth.accessToken} />
        </GlassCard>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;
