import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  console.log(isLoggedIn);
  return isLoggedIn ? <Navigate to="/" /> : children;
}
