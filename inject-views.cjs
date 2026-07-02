const fs = require('fs');
let c = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf8');

const importLines = `import CompaniesView from "./views/CompaniesView";
import CandidatesView from "./views/CandidatesView";\n`;

if (!c.includes('CompaniesView')) {
  c = c.replace('import { getDashboardStats', importLines + 'import { getDashboardStats');
}

c = c.replace('type ViewType = "overview" | "users" | "jobs";', 'type ViewType = "overview" | "users" | "jobs" | "companies" | "candidates";');

const buttons = `
          <button onClick={() => setView("companies")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "companies" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <Building2 className="w-4 h-4 mr-3" /> Empresas
          </button>
          <button onClick={() => setView("candidates")} className={"w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (view === "candidates" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
            <FileText className="w-4 h-4 mr-3" /> Candidatos
          </button>
`;

if (!c.includes('setView("companies")')) {
  c = c.replace('</nav>', buttons + '</nav>');
}

const viewsRender = `
          {view === "companies" && <CompaniesView />}
          {view === "candidates" && <CandidatesView />}
`;

if (!c.includes('<CompaniesView />')) {
  c = c.replace('{view === "jobs" && (', viewsRender + '\n          {view === "jobs" && (');
}

fs.writeFileSync('src/app/admin/AdminDashboard.tsx', c);
console.log("AdminDashboard updated with new views!");
