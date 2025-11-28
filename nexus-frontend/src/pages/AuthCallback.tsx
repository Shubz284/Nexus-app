import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("token", token); // Store token
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      navigate("/signin"); // Redirect to signin if no token
    }
  }, [location, navigate]);

  return null; // No UI needed, just handling redirect
};

