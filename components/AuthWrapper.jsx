"use client";

import { AuthProvider } from "@/context/AuthContext";

const AuthWrapper = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthWrapper;
