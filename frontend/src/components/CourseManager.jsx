import { useEffect, useState } from "react";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "./apiClient";

const emptyCourse = {
  id: null,
  code: "",
  name: "",
  capacity: "",
  units: "",
  day: "",
  start_time: "",
  end_time: "",
  location: "",
  professor: "",
};

function CourseManager({ accessToken }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(emptyCourse);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!accessToken) return;

    const loadCourses = async () => {
      setLoading(true);
      setMessage("");
      try {
        const data = await fetchCourses(accessToken);
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setMessageType("error");
        setMessage(err.message || "خطا در دریافت لیست دروس.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [accessToken]);

  const handleInputChange = (field, value) => {
    setSelectedCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditClick = (course) => {
    setSelectedCourse({
      id: course.id,
      code: course.code ?? "",
      name: course.name ?? "",
      capacity:
        course.capacity === null || course.capacity === undefined
          ? ""
          : String(course.capacity),
      units:
        course.units === null || course.units === undefined
          ? ""
          : String(course.units),
      day: course.day ?? "",
      start_time: course.start_time ?? "",
      end_time: course.end_time ?? "",
      location: course.location ?? "",
      professor: course.professor ?? "",
    });
    setMessage("");
    setMessageType("");
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm("آیا از حذف این درس اطمینان دارید؟");
    if (!confirmDelete) return;

    try {
      await deleteCourse(accessToken, courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      setMessageType("success");
      setMessage("درس با موفقیت حذف شد.");
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "حذف درس با مشکل مواجه شد.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!selectedCourse.code || !selectedCourse.name) {
      setMessageType("error");
      setMessage("فیلدهای کد درس و نام درس اجباری هستند.");
      return;
    }

      // کد درس
    if (!/^\d{7}$/.test(selectedCourse.code)) {
      setErrors({ code: true });
      setMessageType("error");
      setMessage("کد درس باید دقیقاً ۷ رقم و فقط عدد باشد.");
      return;
    }

    // ظرفیت
    if (selectedCourse.capacity !== "") {
      const cap = Number(selectedCourse.capacity);
      if (cap < 20 || cap > 60) {
        setErrors({ capacity: true });
        setMessageType("error");
        setMessage("ظرفیت باید عددی بین ۲۰ تا ۶۰ باشد.");
        return;
      }
    }

    // واحد
    if (selectedCourse.units !== "") {
      const u = Number(selectedCourse.units);
      if (u < 1 || u > 4) {
        setErrors({ units: true });
        setMessageType("error");
        setMessage("تعداد واحد باید عددی بین ۱ تا ۴ باشد.");
        return;
      }
    }



    setSaving(true);
    try {
      const payload = {
        code: selectedCourse.code.trim(),
        name: selectedCourse.name.trim(),
      };

      if (selectedCourse.capacity !== "") {
        payload.capacity = Number(selectedCourse.capacity);
      }
      if (selectedCourse.units !== "") {
        payload.units = Number(selectedCourse.units);
      }
      if (selectedCourse.day && selectedCourse.day.trim() !== "") {
        payload.day = selectedCourse.day.trim();
      }
      if (
        selectedCourse.start_time &&
        selectedCourse.start_time.trim() !== ""
      ) {
        payload.start_time = selectedCourse.start_time.trim();
      }
      if (selectedCourse.end_time && selectedCourse.end_time.trim() !== "") {
        payload.end_time = selectedCourse.end_time.trim();
      }
      if (selectedCourse.location && selectedCourse.location.trim() !== "") {
        payload.location = selectedCourse.location.trim();
      }
      if (selectedCourse.professor && selectedCourse.professor.trim() !== "") {
        payload.professor = selectedCourse.professor.trim();
      }

      if (selectedCourse.id) {
        const updated = await updateCourse(accessToken, selectedCourse.id, payload);
        setCourses((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
        setMessageType("success");
        setMessage("ویرایش درس با موفقیت انجام شد.");
      } else {
        const created = await createCourse(accessToken, payload);
        setCourses((prev) => [...prev, created]);
        setMessageType("success");
        setMessage("درس جدید با موفقیت اضافه شد.");
      }

      setSelectedCourse(emptyCourse);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "ذخیره درس با مشکل مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedCourse(emptyCourse);
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* فرم افزودن/ویرایش درس */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
        <h2 className="text-sm md:text-base font-semibold text-slate-800 mb-3">
          {selectedCourse.id ? "ویرایش درس" : "افزودن درس جدید"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                کد درس *
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{7}"
                maxLength={7}
                className={`w-full rounded-lg bg-white px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2
                  ${errors.code
                    ? "border border-red-500 focus:ring-red-500"
                    : "border border-slate-300 focus:ring-indigo-500"}
                `}

                value={selectedCourse.code}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 7);
                  handleInputChange("code", digitsOnly);
                }}
              />

            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                نام درس *
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCourse.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                ظرفیت
              </label>
              <input
                type="number"
                min={20}
                max={60}
                className={`w-full rounded-lg bg-white px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2
                  ${errors.capacity
                    ? "border border-red-500 focus:ring-red-500"
                    : "border border-slate-300 focus:ring-indigo-500"}
                `}

                value={selectedCourse.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
              />

            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                تعداد واحد
              </label>
              <input
                type="number"
                min={1}
                max={4}
                className={`w-full rounded-lg bg-white px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2
                  ${errors.units
                    ? "border border-red-500 focus:ring-red-500"
                    : "border border-slate-300 focus:ring-indigo-500"}
                `}

                value={selectedCourse.units}
                onChange={(e) => handleInputChange("units", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                روز
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCourse.day}
                onChange={(e) => handleInputChange("day", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                ساعت شروع (مثلاً 08:00)
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCourse.start_time}
                onChange={(e) =>
                  handleInputChange("start_time", e.target.value)
                }
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                ساعت پایان (مثلاً 09:30)
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCourse.end_time}
                onChange={(e) =>
                  handleInputChange("end_time", e.target.value)
                }
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                محل برگزاری
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCourse.location}
                onChange={(e) =>
                  handleInputChange("location", e.target.value)
                }
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                استاد
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCourse.professor}
                onChange={(e) =>
                  handleInputChange("professor", e.target.value)
                }
              />
            </div>
          </div>

          {message && (
            <div
              className={[
                "rounded-xl px-3 py-2 text-xs leading-relaxed",
                messageType === "error"
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : messageType === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-slate-50 border border-slate-200 text-slate-700",
              ].join(" ")}
            >
              {message}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white text-xs md:text-sm px-4 py-2 shadow-sm hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving
                ? "در حال ذخیره..."
                : selectedCourse.id
                ? "ثبت ویرایش"
                : "افزودن درس"}
            </button>

            {selectedCourse.id && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white text-xs md:text-sm px-3 py-2 text-slate-700 hover:bg-slate-50"
              >
                انصراف
              </button>
            )}
          </div>
        </form>
      </section>

      {/* جدول لیست دروس (مدیریت) */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-800">
            لیست دروس (مدیریت)
          </h2>
          {loading && (
            <span className="text-xs text-slate-500">در حال بارگذاری...</span>
          )}
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
                  "عملیات",
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
                    colSpan={10}
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
                    <td className="px-3 py-2 text-center border-b border-slate-100">
                      <div className="flex flex-wrap justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditClick(course)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs hover:bg-indigo-100"
                        >
                          ویرایش
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs hover:bg-red-100"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CourseManager;
