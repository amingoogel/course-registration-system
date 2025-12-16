import { useState, useEffect } from "react";
import { fetchCourses } from "./apiClient";

function Courses({ accessToken, title = "لیست دروس" }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ سرچ‌ها
  const [courseQuery, setCourseQuery] = useState("");
  const [profQuery, setProfQuery] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const loadCourses = async () => {
      setLoading(true);
      setMessage("");
      try {
        const data = await fetchCourses(accessToken);
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setMessage(err.message || "خطا در دریافت لیست دروس.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [accessToken]);

  // ✅ فیلتر شدن لیست بر اساس نام/کد درس و نام استاد
  const filteredCourses = courses.filter((course) => {
    const courseName = (course.name ?? "").toLowerCase();
    const courseCode = (course.code ?? "").toLowerCase();

    // مهم: اگر بک‌اند professor_name بده، از اون استفاده می‌کنیم
    const profName = (course.professor_name ?? course.professor ?? "").toLowerCase();

    const cq = courseQuery.trim().toLowerCase();
    const pq = profQuery.trim().toLowerCase();

    const matchCourse = !cq || courseName.includes(cq) || courseCode.includes(cq);
    const matchProf = !pq || profName.includes(pq);

    return matchCourse && matchProf;
  });

  const clearFilters = () => {
    setCourseQuery("");
    setProfQuery("");
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-semibold text-slate-800">
          {title}
        </h2>
        {loading && (
          <span className="text-xs text-slate-500">در حال بارگذاری...</span>
        )}
      </div>

      {message && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 mb-3">
          {message}
        </div>
      )}

      {/* ✅ سرچ/فیلتر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <input
          value={courseQuery}
          onChange={(e) => setCourseQuery(e.target.value)}
          placeholder="جستجو بر اساس نام/کد درس..."
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        <input
          value={profQuery}
          onChange={(e) => setProfQuery(e.target.value)}
          placeholder="جستجو بر اساس نام استاد..."
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        <div className="md:col-span-2 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-500">
            {loading
              ? ""
              : `تعداد نتایج: ${filteredCourses.length} از ${courses.length}`}
          </div>

          <button
            onClick={clearFilters}
            className="text-xs md:text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 shadow-sm"
            type="button"
          >
            پاک کردن فیلترها
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm border-separate border-spacing-0">
          <thead className="bg-slate-50">
            <tr>
              {[
                "کد",
                "نام درس",
                "ظرفیت",
                "واحد",
                "روز",
                "شروع کلاس",
                "پایان کلاس",
                "محل",
                "استاد",
              ].map((head) => (
                <th
                  key={head}
                  className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredCourses.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-4 text-center text-xs text-slate-500"
                >
                  نتیجه‌ای پیدا نشد.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {course.code}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {course.name}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {course.capacity ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {course.units ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {course.day || "-"}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {course.start_time || "-"}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {course.end_time || "-"}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {course.location || "-"}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {/* ✅ اینجا استاد را درست نمایش می‌دهیم */}
                    {course.professor_name || course.professor || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Courses;
