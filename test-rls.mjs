import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://oupbptgzfevkzzvscekj.supabase.co",
  "sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE"
);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "johansttivelinaresb@gmail.com",
    password: "Astris2026"
  });
  
  if (error) {
    console.error("Login failed:", error);
    return;
  }
  
  console.log("Logged in UID:", data.user?.id);
  
  const { data: profile } = await supabase.from("users_profiles").select("role").eq("id", data.user?.id).single();
  console.log("User role in DB:", profile?.role);
}

test();
