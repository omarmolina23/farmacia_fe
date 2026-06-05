import { createContext, useContext, useEffect, useState } from "react";
import { getMe, signOut as signOutService } from "../services/UserService";
import { toast } from "@/lib/toast";
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

  /*useEffect(() => {
    const savedUser = localStorage.getItem("user");

    
    if (savedUser) {
      const token = localStorage.getItem("token");
      setUser(JSON.parse(savedUser));
    }
  }, []);*/

  useEffect(() => {
    const fetchUser = async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser && token) {
        try {
          const response = await getMe(token);
          const updatedUser = {
            name: response.name,
            isAdmin: response.isAdmin,
            status: response.status,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
          signOut();
          await signOutService();
          toast.error(
            "Error al obtener el usuario. Por favor, inicia sesión nuevamente."
          );
        }
      } else if (savedUser && !token) {
        signOut();
      }
    };

    fetchUser();
  }, []);

  const login = async (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const signOut = () => {
    localStorage.removeItem("user");
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
