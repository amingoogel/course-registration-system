import { useEffect, useState } from "react";
import {
  registerStudent,
  registerProfessor,
  fetchStudents,
  fetchProfessors,
  deleteStudent,
  deleteProfessor,
} from "./apiClient";

const CONFIG = {
  student: {
    title: "ثبت دانشجو",
    submitText: "ثبت دانشجو",
    listTitle: "لیست دانشجویان",
    fields: [
      { key: "student_number", label: "شماره دانشجویی", numeric: true, maxLen: 8 },
      { key: "national_code", label: "کد ملی", numeric: true, maxLen: 10 },
      { key: "first_name", label: "نام", numeric: false },
      { key: "last_name", label: "نام خانوادگی", numeric: false },
    ],
    fetchList: fetchStudents,
    submit: registerStudent,
    remove: deleteStudent,
    getRowId: (u) => u.id,
    getMainId: (u) => u.student_number,
  },

  professor: {
    title: "ثبت استاد",
    submitText: "ثبت استاد",
    listTitle: "لیست اساتید",
    fields: [
      { key: "personnel_number", label: "شماره پرسنلی", numeric: true, maxLen: 8 },
      { key: "national_code", label: "کد ملی", numeric: true, maxLen: 10 },
      { key: "first_name", label: "نام", numeric: false },
      { key: "last_name", label: "نام خانوادگی", numeric: false },
    ],
    fetchList: fetchProfessors,
    submit: registerProfessor,
    remove: deleteProfessor,
    getRowId: (u) => u.id,
    getMainId: (u) => u.personnel_number,
  },
};

function UserRegisterManager({ accessToken }) {
  const [mode, setMode] = useState("student");
  const [list, setList] = useState([]);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({}); // { fieldKey: true }
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" | "success"
  const [listError, setListError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cfg = CONFIG[mode];

  const loadList = async () => {
    setLoading(true);
    setListError("");
    try {
      const data = await cfg.fetchList(accessToken);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
       setList([]);
      // چون endpoint لیست نداریم و 404 طبیعی است، پیام به کاربر نده
      setListError("")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    setForm({});
    setErrors({});
    setMessage("");
    setMessageType("");
    setListError("");
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, accessToken]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false })); // با تایپ، خطا رفع شود
  };

  const validate = () => {
    const nextErrors = {};

    // دانشجو: شماره دانشجویی دقیقاً ۸ رقم
    if (mode === "student") {
      const sn = (form.student_number || "").trim();
      if (!/^\d{8}$/.test(sn)) nextErrors.student_number = true;
    }

    // استاد: شماره پرسنلی دقیقاً ۸ رقم
    if (mode === "professor") {
      const pn = (form.personnel_number || "").trim();
      if (!/^\d{8}$/.test(pn)) nextErrors.personnel_number = true;
    }

    // کد ملی دقیقاً ۱۰ رقم
    const nc = (form.national_code || "").trim();
    if (!/^\d{10}$/.test(nc)) nextErrors.national_code = true;

    // نام و نام خانوادگی خالی نباشند
    const fn = (form.first_name || "").trim();
    const ln = (form.last_name || "").trim();
    if (!fn) nextErrors.first_name = true;
    if (!ln) nextErrors.last_name = true;

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessageType("error");

      if (nextErrors.student_number || nextErrors.personnel_number) {
        setMessage("شماره دانشجویی / پرسنلی باید دقیقاً ۸ رقم و فقط عدد باشد.");
      } else if (nextErrors.national_code) {
        setMessage("کد ملی باید دقیقاً ۱۰ رقم و فقط عدد باشد.");
      } else {
        setMessage("لطفاً همه فیلدها را به‌درستی پر کنید.");
      }

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setMessageType("");

    if (!validate()) return;

    setSaving(true);
    try {
      await cfg.submit(accessToken, {
        ...form,
        first_name: (form.first_name || "").trim(),
        last_name: (form.last_name || "").trim(),
        national_code: (form.national_code || "").trim(),
        ...(mode === "student"
          ? { student_number: (form.student_number || "").trim() }
          : { personnel_number: (form.personnel_number || "").trim() }),
      });

      setForm({});
      setMessageType("success");
      setMessage(mode === "student" ? "دانشجو با موفقیت ثبت شد." : "استاد با موفقیت ثبت شد.");

      // دریافت لیست را هم انجام می‌دهیم، ولی اگر خطا داشت پیام سبز را خراب نمی‌کند
      await loadList();
    } catch (e2) {
      setMessageType("error");
      setMessage(e2.message || "ثبت با مشکل مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("آیا از حذف این مورد اطمینان دارید؟");
    if (!ok) return;

    try {
      await cfg.remove(accessToken, id);
      setMessageType("success");
      setMessage("حذف با موفقیت انجام شد.");
      loadList();
    } catch (e) {
      setMessageType("error");
      setMessage(e.message || "حذف با مشکل مواجه شد.");
    }
  };

  const fieldInputClass = (fieldKey) =>
    `peer w-full rounded-lg bg-white px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 ${
      errors[fieldKey]
        ? "border border-red-500 focus:ring-red-500"
        : "border border-slate-300 focus:ring-indigo-500"
    }`;

  const labelClass =
    "absolute right-3 top-2.5 text-xs text-slate-500 transition-all bg-white px-1 " +
    "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 " +
    "peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600";

  return (
    <section className="space-y-5">
      {/* SWITCH */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("student")}
          className={`px-4 py-2 rounded-xl text-sm ${
            mode === "student" ? "bg-indigo-600 text-white" : "bg-slate-100"
          }`}
        >
          دانشجو
        </button>

        <button
          type="button"
          onClick={() => setMode("professor")}
          className={`px-4 py-2 rounded-xl text-sm ${
            mode === "professor" ? "bg-indigo-600 text-white" : "bg-slate-100"
          }`}
        >
          استاد
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <h2 className="font-semibold mb-3">{cfg.title}</h2>

        {message && (
          <div
            className={`rounded-xl px-3 py-2 text-xs mb-3 ${
              messageType === "error"
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-emerald-50 border border-emerald-200 text-emerald-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="grid gap-3 md:grid-cols-2">
          {cfg.fields.map((f) => (
            <div key={f.key} className="relative">
              <input
                type="text"
                inputMode={f.numeric ? "numeric" : undefined}
                maxLength={f.numeric ? f.maxLen : undefined}
                placeholder=" "
                value={form[f.key] || ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const cleaned = f.numeric ? raw.replace(/\D/g, "") : raw;
                  const limited =
                    f.numeric && f.maxLen ? cleaned.slice(0, f.maxLen) : cleaned;
                  setField(f.key, limited);
                }}
                className={fieldInputClass(f.key)}
              />

              <label className={labelClass}>{f.label}</label>
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 bg-indigo-600 text-white rounded-xl py-2 disabled:opacity-70"
          >
            {saving ? "در حال ثبت..." : cfg.submitText}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{cfg.listTitle}</h3>
          {loading && <span className="text-xs text-slate-500">در حال بارگذاری...</span>}
        </div>

        {listError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 mb-3">
            {listError}
          </div>
        )}

        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500">
              <th className="text-right py-2">شناسه</th>
              <th className="text-right py-2">نام</th>
              <th className="text-right py-2">کد ملی</th>
              <th className="text-right py-2"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={cfg.getRowId(u)} className="border-t">
                <td className="py-2">{cfg.getMainId(u)}</td>
                <td className="py-2">
                  {u.first_name} {u.last_name}
                </td>
                <td className="py-2">{u.national_code}</td>
                <td className="py-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(cfg.getRowId(u))}
                    className="text-red-600"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}

            {list.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-4">
                  موردی ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UserRegisterManager;
