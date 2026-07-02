import { supabase } from "./supabase";

export async function logAdminAction(adminId: string, action: string, targetTable: string, targetId?: string, details?: any) {
  try {
    await supabase.from("admin_logs").insert({
      admin_id: adminId,
      action,
      target_table: targetTable,
      target_id: targetId,
      details,
    });
  } catch (err) {
    console.error("Failed to log admin action:", err);
  }
}

export async function getDashboardStats() {
  const [usersRes, candidatesRes, companiesRes, jobsRes] = await Promise.all([
    supabase.from("users_profiles").select("id", { count: "exact" }),
    supabase.from("candidates").select("user_id", { count: "exact" }),
    supabase.from("companies").select("user_id", { count: "exact" }),
    supabase.from("jobs").select("id", { count: "exact" }),
  ]);

  return {
    totalUsers: usersRes.count || 0,
    totalCandidates: candidatesRes.count || 0,
    totalCompanies: companiesRes.count || 0,
    totalJobs: jobsRes.count || 0,
  };
}

export async function getAdminUsers() {
  const { data, error } = await supabase
    .from("users_profiles")
    .select("*, candidates(neurotype, work_preference), companies(company_name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function softDeleteUser(adminId: string, userId: string, isDeleted: boolean) {
  const deleted_at = isDeleted ? new Date().toISOString() : null;
  const { error } = await supabase.from("users_profiles").update({ deleted_at }).eq("id", userId);
  if (error) throw error;
  
  await logAdminAction(adminId, isDeleted ? "SOFT_DELETE_USER" : "RESTORE_USER", "users_profiles", userId);
}

export async function updateUserRole(adminId: string, userId: string, newRole: string) {
  const { error } = await supabase.from("users_profiles").update({ role: newRole }).eq("id", userId);
  if (error) throw error;

  await logAdminAction(adminId, "CHANGE_USER_ROLE", "users_profiles", userId, { newRole });
}

export async function getAdminCompanies() {
  const { data, error } = await supabase.from('companies').select('*, users_profiles(email, deleted_at)');
  if (error) throw error;
  return data || [];
}

export async function getAdminCandidates() {
  const { data, error } = await supabase.from('candidates').select('*, users_profiles(full_name, email, deleted_at)');
  if (error) throw error;
  return data || [];
}
