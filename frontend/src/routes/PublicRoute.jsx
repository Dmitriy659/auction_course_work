import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  console.log("PublicRoute, isLoggedIn =", isLoggedIn);
  if (isLoggedIn) {
    console.trace("Редирект в '/' из PublicRoute");
    return <Navigate to="/" />;
  }

  return children;
}
