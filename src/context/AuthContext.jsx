// src/context/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // Try to fetch profile; if it doesn't exist, fall back to session.user
          let profile = null;
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("role, full_name, factory_id")
              .eq("id", session.user.id)
              .single();
            if (!error) profile = data;
            else console.warn("No profile found for user:", error);
          } catch (err) {
            console.error("Error fetching profile:", err);
          }

          // If profile missing, try to infer role from auth user metadata
          let inferredRole = session.user?.user_metadata?.role ?? null;
          let inferredFullName = session.user?.user_metadata?.full_name ?? null;
          if (!inferredRole) {
            try {
              const { data: userData } = await supabase.auth.getUser();
              const authUser = userData?.user ?? null;
              inferredRole =
                authUser?.user_metadata?.role ??
                authUser?.app_metadata?.role ??
                inferredRole;
              inferredFullName =
                authUser?.user_metadata?.full_name ?? inferredFullName;
            } catch (err) {
              // ignore; we'll fallback to 'user' below
            }
          }

          const userObj = profile
            ? { ...session.user, ...profile, ceramic_name: profile.full_name }
            : {
                ...session.user,
                role: inferredRole ?? "user",
                ceramic_name: inferredFullName ?? session.user?.email,
              };

          setUser(userObj);
        }
      } catch (error) {
        console.error("Error fetching session and profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          // Safe fetch profile as above
          let profile = null;
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("role, full_name, factory_id")
              .eq("id", session.user.id)
              .single();
            if (!error) profile = data;
            else console.warn("No profile found for user (listener):", error);
          } catch (err) {
            // Improve error logging so it's easier to diagnose 4xx/5xx responses
            try {
              console.error(
                "Error fetching profile (listener):",
                err?.message ?? err,
                err?.status ?? null
              );
            } catch {
              console.error("Error fetching profile (listener):", err);
            }
          }

          // If profile is missing, try to infer role from the auth user metadata
          let inferredRole = session.user?.user_metadata?.role ?? null;
          let inferredFullName = session.user?.user_metadata?.full_name ?? null;
          if (!inferredRole) {
            try {
              const { data: userData } = await supabase.auth.getUser();
              const authUser = userData?.user ?? null;
              inferredRole =
                authUser?.user_metadata?.role ??
                authUser?.app_metadata?.role ??
                inferredRole;
              inferredFullName =
                authUser?.user_metadata?.full_name ?? inferredFullName;
            } catch (err) {
              // ignore; we'll fallback to 'user' below
            }
          }

          const userObj = profile
            ? { ...session.user, ...profile, ceramic_name: profile.full_name }
            : {
                ...session.user,
                role: inferredRole ?? "user",
                ceramic_name: inferredFullName ?? session.user?.email,
              };

          setUser(userObj);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      try {
        listener?.subscription?.unsubscribe();
      } catch {}
    };
  }, []);

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

export const useAuth = () => {
  return useContext(AuthContext);
};
