import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://oupbptgzfevkzzvscekj.supabase.co",
  "sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE"
);

// ── Auth helpers (adapted from auth.js for the React/TS context) ──────────────

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "candidate" | "company" | "mentor" | "admin"
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: name || email.split("@")[0],
      },
    },
  });
  if (error) throw error;
  // Ensure a profile row exists in `users_profiles` for this user
  try {
    if (data?.user?.id) {
      const upsertBody: any = {
        id: data.user.id,
        email: email,
        full_name: name || data.user.user_metadata?.full_name || email.split("@")[0],
        role,
        completed_onboarding: false,
      };
      const { error: upsertErr } = await supabase.from("users_profiles").upsert(upsertBody);
      if (upsertErr) console.error("Error upserting users_profiles after register:", upsertErr);
    }
  } catch (e) {
    console.error("Unexpected error ensuring users_profiles on register:", e);
  }

  return data.user;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  // Ensure profile exists for signed-in user
  try {
    const userId = data?.user?.id;
    if (userId) {
      const { data: profile } = await supabase.from("users_profiles").select("id").eq("id", userId).single();
      if (!profile) {
        const { error: upsertErr } = await supabase.from("users_profiles").upsert({
          id: userId,
          email: email,
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || email.split("@")[0],
          role: data.user.user_metadata?.role ?? null,
          completed_onboarding: false,
        });
        if (upsertErr) console.error("Error upserting users_profiles after login:", upsertErr);
      }
    }
  } catch (e) {
    console.error("Unexpected error ensuring users_profiles on login:", e);
  }

  return data.user;
}

export async function signInWithGoogle(role?: string, intent?: 'login' | 'register') {
  if (role) {
    localStorage.setItem("astris_pending_role", role);
  }
  if (intent) {
    localStorage.setItem("astris_google_intent", intent);
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const userId = session.user.id;
  let { data: profile, error } = await supabase
    .from("users_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const pendingRole = localStorage.getItem("astris_pending_role");
  const intent = localStorage.getItem("astris_google_intent");
  
  let needsRegistration = false;

  if (pendingRole || intent) {
    if (!profile || !profile.role) {
      needsRegistration = true; // Siempre mostrar confirmación de registro para nuevos usuarios de Google
      
      const roleToSet = pendingRole || "candidate";
      const { data: updatedProfile, error: updateError } = await supabase
        .from("users_profiles")
        .upsert({ 
          id: userId, 
          role: roleToSet,
          email: session.user.email,
          full_name: profile?.full_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0]
        })
        .select()
        .single();
      
      if (updateError) {
        console.error("Error al crear perfil en users_profiles:", updateError);
      }
      
      if (!updateError && updatedProfile) {
        profile = updatedProfile;
        error = null;
      }
    }
    localStorage.removeItem("astris_pending_role");
    localStorage.removeItem("astris_google_intent");
  }

  // If no profile exists at all, try to create one from auth metadata
  if (!profile) {
    try {
      const fallback = {
        id: userId,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0],
        role: session.user.user_metadata?.role ?? null,
        completed_onboarding: false,
      };
      const { data: created, error: createErr } = await supabase.from("users_profiles").upsert(fallback).select().single();
      if (createErr) {
        console.error("Error creating fallback users_profiles:", createErr);
      } else {
        profile = created;
        error = null;
      }
    } catch (e) {
      console.error("Unexpected error creating fallback users_profiles:", e);
    }
  }

  if (error || !profile) return null;
  return {
    id: userId,
    email: session.user.email ?? "",
    name: profile.full_name ?? session.user.email ?? "",
    role: profile.role as "candidate" | "company" | "mentor",
    completedOnboarding: profile.completed_onboarding ?? false,
    needsRegistration,
  };
}

export async function getCandidates() {
  const { data, error } = await supabase
    .from("users_profiles")
    .select("*")
    .eq("role", "candidate");

  if (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }

  return (data ?? []).map((profile: any) => ({ id: profile.id, profile }));
}

export async function getCompanies() {
  const { data, error } = await supabase.from("companies").select("*");
  if (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
  return data ?? [];
}

export async function getMatchesForCandidate(candidateId: string) {
  // Fetch active jobs
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(`id, title, description, company_id, status, work_modality, location_text, contract_type, offered_accommodations`)
    .eq("status", "active");

  if (error || !jobs) return [];

  // Get companies for these jobs
  const companyIds = Array.from(new Set(jobs.map((j: any) => j.company_id).filter(Boolean)));
  let companiesMap: Record<string, any> = {};
  if (companyIds.length > 0) {
    const { data: companies } = await supabase
      .from("companies")
      .select("user_id, company_name, accommodations, philosophy, work_environment")
      .in("user_id", companyIds);
    (companies || []).forEach((c: any) => { companiesMap[c.user_id] = c; });
  }

  // Get candidate info
  const { data: candidate } = await supabase.from("candidates").select("*").eq("user_id", candidateId).single();
  const workPref = (candidate?.work_preference || "").toLowerCase();

  return jobs.map((j: any) => {
    let score = 50; // Base score
    const comp = companiesMap[j.company_id];
    
    // Modality matching
    if (workPref.includes("remot") && (j.work_modality === "remote" || j.work_modality === "hybrid")) score += 30;
    else if (workPref.includes("híbrid") && j.work_modality === "hybrid") score += 20;
    else if (workPref.includes("presencial") && j.work_modality === "in-person") score += 20;

    if (comp?.accommodations?.length > 0) {
       score += Math.min(20, comp.accommodations.length * 5);
    }
    
    return {
      jobId: j.id,
      matchPercentage: Math.min(99, score)
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export async function getMatchesForCompany(companyId: string) {
  const { data: cands } = await supabase.from("candidates").select("user_id, work_preference, interests, users_profiles(full_name)");
  if (!cands) return [];

  // Simple placeholder logic based on company data if needed, or random fallback
  // The company can fetch these candidates and rank them.
  return cands.map((c: any) => {
    let score = 50 + (c.work_preference ? 20 : 0) + (c.interests ? 10 : 0);
    return {
      candidateId: c.user_id,
      matchPercentage: Math.min(99, score + Math.floor(Math.random() * 15)) // add slight noise for realism if no exact metric exists
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export async function logoutUser() {
  await supabase.auth.signOut();
}
