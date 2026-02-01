import { useState } from "react";
import LoginPage from "./components/LoginPage.jsx";
import AdminDashboard from "./components/Dashboards/AdminDashboard.jsx";
import StudentDashboard from "./components/Dashboards/StudentDashboard.jsx";
import ProfessorDashboard from "./components/Dashboards/ProfessorDashboard.jsx";

function App() {
  const [authState, setAuthState] = useState({
    accessToken: null,
    role: null,
    username: null,
  });

  const handleLoginSuccess = ({ accessToken, role, username }) => {
    setAuthState({ accessToken, role, username });
  };

  const handleLogout = () => {
    setAuthState({ accessToken: null, role: null, username: null });
  };

  if (!authState.accessToken) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  switch (authState.role) {
    case "admin":
      return <AdminDashboard auth={authState} onLogout={handleLogout} />;

    case "student":
      return <StudentDashboard auth={authState} onLogout={handleLogout} />;

    case "professor":
      return <ProfessorDashboard auth={authState} onLogout={handleLogout} />;

    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <div className="bg-white p-6 rounded-xl shadow text-sm text-slate-700">
            نقش کاربر نامعتبر است.
            <button
              onClick={handleLogout}
              className="block mt-4 text-indigo-600 underline"
            >
              بازگشت به ورود
            </button>
          </div>
        </div>
      );
  }
}

export default App;
