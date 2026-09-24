import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import backgroundImage from "../assets/13108079_5140011.jpg";
import botImage from "../assets/AI_bot.png";
import logoImage from "../assets/Logo.jpg";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <div
      className="login-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bot-section">
        < img
          src={botImage}
          alt="AI ChatBot"
          className="bot-image"
        />
      </div>
      <div className="login-card">

        <div className="login-header">
          <div className="login-icon">
            <img src={logoImage} alt = "AI chatbot logo" />
          </div>

          <h1>AI ChatBot</h1>

          <p>Sign in to continue to your AI assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
              required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (<div className="login-error"> {error} </div>)}

          <button
            type="submit"
            className="login-button"
            disabled={loading} >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>

      </div>

    </div>
  );


}

export default Login;