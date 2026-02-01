import { useEffect, useMemo, useState } from "react";
import { fetchWeeklySchedule } from "../apiClient";

function toList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

const PREFERRED_COLUMNS = [
  "course_code",
  "code",
  "course_name",
  "name",
  "day",
  "start_time",
  "end_time",
  "location",
  "professor",
  "professor_name",
];

function inferColumns(list) {
  const keys = new Set();
  list.forEach((row) => {
    if (row && typeof row === "object") Object.keys(row).forEach((k) => keys.add(k));
  });

  const ordered = [];
  for (const k of PREFERRED_COLUMNS) if (keys.has(k)) ordered.push(k);

  // باقی کلیدها
  [...keys].forEach((k) => {
    if (!ordered.includes(k)) ordered.push(k);
  });

  return ordered.slice(0, 10);
}

function colLabel(k) {
  const map = {
    course_code: "کد درس",
    code: "کد درس",
    course_name: "نام درس",
    name: "نام درس",
    day: "روز",
    start_time: "شروع",
    end_time: "پایان",
    location: "محل",
    professor: "استاد",
    professor_name: "استاد",
  };
  return map[k] || k;
}

function WeeklySchedule({ accessToken, accentColor = "#64748b" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchWeeklySchedule(accessToken);
        setData(toList(res));
      } catch (e) {
        setData([]);
        setError(e?.message || "خطا در دریافت برنامه هفتگی.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [accessToken]);

  const cols = useMemo(() => inferColumns(data), [data]);

  return (
    <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
      <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-800">برنامه هفتگی</h2>
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
                {cols.map((k) => (
                  <th
                    key={k}
                    className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap"
                  >
                    {colLabel(k)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!loading && data.length === 0 ? (
                <tr>
                  <td colSpan={cols.length || 1} className="px-3 py-4 text-center text-xs text-slate-500">
                    درسی برای نمایش وجود ندارد.
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={row?.id ?? idx} className="hover:bg-slate-50 transition">
                    {cols.map((k) => (
                      <td key={k} className="px-3 py-2 text-center border-b border-slate-100 whitespace-nowrap">
                        {row?.[k] ?? "-"}
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

export default WeeklySchedule;
