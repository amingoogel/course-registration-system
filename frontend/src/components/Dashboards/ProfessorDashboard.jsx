import { useState } from "react";
import DashboardLayout from "./DashboardLayout.jsx";
import GlassCard from "./GlassCard.jsx";
import LoginHistory from "../Management/LoginHistory.jsx";
import ProfessorCourseStudents from "../Management/ProfessorCourseStudents.jsx";

function ProfessorDashboard({ auth, onLogout }) {
  const [view, setView] = useState("home");

  const accentColor = "#20719b";

  const menuItems = [
    { key: "home", label: "داشبورد", icon: "🏠" },
    { key: "courseStudents", label: "دانشجویان درس", icon: "👥" },
  ];

  return (
    <DashboardLayout
      accentColor={accentColor}
      headerTitle="پنل استاد"
      userPrefix="استاد:"
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
              از منوی سمت راست می‌توانید دانشجویان هر درس را مشاهده و در صورت نیاز حذف کنید.
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

      {view === "courseStudents" && (
        <GlassCard className="p-4 md:p-5">
          <ProfessorCourseStudents accessToken={auth.accessToken} />
        </GlassCard>
      )}
    </DashboardLayout>
  );
}

export default ProfessorDashboard;
