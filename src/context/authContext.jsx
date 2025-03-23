import { createContext, useContext, useEffect, useState } from "react";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);

  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <authContext.Provider
      value={{
        user,
        login,
        signOut,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
