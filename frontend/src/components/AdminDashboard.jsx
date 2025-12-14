import { useState } from "react";
import CourseManager from "./CourseManager.jsx";
import Courses from "./Courses.jsx";
import PrerequisiteManager from "./PrerequisiteManager.jsx";
import UnitLimitManager from "./UnitLimitManager.jsx";
import UserRegisterManager from "./UserRegisterManager.jsx";

function AdminDashboard({ auth, onLogout }) {
  const [view, setView] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const menuItemClass = (active) =>
    [
      "w-full text-right px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors",
      active
        ? "bg-slate-800/60 text-white"
        : "text-slate-200 hover:bg-slate-800/40",
    ].join(" ");

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900">

      {/* سایدبار */}
      <aside
        className={[
          "fixed inset-y-0 right-0 z-30 bg-slate-900 text-slate-50 border-l border-slate-800 shadow-2xl transform transition-transform duration-200 w-64",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="h-16 flex items-center px-5 border-b border-slate-800">
          <span className="text-lg font-semibold">پنل مدیریت</span>
        </div>

        <nav className="px-3 py-4 space-y-1 text-sm">
          <button
            onClick={() => {
              setView("home");
              setSidebarOpen(false);
            }}
            className={menuItemClass(view === "home")}
          >
            <span>🏠</span>
            <span>داشبورد</span>
          </button>

          <button
            onClick={() => {
              setView("manageCourses");
              setSidebarOpen(false);
            }}
            className={menuItemClass(view === "manageCourses")}
          >
            <span>📚</span>
            <span>مدیریت دروس</span>
          </button>

          <button
            onClick={() => {
              setView("courseList");
              setSidebarOpen(false);
            }}
            className={menuItemClass(view === "courseList")}
          >
            <span>📄</span>
            <span>لیست دروس</span>
          </button>

          <button
            onClick={() => {
              setView("users");
              setSidebarOpen(false);
            }}
            className={menuItemClass(view === "users")}
          >
            <span>👤</span>
            <span>مدیریت کاربران</span>
          </button>

          <button
            onClick={() => {
              setView("managePrerequisites");
              setSidebarOpen(false);
            }}
            className={menuItemClass(view === "managePrerequisites")}
          >
            <span>📘</span>
            <span>مدیریت پیش‌نیازها</span>
          </button>

          <button
            onClick={() => {
              setView("manageUnits");
              setSidebarOpen(false);
            }}
            className={menuItemClass(view === "manageUnits")}
          >
            <span>🧮</span>
            <span>تعیین حد واحدها</span>
          </button>
        </nav>
      </aside>

      {/* لایه تاریک موبایل */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* محتوای اصلی */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* هدر */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="w-9 h-9 rounded-xl border border-slate-300 bg-white flex items-center justify-center shadow-sm"
            >
              <span className="flex flex-col gap-0.5">
                <span className="w-4 h-0.5 bg-slate-700 rounded-full"></span>
                <span className="w-4 h-0.5 bg-slate-700 rounded-full"></span>
                <span className="w-4 h-0.5 bg-slate-700 rounded-full"></span>
              </span>
            </button>

            <div className="text-right">
              <div className="text-base md:text-lg font-semibold">
                پنل مدیریت
              </div>
              <div className="text-xs text-slate-500">
                کاربر:{" "}
                <span className="font-medium">{auth.username}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-xs md:text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 shadow-sm"
          >
            خروج
          </button>
        </header>

        {/* محتوا */}
        <main className="flex-1 px-4 md:px-6 py-4 md:py-6 space-y-4">

          {view === "home" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
                <h2 className="text-sm font-semibold mb-2">
                  خوش آمدید 👋
                </h2>
                <p className="text-xs md:text-sm text-slate-600">
                  از منوی سمت راست می‌توانید دروس، پیش‌نیازها و تنظیمات
                  انتخاب واحد را مدیریت کنید.
                </p>
              </div>
            </div>
          )}

          {view !== "home" && (
            <div>
              <button
                onClick={() => setView("home")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <span>⬅</span>
                <span>بازگشت</span>
              </button>
            </div>
          )}

          {view === "manageCourses" && (
            <CourseManager accessToken={auth.accessToken} />
          )}

          {view === "courseList" && (
            <Courses
              accessToken={auth.accessToken}
              title="لیست کامل دروس"
            />
          )}

          {view === "users" && (
            <UserRegisterManager accessToken={auth.accessToken} />
          )}


          {view === "managePrerequisites" && (
            <PrerequisiteManager accessToken={auth.accessToken} />
          )}


          {view === "manageUnits" && (
            <UnitLimitManager accessToken={auth.accessToken} />
          )}

         

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
