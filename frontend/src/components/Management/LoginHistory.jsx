import { useEffect, useMemo, useState } from "react";
import { fetchLoginHistory } from "../apiClient";

function formatDate(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}

function LoginHistory({ accessToken, accentColor = "#64748b", title = "تاریخچه ورود" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchLoginHistory(accessToken);
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setItems([]);
        setError(e?.message || "خطا در دریافت تاریخچه ورود.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [accessToken]);

  const rows = useMemo(() => {
    // جدیدترین بالا
    return [...items].sort((a, b) => {
      const ta = new Date(a?.login_at || 0).getTime();
      const tb = new Date(b?.login_at || 0).getTime();
      return tb - ta;
    });
  }, [items]);

  return (
    <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
      <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-800">{title}</h2>
          {loading && <span className="text-xs text-slate-500">در حال بارگذاری...</span>}
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 mb-3">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm border-separate border-spacing-0">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                  تاریخ
                </th>
                <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                  وضعیت
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-3 py-4 text-center text-xs text-slate-500">
                    سابقه‌ای ثبت نشده است.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const ok = Boolean(r?.is_success);
                  return (
                    <tr key={r?.id ?? `${r?.login_at}-${r?.ip_address}`} className="hover:bg-slate-50 transition">
                      <td className="px-3 py-2 text-center border-b border-slate-100 whitespace-nowrap">
                        {formatDate(r?.login_at)}
                      </td>
                      <td className="px-3 py-2 text-center border-b border-slate-100">
                        <span
                          className={[
                            "inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] border",
                            ok
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-red-50 border-red-200 text-red-700",
                          ].join(" ")}
                        >
                          {ok ? "موفق" : "ناموفق"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default LoginHistory;
