// /supabase/functions/invite-user/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { invitee_email, full_name, department, permissions }: InvitePayload =
      await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // 1️⃣ Verify inviter
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role, factory_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile)
      throw new Error("Could not find inviter profile.");
    if (profile.role !== "admin")
      throw new Error("Only admins can invite users.");
    if (!profile.factory_id) throw new Error("Admin not linked to a factory.");

    // 2️⃣ Invite new user
    const { data, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(invitee_email, {
        data: {
          full_name,
          department,
          permissions,
          factory_id: profile.factory_id,
          role: "user",
        },
      });

    if (inviteError) throw inviteError;

    // 3️⃣ Immediately create profile row
    if (data?.user) {
      const { error: profileInsertError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: data.user.id,
          full_name,
          department,
          factory_id: profile.factory_id,
          role: "user",
          permissions,
        });

      if (profileInsertError) throw profileInsertError;
    }

    return new Response(
      JSON.stringify({ message: "Invite sent successfully!" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
