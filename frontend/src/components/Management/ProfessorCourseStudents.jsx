import { useEffect, useMemo, useState } from "react";
import {
  fetchCourses,
  fetchProfessorCourseStudents,
  removeStudentFromCourse,
} from "../apiClient";

function toList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

function ProfessorCourseStudents({ accessToken, accentColor = "#64748b" }) {
  const [courses, setCourses] = useState([]);
  const [courseCode, setCourseCode] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    const load = async () => {
      setLoadingCourses(true);
      try {
        const data = await fetchCourses(accessToken);
        setCourses(Array.isArray(data) ? data : []);
      } catch {
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    load();
  }, [accessToken]);

  const courseOptions = useMemo(() => {
    return courses
      .map((c) => ({ code: c?.code, name: c?.name }))
      .filter((x) => x.code);
  }, [courses]);

  const loadStudents = async (code) => {
    const cc = (code || courseCode).trim();
    if (!cc) return;

    setLoading(true);
    setError("");
    setMsg("");
    try {
      const data = await fetchProfessorCourseStudents(accessToken, cc);
      setStudents(toList(data));
    } catch (e) {
      setStudents([]);
      setError(e?.message || "خطا در دریافت لیست دانشجویان.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (studentNumber) => {
    if (!courseCode.trim()) return;
    const ok = window.confirm("حذف این دانشجو از این درس؟");
    if (!ok) return;

    setLoading(true);
    setError("");
    setMsg("");
    try {
      await removeStudentFromCourse(accessToken, courseCode.trim(), studentNumber);
      setMsg("دانشجو با موفقیت حذف شد.");
      await loadStudents(courseCode.trim());
    } catch (e) {
      setError(e?.message || "حذف دانشجو انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
      <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-800">دانشجویان هر درس</h2>
          {loading && <span className="text-xs text-slate-500">در حال پردازش...</span>}
        </div>

        <div className="grid gap-3 md:grid-cols-3 mb-3">
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-600 mb-1">انتخاب درس</label>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs md:text-sm bg-white"
            >
              <option value="">{loadingCourses ? "در حال بارگذاری..." : "انتخاب کنید..."}</option>
              {courseOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name || ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => loadStudents(courseCode)}
              disabled={!courseCode.trim() || loading}
              className="w-full rounded-xl bg-indigo-600 text-white py-2 text-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              نمایش دانشجویان
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 mb-3">{error}</div>
        )}
        {msg && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700 mb-3">{msg}</div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm border-separate border-spacing-0">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200">شماره دانشجویی</th>
                <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200">نام</th>
                <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {!loading && students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-xs text-slate-500">
                    موردی برای نمایش وجود ندارد.
                  </td>
                </tr>
              ) : (
                students.map((s, idx) => {
                  const sn = s?.student_number ?? s?.number ?? s?.id ?? "-";
                  const name = s?.full_name || `${s?.first_name || ""} ${s?.last_name || ""}`.trim() || s?.name || "-";
                  return (
                    <tr key={s?.id ?? idx} className="hover:bg-slate-50 transition">
                      <td className="px-3 py-2 text-center border-b border-slate-100 whitespace-nowrap">{sn}</td>
                      <td className="px-3 py-2 text-center border-b border-slate-100">{name}</td>
                      <td className="px-3 py-2 text-center border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleRemove(sn)}
                          className="text-red-600 text-xs hover:underline"
                        >
                          حذف
                        </button>
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

export default ProfessorCourseStudents;
