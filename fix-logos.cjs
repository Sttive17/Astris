const fs = require('fs');
const file = 'src/app/AstrisApp.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSection = /<div className="flex items-center justify-center gap-12">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;

const newSection = `<div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">

              {/* Closer to the Stars */}
              <a href="https://closertothestars.org/" target="_blank" rel="noreferrer" title="Closer To The Stars"
                className="group flex items-center justify-center rounded-3xl border-2 border-border bg-background transition-all hover:border-primary/60 hover:shadow-xl hover:-translate-y-1 hover:scale-105 shrink-0"
                style={{ width: 120, height: 120 }}>
                <img src={closerToTheStarsImg} alt="Closer To The Stars" className="object-contain transition-transform group-hover:scale-110" style={{ width: 80, height: 80 }} />
              </a>

              {/* Vibra Latina */}
              <a href="https://www.vibralatinatx.com/" target="_blank" rel="noreferrer" title="Vibra Latina"
                className="group flex items-center justify-center rounded-3xl border-2 border-border bg-background transition-all hover:border-primary/60 hover:shadow-xl hover:-translate-y-1 hover:scale-105 shrink-0"
                style={{ width: 120, height: 120 }}>
                <img src={vibralatinaImg} alt="Vibra Latina" className="object-contain transition-transform group-hover:scale-110" style={{ width: 80, height: 80 }} />
              </a>

              {/* Microsoft */}
              <a href="https://support.microsoft.com/es-us/contactus/" target="_blank" rel="noreferrer" title="Microsoft"
                className="group flex items-center justify-center rounded-3xl border-2 border-border bg-background transition-all hover:border-primary/60 hover:shadow-xl hover:-translate-y-1 hover:scale-105 shrink-0"
                style={{ width: 120, height: 120 }}>
                <svg width="60" height="60" viewBox="0 0 21 21" aria-hidden="true" className="transition-transform group-hover:scale-110">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
              </a>

              {/* The Genuine Foundation */}
              <a href="https://genuinecup.org/" target="_blank" rel="noreferrer" title="The Genuine Foundation"
                className="group flex items-center justify-center rounded-3xl border-2 border-border bg-background transition-all hover:border-primary/60 hover:shadow-xl hover:-translate-y-1 hover:scale-105 shrink-0"
                style={{ width: 120, height: 120 }}>
                <img src={genuineImg} alt="The Genuine Foundation" className="object-contain transition-transform group-hover:scale-110" style={{ width: 80, height: 80 }} />
              </a>

            </div>
          </div>
        </section>`;

content = content.replace(oldSection, newSection);

fs.writeFileSync(file, content);
console.log("Logos fixed");
