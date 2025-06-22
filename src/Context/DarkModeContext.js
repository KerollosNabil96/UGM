import React, { createContext, useState } from "react";

export const darkModeContext = createContext();

export default function DarkModeProvider(props) {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <darkModeContext.Provider value={{ darkMode, toggleDarkMode, token, login, logout }}>
      {props.children}
    </darkModeContext.Provider>
  );
}
