import { useState } from "react";
import DashboardLayout from "./DashboardLayout.jsx";
import GlassCard from "./GlassCard.jsx";
import Courses from "../Management/Courses.jsx";
import LoginHistory from "../Management/LoginHistory.jsx";
import CourseSelection from "../Management/CourseSelection.jsx";
import WeeklySchedule from "../Management/WeeklySchedule.jsx";
import ReportCard from "../Management/ReportCard.jsx";

function StudentDashboard({ auth, onLogout }) {
  const [view, setView] = useState("home");

  const accentColor = "#3ec469";

  const menuItems = [
    { key: "home", label: "داشبورد", icon: "🏠" },
    { key: "courses", label: "مشاهده‌ی دروس", icon: "📄" },
    { key: "selection", label: "انتخاب واحد", icon: "✅" },
    { key: "schedule", label: "برنامه هفتگی", icon: "🗓️" },
    { key: "reportCard", label: "کارنامه", icon: "📘" },
  ];

  return (
    <DashboardLayout
      accentColor={accentColor}
      headerTitle="پنل دانشجو"
      userPrefix="دانشجو:"
      username={auth.username}
      onLogout={onLogout}
      sidebarTitle="دسترسی"
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
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              از منوی سمت راست می‌توانید لیست دروس، انتخاب واحد، برنامه هفتگی و کارنامه را مشاهده کنید.
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

      {view === "courses" && (
        <GlassCard className="p-4 md:p-5">
          <Courses accessToken={auth.accessToken} title="لیست دروس" />
        </GlassCard>
      )}

      {view === "selection" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <GlassCard className="p-4 md:p-5">
            <CourseSelection accessToken={auth.accessToken} />
          </GlassCard>

          <GlassCard className="p-4 md:p-5">
            <Courses accessToken={auth.accessToken} title="لیست دروس" />
          </GlassCard>
        </div>
      )}

      {view === "schedule" && (
        <GlassCard className="p-4 md:p-5">
          <WeeklySchedule accessToken={auth.accessToken} />
        </GlassCard>
      )}

      {view === "reportCard" && (
        <GlassCard className="p-4 md:p-5">
          <ReportCard accessToken={auth.accessToken} />
        </GlassCard>
      )}
    </DashboardLayout>
  );
}

export default StudentDashboard;
