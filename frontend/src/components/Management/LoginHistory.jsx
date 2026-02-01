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

function LoginHistory({
  accessToken,
  accentColor = "#64748b",
  title = "تاریخچه ورود",
  pageSize = 4,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!accessToken) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchLoginHistory(accessToken);
        setItems(Array.isArray(data) ? data : []);
        setPage(1);
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
    return [...items].sort((a, b) => {
      const ta = new Date(a?.login_at || 0).getTime();
      const tb = new Date(b?.login_at || 0).getTime();
      return tb - ta;
    });
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage, pageSize]);

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  return (
    <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
      <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-slate-800">{title}</h2>
            <div className="text-[11px] text-slate-500 mt-1">
              {rows.length ? `نمایش ${Math.min(pageSize, rows.length)} مورد از ${rows.length}` : "—"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {loading && <span className="text-xs text-slate-500">در حال بارگذاری...</span>}

            {!loading && rows.length > pageSize && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={[
                    "px-3 py-1 rounded-xl text-xs border transition",
                    canPrev
                      ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                      : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed",
                  ].join(" ")}
                >
                  قبلی
                </button>

                <span className="text-xs text-slate-500 px-1">
                  {safePage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={[
                    "px-3 py-1 rounded-xl text-xs border transition",
                    canNext
                      ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                      : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed",
                  ].join(" ")}
                >
                  بعدی
                </button>
              </div>
            )}
          </div>
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
                pagedRows.map((r) => {
                  const ok = Boolean(r?.is_success);
                  return (
                    <tr
                      key={r?.id ?? `${r?.login_at}-${r?.ip_address}`}
                      className="hover:bg-slate-50 transition"
                    >
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
