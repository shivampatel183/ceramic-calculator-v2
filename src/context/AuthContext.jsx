// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      // First, get the session information
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // If a session exists, fetch the user's profile from the 'profiles' table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, department, factory_id") // Fetch all necessary details
          .eq("id", session.user.id)
          .single();

        // Combine the auth user object with their profile details
        setUser({
          ...session.user,
          ...profile,
          ceramic_name: profile?.full_name,
        });
      }
      setLoading(false);
    };

    // Run the function on initial load
    getSessionAndProfile();

    // Set up a listener for authentication state changes (login, logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          // If the user logs in, fetch their profile again
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name, department, factory_id")
            .eq("id", session.user.id)
            .single();

          setUser({
            ...session.user,
            ...profile,
            ceramic_name: profile?.full_name,
          });
        } else {
          // If the user logs out, clear the user state
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Provide the user, signOut function, and loading state to the rest of the app
  const value = {
    user,
    signOut: () => supabase.auth.signOut(),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to easily access the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
