import { useState } from "react";
import { loginRequest, fetchMe } from "./apiClient";

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { accessToken } = await loginRequest(username, password);

      // ✅ نقش و اطلاعات کاربر از /api/users/me/ گرفته می‌شود
      const me = await fetchMe(accessToken);
      const realRole = me?.role;
      const realUsername = me?.username || username;

      if (!realRole) {
        setError("نقش کاربر از سرور دریافت نشد.");
        return;
      }

      onLoginSuccess({
        accessToken,
        role: realRole,
        username: realUsername,
      });
    } catch (err) {
      setError(err?.message || "نام کاربری یا رمز عبور اشتباه است.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">ورود به سامانه</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              نام کاربری
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              رمز عبور
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 text-white py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
