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
      { key: "student_number", label: "شماره دانشجویی" },
      { key: "national_code", label: "کد ملی" },
      { key: "first_name", label: "نام" },
      { key: "last_name", label: "نام خانوادگی" },
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
      { key: "personnel_number", label: "شماره پرسنلی" },
      { key: "national_code", label: "کد ملی" },
      { key: "first_name", label: "نام" },
      { key: "last_name", label: "نام خانوادگی" },
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

  const cfg = CONFIG[mode];

  const loadList = async () => {
    const data = await cfg.fetchList(accessToken);
    setList(data || []);
  };

  useEffect(() => {
    if (!accessToken) return;
    setForm({});
    loadList();
  }, [mode, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await cfg.submit(accessToken, form);
    setForm({});
    loadList();
  };

  const handleDelete = async (id) => {
    await cfg.remove(accessToken, id);
    loadList();
  };

  return (
    <section className="space-y-5">

      {/* SWITCH */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("student")}
          className={`px-4 py-2 rounded-xl text-sm ${
            mode === "student"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100"
          }`}
        >
          دانشجو
        </button>

        <button
          onClick={() => setMode("professor")}
          className={`px-4 py-2 rounded-xl text-sm ${
            mode === "professor"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100"
          }`}
        >
          استاد
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <h2 className="font-semibold mb-3">{cfg.title}</h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-3 md:grid-cols-2"
        >
          {cfg.fields.map((f) => (
            <input
              key={f.key}
              placeholder={f.label}
              value={form[f.key] || ""}
              onChange={(e) =>
                setForm({ ...form, [f.key]: e.target.value })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />
          ))}

          <button className="md:col-span-2 bg-indigo-600 text-white rounded-xl py-2">
            {cfg.submitText}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <h3 className="font-medium mb-3">{cfg.listTitle}</h3>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500">
              <th>شناسه</th>
              <th>نام</th>
              <th>کد ملی</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={cfg.getRowId(u)} className="border-t">
                <td>{cfg.getMainId(u)}</td>
                <td>
                  {u.first_name} {u.last_name}
                </td>
                <td>{u.national_code}</td>
                <td>
                  <button
                    onClick={() => handleDelete(cfg.getRowId(u))}
                    className="text-red-600"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
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
