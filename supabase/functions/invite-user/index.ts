// /supabase/functions/invite-user/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Define the shape of the data we expect from the client
interface InvitePayload {
  invitee_email: string;
  full_name: string;
  department: string;
  permissions: {
    data_table: {
      read: string[];
      write: string[];
    };
  };
}

Deno.serve(async (req) => {
  // This is needed for browser pre-flight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { invitee_email, full_name, department, permissions }: InvitePayload =
      await req.json();

    // Create an Admin client for Supabase to invite users
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create a client to check the inviter's role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the logged-in user who is making this request
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    // Check if the user is an admin and get their factory_id
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role, factory_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile)
      throw new Error("Could not find user profile.");
    if (profile.role !== "admin")
      throw new Error("Only admins can invite users.");
    if (!profile.factory_id)
      throw new Error("Admin is not associated with a factory.");

    // Invite the new user with metadata
    const { data, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(invitee_email, {
        data: {
          full_name,
          department,
          permissions,
          factory_id: profile.factory_id, // IMPORTANT: Associate user with the admin's factory
          role: "user", // Invited users are always 'user' role
        },
      });

    if (inviteError) throw inviteError;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
