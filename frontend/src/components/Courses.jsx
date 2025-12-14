import { useState, useEffect } from "react";
import { fetchCourses } from "./apiClient";

function Courses({ accessToken, title = "لیست دروس" }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
            {courses.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-4 text-center text-xs text-slate-500"
                >
                  درسی ثبت نشده است.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
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
                    {course.professor || "-"}
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
