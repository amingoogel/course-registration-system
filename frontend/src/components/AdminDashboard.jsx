import { useState } from "react";
import CourseManager from "./CourseManager.jsx";
import Courses from "./Courses.jsx";

const colors = {
  background: "#F9F8F6",
  sidebar: "#EFE9E3",
  border: "#D9CFC7",
  card: "#9CC6DB",
};

// کامپوننت اصلی داشبورد ادمین
function AdminDashboard({ auth, onLogout }) {

  const [view, setView] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const isDashboardView =
    view === "dashboard-menu" ||
    view === "manageCourses" ||
    view === "courseList";

  const backButtonStyle = {
    padding: "6px 12px",
    borderRadius: "10px",
    border: `1px solid ${colors.border}`,
    backgroundColor: "#fff",
    fontSize: "12px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        direction: "rtl",
        backgroundColor: colors.background,
      }}
    >
      {/* سایدبار بعداً اضافه می‌شود */}
      {/* بخش اصلی بعداً تکمیل می‌شود */}
    </div>
  );
}

export default AdminDashboard;
