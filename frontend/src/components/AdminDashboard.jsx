import { useState } from "react";
import CourseManager from "./CourseManager.jsx";
import Courses from "./Courses.jsx";

function AdminDashboard({ auth, onLogout }) {
  const [view, setView] = useState("home");
  // sidebar ابتدا بسته باشد
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
          // حالا نمایش سایدبار فقط با توجه به state انجام میشه (در همه سایزها در ابتدا بسته است)
          "fixed inset-y-0 right-0 z-30 bg-slate-900 text-slate-50 border-l border-slate-800 shadow-2xl transform transition-transform duration-200",
          sidebarOpen ? "translate-x-0 w-64" : "translate-x-full w-64",
        ].join(" ")}
      >
        <div className="h-16 flex items-center px-5 border-b border-slate-800">
          <span className="text-lg font-semibold">دسترسی</span>
        </div>

        <nav className="px-3 py-4 space-y-1 text-sm">
          <button
            onClick={() => { setView("home"); setSidebarOpen(false); }}
            className={menuItemClass(view === "home")}
          >
            <span>🏠</span>
            <span>صفحه اصلی</span>
          </button>

          <button
            onClick={() => { setView("manageCourses"); setSidebarOpen(false); }}
            className={menuItemClass(view === "manageCourses")}
          >
            <span>📚</span>
            <span>مدیریت دروس</span>
          </button>

          <button
            onClick={() => { setView("courseList"); setSidebarOpen(false); }}
            className={menuItemClass(view === "courseList")}
          >
            <span>📄</span>
            <span>لیست دروس</span>
          </button>

          <button
            onClick={() => { setView("managePrerequisites"); setSidebarOpen(false); }}
            className={menuItemClass(view === "managePrerequisites")}
          >
            <span>📘</span>
            <span>مدیریت پیش‌نیازها</span>
          </button>

          <button
            onClick={() => { setView("manageUnits"); setSidebarOpen(false); }}
            className={menuItemClass(view === "manageUnits")}
          >
            <span>🧮</span>
            <span>مدیریت واحدها</span>
          </button>
        </nav>
      </aside>

      {/* لایه تاریک برای موبایل / وقتی سایدبار باز است */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* بخش اصلی */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* هدر بالا */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
          {/* دکمه همبرگری + عنوان + نام کاربر در سمت راست */}
          <div className="flex items-center gap-3">
            {/* دکمه منو */}
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

            {/* عنوان و کاربر */}
            <div className="text-right space-y-0.5">
              <div className="text-base md:text-lg font-semibold">پنل مدیریت</div>
              <div className="text-xs text-slate-500">
                کاربر: <span className="font-medium">{auth.username}</span>
              </div>
            </div>
          </div>

          {/* دکمه خروج در سمت چپ */}
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
                <h2 className="text-sm font-semibold text-slate-800 mb-2">خوش آمدید</h2>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  از منوی سمت راست می‌توانید دروس را مدیریت کنید.
                </p>
              </div>
            </div>
          )}

          {view !== "home" && (
            <div className="mb-2">
              <button
                type="button"
                onClick={() => setView("home")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <span>⬅</span>
                <span>بازگشت</span>
              </button>
            </div>
          )}

          {view === "manageCourses" && <CourseManager accessToken={auth.accessToken} />}
          {view === "courseList" && <Courses accessToken={auth.accessToken} title="لیست دروس" />}
          {view === "managePrerequisites" && <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-sm text-slate-600">بخش مدیریت پیش‌نیازها</div>}
          {view === "manageUnits" && <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-sm text-slate-600">بخش مدیریت واحدها</div>}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
