/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState();


  const storeTokenInLs = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };
  const isLoggedin = !!token;

  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  //Authenticate current logged-in User
  const userverification = async () => {
    try {
      const response = await fetch(
        `${baseUrl}user/verifyUserToken`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const res = await response.json();
        // Map isprofessional to isProfessional for consistency
        if (res && typeof res === "object" && res.isprofessional !== undefined) {
          res.isProfessional = res.isprofessional;
        }
        setUser(res);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Error: while fetching user data ${error}`);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Check if the current user liked a specific remedy
  const isRemedyLikedByUser = async (remedyId) => {
    if (!token) return { liked: false, like: null };
    try {
      const response = await fetch(
        `${baseUrl}like/byUser/${remedyId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
      return { liked: false, like: null };
    } catch (error) {
      return { liked: false, like: null };
    }
  };

  // Toggle like/unlike for a remedy
  const toggleRemedyLike = async (remedyId) => {
    if (!token) return null;
    try {
      const response = await fetch(
        `${baseUrl}like/toggle/p/${remedyId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Check if a remedy is bookmarked by the user
  const checkIfBookmarked = async (productId) => {
    if (!token) return { bookmarked: false, data: null };
    try {
      const response = await fetch(
        `${baseUrl}Bookmark/check/p/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
      return { bookmarked: false, data: null };
    } catch (error) {
      return { bookmarked: false, data: null };
    }
  };

  // Toggle bookmark for a remedy
  const toggleBookmark = async (productId) => {
    if (!token) return null;
    try {
      const response = await fetch(
        `${baseUrl}Bookmark/toggle/p/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      userverification();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedin,
        storeTokenInLs,
        token,
        LogoutUser,
        updateUser,
        isRemedyLikedByUser,
        toggleRemedyLike,
        checkIfBookmarked,
        toggleBookmark
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContextValue;
};
