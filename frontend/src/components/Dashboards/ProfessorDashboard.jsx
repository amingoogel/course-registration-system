import { useState } from "react";
import DashboardLayout from "./DashboardLayout.jsx";
import GlassCard from "./GlassCard.jsx";

function ProfessorDashboard({ auth, onLogout }) {
  const [view, setView] = useState("home");

  const accentColor = "#20719b";

  const menuItems = [
    { key: "home", label: "داشبورد", icon: "🏠" },
    { key: "coursesSoon", label: "دروس (به‌زودی)", icon: "📚", disabled: true },
    { key: "gradesSoon", label: "نمرات (به‌زودی)", icon: "📝", disabled: true },
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
        <GlassCard className="p-5">
          <h2 className="text-sm font-bold mb-2">خوش آمدید 👋</h2>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            این پنل مخصوص اساتید است. امکانات مربوط به مدیریت دروس، دانشجویان و
            نمرات در مراحل بعدی اضافه خواهد شد.
          </p>
        </GlassCard>
      )}
    </DashboardLayout>
  );
}

export default ProfessorDashboard;
