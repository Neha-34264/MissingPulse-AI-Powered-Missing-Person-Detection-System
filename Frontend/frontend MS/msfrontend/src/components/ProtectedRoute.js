import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const auth = localStorage.getItem("authToken");

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  if (auth) {
    return children;
  } else {
    return null;
  }
}

export default ProtectedRoute;
