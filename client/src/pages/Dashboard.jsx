import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <h1>DevOps AI Chat</h1>

      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>

      <p>Your AI chat dashboard will be built in the next phase.</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;