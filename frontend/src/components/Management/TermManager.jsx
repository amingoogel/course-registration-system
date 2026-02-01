import { useEffect, useMemo, useState } from "react";
import {
  fetchTerms,
  createTerm,
  updateTerm,
  toggleTermActive,
} from "../apiClient";

function isoToLocalInput(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  } catch {
    return "";
  }
}

function localInputToIso(value) {
  if (!value) return null;
  try {
    const d = new Date(value);
    return d.toISOString();
  } catch {
    return null;
  }
}

function TermManager({ accessToken, accentColor = "#64748b" }) {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    start_selection: "",
    end_selection: "",
    is_active: false,
  });

  const load = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchTerms(accessToken);
      setTerms(Array.isArray(data) ? data : []);
    } catch (e) {
      setTerms([]);
      setError(e?.message || "خطا در دریافت لیست نیم‌سال‌ها.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", start_selection: "", end_selection: "", is_active: false });
    setMsg("");
    setMsgType("");
  };

  const onEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name || "",
      start_selection: isoToLocalInput(t.start_selection),
      end_selection: isoToLocalInput(t.end_selection),
      is_active: Boolean(t.is_active),
    });
    setMsg("");
    setMsgType("");
  };

  const sortedTerms = useMemo(() => {
    return [...terms].sort((a, b) => {
      const aa = new Date(a?.start_selection || 0).getTime();
      const bb = new Date(b?.start_selection || 0).getTime();
      return bb - aa;
    });
  }, [terms]);

  const handleToggle = async (termId) => {
    try {
      await toggleTermActive(accessToken, termId);
      await load();
    } catch (e) {
      setMsgType("error");
      setMsg(e?.message || "تغییر وضعیت با خطا مواجه شد.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");

    const payload = {
      name: (form.name || "").trim(),
      start_selection: localInputToIso(form.start_selection),
      end_selection: localInputToIso(form.end_selection),
      is_active: Boolean(form.is_active),
    };

    if (!payload.name || !payload.start_selection || !payload.end_selection) {
      setMsgType("error");
      setMsg("نام و بازه انتخاب واحد الزامی است.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateTerm(accessToken, editingId, payload);
        setMsgType("success");
        setMsg("نیم‌سال با موفقیت ویرایش شد.");
      } else {
        await createTerm(accessToken, payload);
        setMsgType("success");
        setMsg("نیم‌سال با موفقیت ساخته شد.");
      }

      await load();
      // اگر کاربر خواسته فعال شود ولی بک‌اند با فیلد فعال نکرده، از toggle هم استفاده کنیم
      // (به‌خصوص وقتی قواعد فعال‌بودن/تک‌فعال در بک‌اند enforce شده باشد)
      const latest = await fetchTerms(accessToken);
      const updated = Array.isArray(latest) ? latest : [];
      setTerms(updated);

      // برگردیم حالت ساخت
      setEditingId(null);
      setForm({ name: "", start_selection: "", end_selection: "", is_active: false });
    } catch (e2) {
      setMsgType("error");
      setMsg(e2?.message || "ذخیره نیم‌سال با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* فرم */}
      <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-sm md:text-base font-semibold">
              {editingId ? "ویرایش نیم‌سال" : "ساخت نیم‌سال جدید"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
              >
                انصراف
              </button>
            )}
          </div>

          {msg && (
            <div
              className={[
                "rounded-xl px-3 py-2 text-xs mb-3 border",
                msgType === "error"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700",
              ].join(" ")}
            >
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-700">نام نیم‌سال</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="مثلاً: نیم‌سال دوم ۱۴۰۴-۱۴۰۵"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">شروع انتخاب واحد</label>
              <input
                type="datetime-local"
                value={form.start_selection}
                onChange={(e) => setForm((p) => ({ ...p, start_selection: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">پایان انتخاب واحد</label>
              <input
                type="datetime-local"
                value={form.end_selection}
                onChange={(e) => setForm((p) => ({ ...p, end_selection: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                />
                فعال باشد
              </label>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700 disabled:opacity-70"
              >
                {saving ? "در حال ذخیره..." : editingId ? "ثبت تغییرات" : "ساخت نیم‌سال"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* لیست */}
      <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold">لیست نیم‌سال‌ها</h2>
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
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200">نام</th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                    بازه انتخاب واحد
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200">وضعیت</th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b border-slate-200">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {!loading && sortedTerms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-xs text-slate-500">
                      نیم‌سالی ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  sortedTerms.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition">
                      <td className="px-3 py-2 text-center border-b border-slate-100">{t.name}</td>
                      <td className="px-3 py-2 text-center border-b border-slate-100 whitespace-nowrap">
                        {isoToLocalInput(t.start_selection).replace("T", " ")} تا {isoToLocalInput(t.end_selection).replace("T", " ")}
                      </td>
                      <td className="px-3 py-2 text-center border-b border-slate-100">
                        <span
                          className={[
                            "inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] border",
                            t.is_active
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-slate-50 border-slate-200 text-slate-600",
                          ].join(" ")}
                        >
                          {t.is_active ? "فعال" : "غیرفعال"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center border-b border-slate-100">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(t)}
                            className="text-indigo-600 text-xs hover:underline"
                          >
                            ویرایش
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggle(t.id)}
                            className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
                          >
                            {t.is_active ? "غیرفعال" : "فعال"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermManager;
