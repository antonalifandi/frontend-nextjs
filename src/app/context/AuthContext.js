import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      document.cookie = "access_token=; Max-Age=0; path=/";
      setLoading(false);
      router.push("/auth/login");
    }, 1500);
  };

  return (
    <AuthContext.Provider value={{ loading, setLoading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
