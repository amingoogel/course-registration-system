import { useEffect, useState } from "react";
import {
  fetchCourses,
  fetchPrerequisites,
  createPrerequisite,
  deletePrerequisite,
} from "./apiClient";

function PrerequisiteManager({ accessToken }) {
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
        setCourses(courseData);
        setPrerequisites(prereqData);
      } catch (err) {
        setMessageType("error");
        setMessage("خطا در دریافت اطلاعات.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accessToken]);

  const findCourseByCode = (code) =>
    courses.find((c) => c.code === code);

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

      {/* فرم افزودن */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
        <h2 className="text-sm md:text-base font-semibold mb-3">
          تعریف پیش‌نیاز جدید
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="کد درس"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="کد پیش‌نیاز"
            value={prereqCode}
            onChange={(e) => setPrereqCode(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="md:col-span-2 rounded-xl bg-indigo-600 text-white py-2 text-sm hover:bg-indigo-700"
          >
            ثبت پیش‌نیاز
          </button>
        </form>

        {message && (
          <div
            className={`mt-3 text-xs rounded-xl px-3 py-2 ${
              messageType === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {message}
          </div>
        )}
      </section>

      {/* لیست پیش‌نیازها */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
        <h2 className="text-sm md:text-base font-semibold mb-3">
          لیست پیش‌نیازها
        </h2>

        <table className="min-w-full text-xs md:text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2">درس</th>
              <th className="px-3 py-2">پیش‌نیاز</th>
              <th className="px-3 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {prerequisites.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2 text-center">
                  {p.course_code}
                </td>
                <td className="px-3 py-2 text-center">
                  {p.prerequisite_code}
                </td>
                <td className="px-3 py-2 text-center">
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

        {!loading && prerequisites.length === 0 && (
          <div className="text-xs text-slate-500 text-center py-4">
            پیش‌نیازی ثبت نشده است.
          </div>
        )}
      </section>
    </div>
  );
}

export default PrerequisiteManager;
