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

                {/* محتوا */}
                <main
          style={{
            padding: "18px",
            flex: 1,
          }}
        >
          {view === "home" && (
            <></>
          )}

          {view === "dashboard-menu" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <button
                onClick={() => setView("manageCourses")}
                style={{
                  border: "none",
                  borderRadius: "16px",
                  padding: "18px 16px",
                  textAlign: "right",
                  backgroundColor: colors.card,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                📚 مدیریت دروس
                <div
                  style={{
                    fontSize: "12px",
                    color: "#555",
                    marginTop: "6px",
                  }}
                >
                  افزودن، ویرایش و حذف دروس
                </div>
              </button>

              <button
                onClick={() => setView("courseList")}
                style={{
                  border: "none",
                  borderRadius: "16px",
                  padding: "18px 16px",
                  textAlign: "right",
                  backgroundColor: colors.card,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                📄 لیست دروس
                <div
                  style={{
                    fontSize: "12px",
                    color: "#555",
                    marginTop: "6px",
                  }}
                >
                  مشاهده‌ی تمامی دروس
                </div>
              </button>
            </div>
          )}

          {/* دکمه بازگشت، فقط وقتی در مدیریت دروس یا لیست دروس هستیم */}
          {(view === "manageCourses" || view === "courseList") && (
            <div style={{ marginBottom: "12px" }}>
              <button
                type="button"
                onClick={() => setView("dashboard-menu")}
                style={backButtonStyle}
              >
                ⬅ بازگشت به داشبورد
              </button>
            </div>
          )}

          {view === "manageCourses" && (
            <CourseManager accessToken={auth.accessToken} />
          )}

          {view === "courseList" && (
            <Courses accessToken={auth.accessToken} />
          )}
        </main>

      </div>

    </div>

    </div>
  );
}

export default AdminDashboard;
