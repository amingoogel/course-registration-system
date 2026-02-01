import { useState } from "react";
import DashboardLayout from "./DashboardLayout.jsx";
import GlassCard from "./GlassCard.jsx";
import Courses from "../Management/Courses.jsx";

function StudentDashboard({ auth, onLogout }) {
  const [view, setView] = useState("home");

  const accentColor = "#3ec469";

  const menuItems = [
    { key: "home", label: "داشبورد", icon: "🏠" },
    { key: "courses", label: "مشاهده‌ی دروس", icon: "📄" },
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
        <GlassCard className="p-5">
          <h2 className="text-sm font-bold mb-2">خوش آمدید 👋</h2>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            از منوی سمت راست می‌توانید لیست دروس را مشاهده کرده و از امکانات
            جست‌وجو و فیلتر استفاده کنید.
          </p>
        </GlassCard>
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
    </DashboardLayout>
  );
}

export default StudentDashboard;
