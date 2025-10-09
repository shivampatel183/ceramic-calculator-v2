// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
// It's best practice to use environment variables for this
const supabaseUrl = "https://qhxzemqgfeyrfwyagexx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeHplbXFnZmV5cmZ3eWFnZXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5ODY4MzIsImV4cCI6MjA3NTU2MjgzMn0.0WDA90kw2owTmVEAg85E7K-IMPFWgDooOuVcYQOstgc";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
