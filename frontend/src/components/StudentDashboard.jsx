import { useState } from "react";
import Courses from "./Courses.jsx";

function StudentDashboard({ auth, onLogout }) {
  const [view, setView] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
          "fixed inset-y-0 right-0 z-30 bg-slate-900 text-slate-50 border-l border-slate-800 shadow-2xl transform transition-transform duration-200 md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0 w-64" : "translate-x-full w-64 md:translate-x-0",
        ].join(" ")}
      >
        <div className="h-16 flex items-center px-5 border-b border-slate-800">
          <span className="text-lg font-semibold">پنل دانشجو</span>
        </div>

        <nav className="px-3 py-4 space-y-1 text-sm">
          <button
            onClick={() => setView("home")}
            className={menuItemClass(view === "home")}
          >
            <span>🏠</span>
            <span>صفحه اصلی</span>
          </button>

          <button
            onClick={() => setView("courses")}
            className={menuItemClass(view === "courses")}
          >
            <span>📄</span>
            <span>مشاهده‌ی دروس</span>
          </button>

          <button
            onClick={() => setView("search")}
            className={menuItemClass(view === "search")}
          >
            <span>🔍</span>
            <span>جست‌وجو و فیلتر</span>
          </button>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* بخش اصلی */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* هدر بالا */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden w-9 h-9 rounded-xl border border-slate-300 bg-white flex items-center justify-center shadow-sm"
              title="باز/بستن منو"
            >
              <span className="flex flex-col gap-0.5">
                <span className="w-4 h-0.5 bg-slate-700 rounded-full" />
                <span className="w-4 h-0.5 bg-slate-700 rounded-full" />
                <span className="w-4 h-0.5 bg-slate-700 rounded-full" />
              </span>
            </button>

            <div className="space-y-0.5">
              <div className="text-base md:text-lg font-semibold">
                پنل دانشجو
              </div>
              <div className="text-xs text-slate-500">
                دانشجو: <span className="font-medium">{auth.username}</span>
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                خوش آمدید
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                از منوی کنار می‌توانید لیست دروس را ببینید و در آینده امکان
                جست‌وجو و فیلتر هم فعال خواهد شد.
              </p>
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
                <span>بازگشت به صفحه اصلی</span>
              </button>
            </div>
          )}

          {view === "courses" && (
            <Courses accessToken={auth.accessToken} title="لیست دروس" />
          )}

          {view === "search" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-sm text-slate-600">
              بخش جست‌وجوی دروس (در حال توسعه)
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
