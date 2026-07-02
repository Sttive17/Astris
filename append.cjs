const fs = require('fs');
const code = `
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
`;
fs.appendFileSync('src/lib/supabase-admin.ts', code);
console.log("Appended to supabase-admin.ts");
