import { useState } from "react";

function DashboardLayout({
  accentColor,
  headerTitle,
  userPrefix, // مثلا: "کاربر:" یا "دانشجو:" یا "استاد:"
  username,
  onLogout,
  sidebarTitle = "دسترسی",
  menuItems = [],
  activeView,
  onChangeView,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // ✅ استایل شیشه‌ای ثابت برای کل پروژه
  const glassBox =
    "bg-white/6 backdrop-blur-lg border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";

  const menuItemClass = (active) =>
    [
      "w-full text-right px-4 py-2.5 rounded-2xl text-sm flex items-center gap-2 transition",
      glassBox,
      "hover:bg-white/10",
      active ? "text-slate-900 font-semibold" : "text-slate-700",
    ].join(" ");

  const disabledItemClass =
    "w-full text-right px-4 py-2.5 rounded-2xl text-sm flex items-center gap-2 border border-white/20 bg-white/4 backdrop-blur-lg text-slate-400 cursor-not-allowed";

  return (
    <div className="min-h-screen flex text-slate-900 bg-slate-100">
      {/* بک‌گراند ملایم برای زیبایی شیشه */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200" />

      {/* ✅ سایدبار شیشه‌ای */}
      <aside
        className={[
          "fixed inset-y-0 right-0 z-30 w-72",
          "transform transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
          "bg-white/7 backdrop-blur-xl border-l border-white/20",
          "shadow-[0_25px_80px_rgba(0,0,0,0.20)]",
        ].join(" ")}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/20">
          <span className="text-lg font-bold">{sidebarTitle}</span>

          <button
            onClick={() => setSidebarOpen(false)}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/15 transition border border-white/20"
            title="بستن"
          >
            ✖
          </button>
        </div>

        <nav className="px-4 py-4 space-y-2 text-sm">
          {menuItems.map((item) => {
            if (item.disabled) {
              return (
                <button key={item.key} disabled className={disabledItemClass}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => {
                  onChangeView(item.key);
                  setSidebarOpen(false);
                }}
                className={menuItemClass(activeView === item.key)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* بک‌دراپ برای موبایل */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ بخش اصلی */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* ✅ هدر: نوار رنگی + کادر سفید جدا */}
        <header className="sticky top-0 z-10">
          {/* نوار رنگی */}
          <div className="h-4 w-full" style={{ backgroundColor: accentColor }} />

          {/* کادر سفید */}
          <div className="px-4 md:px-6 py-3">
            <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm px-4 md:px-5 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSidebar}
                  className="w-10 h-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition flex items-center justify-center"
                  title="منو"
                >
                  <span className="flex flex-col gap-1">
                    <span className="w-4 h-0.5 bg-slate-700 rounded-full" />
                    <span className="w-4 h-0.5 bg-slate-700 rounded-full" />
                    <span className="w-4 h-0.5 bg-slate-700 rounded-full" />
                  </span>
                </button>

                <div className="text-right">
                  <div className="text-base md:text-lg font-bold">
                    {headerTitle}
                  </div>
                  <div className="text-xs text-slate-500">
                    {userPrefix}{" "}
                    <span className="font-semibold">{username}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="text-xs md:text-sm px-4 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm"
              >
                خروج
              </button>
            </div>
          </div>
        </header>

        {/* محتوا */}
        <main className="flex-1 px-4 md:px-6 py-5 md:py-7 space-y-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
