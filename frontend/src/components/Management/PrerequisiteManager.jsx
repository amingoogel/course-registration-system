import { useEffect, useState } from "react";
import {
  fetchCourses,
  fetchPrerequisites,
  createPrerequisite,
  deletePrerequisite,
} from "../apiClient";

function PrerequisiteManager({ accessToken, accentColor = "#64748b" }) {
  const [courses, setCourses] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [courseCode, setCourseCode] = useState("");
  const [prereqCode, setPrereqCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const courseData = await fetchCourses(accessToken);
        const prereqData = await fetchPrerequisites(accessToken);
        setCourses(Array.isArray(courseData) ? courseData : []);
        setPrerequisites(Array.isArray(prereqData) ? prereqData : []);
      } catch (err) {
        setMessageType("error");
        setMessage("خطا در دریافت اطلاعات.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accessToken]);

  const findCourseByCode = (code) => courses.find((c) => c.code === code);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const course = findCourseByCode(courseCode);
    const prereq = findCourseByCode(prereqCode);

    if (!course || !prereq) {
      setMessageType("error");
      setMessage("کد درس یا پیش‌نیاز نامعتبر است.");
      return;
    }

    try {
      const created = await createPrerequisite(accessToken, {
        course: course.id,
        prerequisite: prereq.id,
      });

      setPrerequisites((prev) => [...prev, created]);
      setCourseCode("");
      setPrereqCode("");
      setMessageType("success");
      setMessage("پیش‌نیاز با موفقیت ثبت شد.");
    } catch (err) {
      setMessageType("error");
      setMessage("ثبت پیش‌نیاز با خطا مواجه شد.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("حذف این پیش‌نیاز؟")) return;

    try {
      await deletePrerequisite(accessToken, id);
      setPrerequisites((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("حذف انجام نشد");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ✅ فرم افزودن */}
      <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        {/* ✅ نوار رنگی بالا */}
        <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

        {/* ✅ محتوای کادر */}
        <div className="p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            تعریف پیش‌نیاز جدید
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="کد درس"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />

            <input
              type="text"
              placeholder="کد پیش‌نیاز"
              value={prereqCode}
              onChange={(e) => setPrereqCode(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />

            <button
              type="submit"
              className="md:col-span-2 rounded-xl bg-indigo-600 text-white py-2 text-sm hover:bg-indigo-700 transition"
            >
              ثبت پیش‌نیاز
            </button>
          </form>

          {message && (
            <div
              className={[
                "mt-3 text-xs rounded-xl px-3 py-2 border",
                messageType === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200",
              ].join(" ")}
            >
              {message}
            </div>
          )}
        </div>
      </section>

      {/* ✅ لیست پیش‌نیازها */}
      <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        {/* ✅ نوار رنگی بالا */}
        <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

        {/* ✅ محتوای کادر */}
        <div className="p-4 md:p-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">
            لیست پیش‌نیازها
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm border-separate border-spacing-0">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200">
                    درس
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200">
                    پیش‌نیاز
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {prerequisites.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-2 text-center border-b border-slate-100">
                      {p.course_code}
                    </td>
                    <td className="px-3 py-2 text-center border-b border-slate-100">
                      {p.prerequisite_code}
                    </td>
                    <td className="px-3 py-2 text-center border-b border-slate-100">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 text-xs hover:underline"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && prerequisites.length === 0 && (
            <div className="text-xs text-slate-500 text-center py-4">
              پیش‌نیازی ثبت نشده است.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PrerequisiteManager;
