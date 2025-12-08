import { useState } from "react";
import { loginRequest } from "./apiClient";

const colors = {
  background: "#F9F8F6",
  card: "#EFE9E3",
  border: "#D9CFC7",
};

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { accessToken } = await loginRequest(username, password);

      onLoginSuccess({
        accessToken,
        role: "admin",
        username,
      });
    } catch (err) {
      setError("نام کاربری یا رمز عبور اشتباه است.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        direction: "rtl",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: colors.card,
          borderRadius: "18px",
          padding: "32px 28px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
          border: `1px solid ${colors.border}`,
        }}
      >
        <h1
          style={{
            fontSize: "20px",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          ورود به سامانه
        </h1>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            {/* نام کاربری */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                نام کاربری:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${colors.border}`,
                  fontSize: "13px",
                  backgroundColor: "#fff",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* رمز عبور */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                رمز عبور:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${colors.border}`,
                  fontSize: "13px",
                  backgroundColor: "#fff",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#ffe5e5",
                color: "#a30000",
                borderRadius: "10px",
                padding: "8px 10px",
                fontSize: "12px",
                marginBottom: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 12px",
              borderRadius: "12px",
              border: "none",
              background:
                "linear-gradient(135deg, #D9CFC7 0%, #B6A896 100%)",
              color: "#222",
              fontWeight: 600,
              fontSize: "14px",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.75 : 1,
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              marginTop: "8px", // فاصله از فیلد رمز
            }}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
