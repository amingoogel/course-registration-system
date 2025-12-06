import { useState } from "react";
import LoginPage from "./components/LoginPage.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

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

  return (
    <AdminDashboard
      auth={authState}
      onLogout={handleLogout}
    />
  );
}

export default App;
