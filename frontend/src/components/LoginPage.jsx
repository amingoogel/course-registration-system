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
}