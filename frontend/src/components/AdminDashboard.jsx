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
          <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        direction: "rtl",
        backgroundColor: colors.background,
      }}
    >
      {/* سایدبار */}
      <aside
        style={{
          width: sidebarOpen ? "220px" : "0px",
          overflow: "hidden",
          backgroundColor: colors.sidebar,
          borderLeft: `1px solid ${colors.border}`,
          transition: "width 0.2s ease",
          boxShadow: sidebarOpen
            ? "0 0 24px rgba(0,0,0,0.08)"
            : "none",
          zIndex: 2,
        }}
      >
        <div style={{ padding: "16px 18px" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "20px",
              marginBottom: "0px",
            }}
          >
            دسترسی
          </div>
        </div>

        <nav style={{ padding: "8px 4px" }}>
          <button
            onClick={() => setView("home")}
            style={{
              width: "100%",
              textAlign: "right",
              padding: "10px 16px",
              border: "none",
              backgroundColor:
                view === "home" ? "rgba(0,0,0,0.04)" : "transparent",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "13px",
              marginBottom: "4px",
            }}
          >
            🏠 صفحه اصلی
          </button>

          <button
            onClick={() => setView("dashboard-menu")}
            style={{
              width: "100%",
              textAlign: "right",
              padding: "10px 16px",
              border: "none",
              backgroundColor: isDashboardView
                ? "rgba(0,0,0,0.04)"
                : "transparent",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            📊 داشبورد
          </button>
        </nav>
      </aside>

            {/* بخش اصلی */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* هدر بالا */}
        <header
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* آیکن سه‌خط */}
            <button
              onClick={toggleSidebar}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                border: `1px solid ${colors.border}`,
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="باز/بستن منو"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#333",
                  }}
                />
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#333",
                  }}
                />
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#333",
                  }}
                />
              </div>
            </button>

            <div>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>
                پنل مدیریت
              </div>
              <div style={{ fontSize: "12px", color: "#777" }}>
                کاربر: {auth.username}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: `1px solid ${colors.border}`,
              backgroundColor: "#fff",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            خروج
          </button>
        </header>

        {/* محتوا بعداً تکمیل می‌شود */}
      </div>

    </div>

    </div>
  );
}

export default AdminDashboard;
