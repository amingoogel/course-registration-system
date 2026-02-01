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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlassCard className="p-5 lg:col-span-2">
            <h2 className="text-sm font-bold mb-2">نمای کلی</h2>

            <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
              <div className="mb-1">
                <span className="text-slate-500">کاربر:</span>{" "}
                <span className="font-semibold">{auth.username}</span>
              </div>

              <div className="mb-1">
                <span className="text-slate-500">نقش:</span>{" "}
                <span className="font-semibold">دانشجو</span>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                تاریخچه ورود پایین صفحه، هر بار ۴ مورد را نشان می‌دهد (با دکمه‌های صفحه‌بندی).
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 lg:col-span-1">
            <h2 className="text-sm font-bold mb-3">میانبرها</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setView("courses")}
                className="rounded-2xl border border-white/20 bg-white/8 backdrop-blur-md px-3 py-2 text-xs text-slate-800 hover:bg-white/12 transition shadow-sm"
              >
                لیست دروس
              </button>
              <button
                type="button"
                onClick={() => setView("selection")}
                className="rounded-2xl border border-white/20 bg-white/8 backdrop-blur-md px-3 py-2 text-xs text-slate-800 hover:bg-white/12 transition shadow-sm"
              >
                انتخاب واحد
              </button>
              <button
                type="button"
                onClick={() => setView("schedule")}
                className="rounded-2xl border border-white/20 bg-white/8 backdrop-blur-md px-3 py-2 text-xs text-slate-800 hover:bg-white/12 transition shadow-sm"
              >
                برنامه
              </button>
              <button
                type="button"
                onClick={() => setView("reportCard")}
                className="rounded-2xl border border-white/20 bg-white/8 backdrop-blur-md px-3 py-2 text-xs text-slate-800 hover:bg-white/12 transition shadow-sm"
              >
                کارنامه
              </button>
            </div>
          </GlassCard>

          <div className="lg:col-span-3">
            <LoginHistory
              accessToken={auth.accessToken}
              accentColor={accentColor}
              title="تاریخچه ورود"
              pageSize={4}
            />
          </div>
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
