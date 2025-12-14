import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import("./dashboard"), { ssr: false });
const Login = dynamic(() => import("./auth/login"), { ssr: false });

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      {isLoggedIn ? <Dashboard /> : <Login />}
    </div>
  );
};

export default App;
