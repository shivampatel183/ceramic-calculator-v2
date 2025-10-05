// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
// It's best practice to use environment variables for this
const supabaseUrl = "https://ohupmnfcvgbyywkhlbeg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odXBtbmZjdmdieXl3a2hsYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NTYwODYsImV4cCI6MjA3NTIzMjA4Nn0.Fh-abfYZ34bHtQLANf-yvyUNEAvx9Iq8YP10rGNjpg8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
