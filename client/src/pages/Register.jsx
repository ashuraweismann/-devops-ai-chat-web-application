import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import backgroundImage from "../assets/13108079_5140011.jpg";
import botImage from "../assets/AI_bot.png";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
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
      {" "}
      {/* Bot Image */}{" "}
      <div className="bot-section">
        {" "}
        <img src={botImage} alt="AI ChatBot" className="bot-image" />{" "}
      </div>{" "}
      {/* Register Card */}{" "}
      <div className="login-card">
        {" "}
        <div className="login-header">
          {" "}
          <div className="login-icon">⚡</div> <h1>AI ChatBot</h1>{" "}
          <p>Create your account to get started</p>{" "}
        </div>{" "}
        <form onSubmit={handleSubmit} className="login-form">
          {" "}
          <div className="form-group">
            {" "}
            <label htmlFor="name">Name</label>{" "}
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />{" "}
          </div>{" "}
          <div className="form-group">
            {" "}
            <label htmlFor="email">Email</label>{" "}
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />{" "}
          </div>{" "}
          <div className="form-group">
            {" "}
            <label htmlFor="password">Password</label>{" "}
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />{" "}
          </div>{" "}

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          
          {error && <div className="login-error"> {error} </div>}{" "}
          <button type="submit" className="login-button" disabled={loading}>
            {" "}
            {loading ? "Creating account..." : "Register"}{" "}
          </button>{" "}
        </form>{" "}
        <div className="login-footer">
          {" "}
          <p>
            {" "}
            Already have an account? <Link to="/login">Login</Link>{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default Register;
