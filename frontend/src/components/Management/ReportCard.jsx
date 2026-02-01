import { useEffect, useMemo, useState } from "react";
import { fetchTerms, fetchReportCard } from "../apiClient";

function toList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

function inferColumns(list) {
  const keys = new Set();
  list.forEach((row) => {
    if (row && typeof row === "object") Object.keys(row).forEach((k) => keys.add(k));
  });

  const preferred = [
    "term",
    "term_name",
    "course_code",
    "course_name",
    "units",
    "grade",
    "status",
    "result",
  ];

  const ordered = [];
  for (const k of preferred) if (keys.has(k)) ordered.push(k);
  [...keys].forEach((k) => {
    if (!ordered.includes(k)) ordered.push(k);
  });

  return ordered.slice(0, 10);
}

function colLabel(k) {
  const map = {
    term: "ترم",
    term_name: "ترم",
    course_code: "کد درس",
    course_name: "نام درس",
    units: "واحد",
    grade: "نمره",
    status: "وضعیت",
    result: "نتیجه",
  };
  return map[k] || k;
}

function ReportCard({ accessToken, accentColor = "#64748b" }) {
  const [terms, setTerms] = useState([]);
  const [termId, setTermId] = useState("");
  const [rows, setRows] = useState([]);
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const loadTerms = async () => {
      setLoadingTerms(true);
      try {
        const data = await fetchTerms(accessToken);
        setTerms(Array.isArray(data) ? data : []);
      } catch {
        setTerms([]);
      } finally {
        setLoadingTerms(false);
      }
    };

    loadTerms();
  }, [accessToken]);

  const cols = useMemo(() => inferColumns(rows), [rows]);

  const loadReport = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReportCard(accessToken, termId);
      setRows(toList(data));
    } catch (e) {
      setRows([]);
      setError(e?.message || "خطا در دریافت کارنامه.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
      <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-800">کارنامه</h2>
          {loading && <span className="text-xs text-slate-500">در حال بارگذاری...</span>}
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-end mb-3">
          <div className="w-full md:w-72 space-y-1">
            <label className="block text-xs font-medium text-slate-700">انتخاب ترم</label>
            <select
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">همه / پیش‌فرض</option>
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || `ترم ${t.id}`}
                </option>
              ))}
            </select>
            {loadingTerms && <div className="text-[11px] text-slate-500">در حال دریافت ترم‌ها...</div>}
          </div>

          <button
            type="button"
            onClick={loadReport}
            className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700"
          >
            نمایش کارنامه
          </button>
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
                {cols.map((c) => (
                  <th
                    key={c}
                    className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap"
                  >
                    {colLabel(c)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={Math.max(cols.length, 1)} className="px-3 py-4 text-center text-xs text-slate-500">
                    داده‌ای برای نمایش وجود ندارد.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={row?.id ?? idx} className="hover:bg-slate-50 transition">
                    {cols.map((c) => (
                      <td key={c} className="px-3 py-2 text-center border-b border-slate-100 whitespace-nowrap">
                        {row?.[c] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ReportCard;
