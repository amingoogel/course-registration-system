import { useEffect, useState } from "react";
import {
  fetchUnitLimit,
  createUnitLimit,
  updateUnitLimit,
} from "./apiClient";

function UnitLimitManager({ accessToken }) {
  const [minUnits, setMinUnits] = useState("");
  const [maxUnits, setMaxUnits] = useState("");
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const loadUnitLimit = async () => {
      setLoading(true);
      setMessage("");
      try {
        const data = await fetchUnitLimit(accessToken);
        if (data) {
          setMinUnits(data.min_units);
          setMaxUnits(data.max_units);
          setExists(true);
        }
      } catch (err) {
        setMessageType("error");
        setMessage("خطا در دریافت حد واحدها.");
      } finally {
        setLoading(false);
      }
    };

    loadUnitLimit();
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (minUnits === "" || maxUnits === "") {
      setMessageType("error");
      setMessage("هر دو فیلد الزامی هستند.");
      return;
    }

    if (Number(minUnits) > Number(maxUnits)) {
      setMessageType("error");
      setMessage("حداقل واحد نمی‌تواند بیشتر از حداکثر باشد.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        min_units: Number(minUnits),
        max_units: Number(maxUnits),
      };

      if (exists) {
        await updateUnitLimit(accessToken, payload);
        setMessage("حد واحدها با موفقیت ویرایش شد.");
      } else {
        await createUnitLimit(accessToken, payload);
        setExists(true);
        setMessage("حد واحدها با موفقیت ثبت شد.");
      }

      setMessageType("success");
    } catch (err) {
      setMessageType("error");
      setMessage("ذخیره حد واحدها با مشکل مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 max-w-xl">
      <h2 className="text-sm md:text-base font-semibold mb-3">
        {exists ? "ویرایش حد واحدها" : "تعریف حد واحدها"}
      </h2>

      {loading ? (
        <div className="text-xs text-slate-500">در حال بارگذاری...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                حداقل واحد
              </label>
              <input
                type="number"
                value={minUnits}
                onChange={(e) => setMinUnits(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                حداکثر واحد
              </label>
              <input
                type="number"
                value={maxUnits}
                onChange={(e) => setMaxUnits(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {message && (
            <div
              className={`rounded-xl px-3 py-2 text-xs ${
                messageType === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700 disabled:opacity-70"
          >
            {saving
              ? "در حال ذخیره..."
              : exists
              ? "ثبت تغییرات"
              : "ثبت حد واحد"}
          </button>
        </form>
      )}
    </section>
  );
}

export default UnitLimitManager;
