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
  
  const queries = ["candidates", "companies", "jobs", "mentors"];
  for (const table of queries) {
    const { data: d, error: e } = await supabase.from(table).select("*");
    console.log(`${table} count:`, d?.length, e ? e.message : "");
  }
}

test();
