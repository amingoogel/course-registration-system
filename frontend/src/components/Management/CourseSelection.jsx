import { useEffect, useMemo, useState } from "react";
import {
  fetchCoursesWithPrerequisites,
  fetchDraftSelections,
  fetchFinalSelections,
  fetchUnitLimit,
  selectCourse,
  removeCourseFromDraft,
  finalizeSelection,
} from "../apiClient";

function sumUnits(list) {
  if (!Array.isArray(list)) return 0;
  return list.reduce(
    (acc, item) => acc + Number(item?.units ?? item?.course_units ?? 0),
    0
  );
}

function CourseSelection({ accessToken, accentColor = "#64748b" }) {
  const [courses, setCourses] = useState([]);
  const [draft, setDraft] = useState([]);
  const [finalList, setFinalList] = useState([]);
  const [unitLimit, setUnitLimit] = useState(null);

  const [selectedCode, setSelectedCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const minUnits = Number(unitLimit?.min_units ?? 0);
  const maxUnits = Number(unitLimit?.max_units ?? 0);

  const totalDraftUnits = useMemo(() => sumUnits(draft), [draft]);
  const withinRange =
    (minUnits ? totalDraftUnits >= minUnits : true) &&
    (maxUnits ? totalDraftUnits <= maxUnits : true);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [courseData, draftData, finalData, unitData] = await Promise.all([
        fetchCoursesWithPrerequisites(accessToken),
        fetchDraftSelections(accessToken),
        fetchFinalSelections(accessToken),
        fetchUnitLimit(accessToken),
      ]);

      setCourses(Array.isArray(courseData) ? courseData : []);
      setDraft(Array.isArray(draftData) ? draftData : []);
      setFinalList(Array.isArray(finalData) ? finalData : []);
      setUnitLimit(unitData || null);
    } catch (e) {
      setError(e?.message || "خطا در دریافت اطلاعات انتخاب واحد.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleAdd = async () => {
    const code = String(selectedCode || "").trim();
    if (!code) return;
    setSaving(true);
    setError("");
    setMsg("");
    try {
      await selectCourse(accessToken, code);
      setMsg("درس به لیست موقت اضافه شد.");
      setSelectedCode("");
      const draftData = await fetchDraftSelections(accessToken);
      setDraft(Array.isArray(draftData) ? draftData : []);
    } catch (e) {
      setError(e?.message || "افزودن درس با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (courseCode) => {
    if (!courseCode) return;
    setSaving(true);
    setError("");
    setMsg("");
    try {
      await removeCourseFromDraft(accessToken, courseCode);
      setMsg("درس از لیست موقت حذف شد.");
      const draftData = await fetchDraftSelections(accessToken);
      setDraft(Array.isArray(draftData) ? draftData : []);
    } catch (e) {
      setError(e?.message || "حذف درس با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async () => {
    setSaving(true);
    setError("");
    setMsg("");
    try {
      await finalizeSelection(accessToken);
      setMsg("انتخاب واحد با موفقیت نهایی شد.");
      const [draftData, finalData] = await Promise.all([
        fetchDraftSelections(accessToken),
        fetchFinalSelections(accessToken),
      ]);
      setDraft(Array.isArray(draftData) ? draftData : []);
      setFinalList(Array.isArray(finalData) ? finalData : []);
    } catch (e) {
      setError(e?.message || "نهایی کردن با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold text-slate-800">انتخاب واحد</h2>
            {loading && <span className="text-xs text-slate-500">در حال بارگذاری...</span>}
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 mb-3">
              {error}
            </div>
          )}

          {msg && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700 mb-3">
              {msg}
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-3 items-end">
            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-slate-700">انتخاب درس</label>
              <input
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                placeholder="مثلاً 7777101"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <div className="text-[11px] text-slate-500">
                فقط کد درس را وارد کن (بدون فاصله).
                {courses?.length > 0 && (
                  <span className="block mt-1">نمونه کدها: {courses.slice(0, 6).map((c) => c.code).join("، ")}{courses.length > 6 ? "…" : ""}</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={saving || loading || !selectedCode}
              className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700 disabled:opacity-70"
            >
              افزودن
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* لیست موقت */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">لیست موقت</h3>
                <button
                  type="button"
                  onClick={loadAll}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
                >
                  بروزرسانی
                </button>
              </div>

              <div className="text-xs text-slate-600 mb-2">
                مجموع واحدها: <span className="font-semibold">{totalDraftUnits}</span>
                {unitLimit && (
                  <span className="text-slate-500">
                    {" "}(حداقل: {minUnits} / حداکثر: {maxUnits})
                  </span>
                )}
              </div>

              {!withinRange && unitLimit && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 mb-2">
                  مجموع واحدها باید بین {minUnits} تا {maxUnits} باشد.
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border-separate border-spacing-0">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-2 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                        کد
                      </th>
                      <th className="px-2 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                        نام
                      </th>
                      <th className="px-2 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                        واحد
                      </th>
                      <th className="px-2 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!draft || draft.length === 0) && !loading ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                          موردی در لیست موقت نیست.
                        </td>
                      </tr>
                    ) : (
                      (draft || []).map((c) => {
                        const code = c?.code || c?.course_code;
                        const name = c?.name || c?.course_name;
                        const units = c?.units ?? c?.course_units;
                        return (
                          <tr key={c?.id ?? code} className="hover:bg-white/70 transition">
                            <td className="px-2 py-2 text-center border-b border-slate-100 whitespace-nowrap">
                              {code}
                            </td>
                            <td className="px-2 py-2 text-center border-b border-slate-100">{name}</td>
                            <td className="px-2 py-2 text-center border-b border-slate-100 whitespace-nowrap">
                              {units ?? "-"}
                            </td>
                            <td className="px-2 py-2 text-center border-b border-slate-100">
                              <button
                                type="button"
                                onClick={() => handleRemove(code)}
                                disabled={saving}
                                className="text-red-600 text-xs hover:underline disabled:opacity-70"
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

              <button
                type="button"
                onClick={handleFinalize}
                disabled={saving || loading || !draft?.length || !withinRange}
                className="w-full mt-3 rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm hover:bg-emerald-700 disabled:opacity-70"
              >
                ثبت نهایی
              </button>
            </div>

            {/* لیست نهایی */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">لیست نهایی</h3>
                <div className="text-xs text-slate-500">{finalList?.length || 0} درس</div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border-separate border-spacing-0">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-2 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                        کد
                      </th>
                      <th className="px-2 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                        نام
                      </th>
                      <th className="px-2 py-2 text-center font-medium text-slate-600 border-b border-slate-200 whitespace-nowrap">
                        واحد
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!finalList || finalList.length === 0) && !loading ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-center text-slate-500">
                          هنوز انتخاب واحد نهایی ثبت نشده است.
                        </td>
                      </tr>
                    ) : (
                      (finalList || []).map((c) => {
                        const code = c?.code || c?.course_code;
                        const name = c?.name || c?.course_name;
                        const units = c?.units ?? c?.course_units;
                        return (
                          <tr key={c?.id ?? code} className="hover:bg-white/70 transition">
                            <td className="px-2 py-2 text-center border-b border-slate-100 whitespace-nowrap">
                              {code}
                            </td>
                            <td className="px-2 py-2 text-center border-b border-slate-100">{name}</td>
                            <td className="px-2 py-2 text-center border-b border-slate-100 whitespace-nowrap">
                              {units ?? "-"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section> 
    </div>
  );
}

export default CourseSelection;
