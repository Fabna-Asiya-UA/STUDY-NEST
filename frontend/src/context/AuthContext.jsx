import {
  createContext,
  useContext,
  useState
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [loading, setLoading] = useState(false);


  // LOGIN
  const login = async (email, password) => {

    setLoading(true);

    try {

      const response = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      const { user, accessToken } = response.data;

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setUser(user);

      return {
        success: true,
        user
      };

    } catch (error) {

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed"
      };

    } finally {

      setLoading(false);

    }
  };


  // REGISTER
  const register = async (
    name,
    email,
    password,
    role
  ) => {

    setLoading(true);

    try {

      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed"
      };

    } finally {

      setLoading(false);

    }
  };


  // LOGOUT
  const logout = () => {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};