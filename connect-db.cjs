const fs = require('fs');

// 1. UPDATE SUPABASE.TS
let supabaseTs = fs.readFileSync('src/lib/supabase.ts', 'utf8');
if (!supabaseTs.includes('export async function saveCandidateProfile')) {
    supabaseTs += `
export async function saveCandidateProfile(userId: string, quizAnswers: any, theme: string, font: string) {
  try {
    // Upsert into candidates table
    const { error: candErr } = await supabase.from("candidates").upsert({
      user_id: userId,
      quiz_answers: quizAnswers,
      accessibility_theme: theme,
      accessibility_font: font,
      updated_at: new Date().toISOString()
    });
    if (candErr) console.error("Error saving candidate data:", candErr);
    
    // Mark onboarding as completed in users_profiles
    const { error: profErr } = await supabase.from("users_profiles").update({
      completed_onboarding: true
    }).eq("id", userId);
    if (profErr) console.error("Error marking onboarding completed:", profErr);
    
  } catch (err) {
    console.error("Unexpected error saving profile:", err);
  }
}
`;
    fs.writeFileSync('src/lib/supabase.ts', supabaseTs);
}

// 2. UPDATE ASTRISAPP.TSX
let appTsx = fs.readFileSync('src/app/AstrisApp.tsx', 'utf8');
appTsx = appTsx.replace(
  'import { getCurrentUser, loginUser, logoutUser, registerUser, signInWithGoogle, getCandidates, getCompanies, getMatchesForCandidate, getMatchesForCompany, supabase } from "../lib/supabase";',
  'import { getCurrentUser, loginUser, logoutUser, registerUser, signInWithGoogle, getCandidates, getCompanies, getMatchesForCandidate, getMatchesForCompany, supabase, saveCandidateProfile } from "../lib/supabase";'
);

// We need to change: onNext={() => quizAxis < QUIZ_AXES.length - 1 ? setQuizAxis((a) => a + 1) : setScreen("profile")}
// to an async handler that saves to Supabase.
// Since it's inside JSX, we can wrap it in an async function.

const oldNextLogic = `onNext={() => quizAxis < QUIZ_AXES.length - 1 ? setQuizAxis((a) => a + 1) : setScreen("profile")} />`;
const newNextLogic = `onNext={async () => {
              if (quizAxis < QUIZ_AXES.length - 1) {
                setQuizAxis((a) => a + 1);
              } else {
                const user = await getCurrentUser();
                if (user?.id) {
                  await saveCandidateProfile(user.id, quizAnswers, accTheme, accFont);
                }
                setScreen("profile");
              }
            }} />`;

appTsx = appTsx.replace(oldNextLogic, newNextLogic);

fs.writeFileSync('src/app/AstrisApp.tsx', appTsx);
console.log("Supabase binding injected!");
