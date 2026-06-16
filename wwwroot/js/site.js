const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
const content = $('#content');

function setSel(cur) {
    $$('.navitem').forEach(x => {
        const on = x.dataset.go === cur;
        x.classList.toggle('sel', on);
        if (on) {
            x.setAttribute('aria-current', 'true');
            x.scrollIntoView({
                                 behavior: 'smooth',
                                 block:    'nearest',
                                 inline:   'nearest'
                             });
        } else {
            x.removeAttribute('aria-current');
        }
    });
}

function activatePane(id) {
    const pane = document.getElementById(id);
    if (!pane) return;
    $$('.pane').forEach(p => p.classList.toggle('active', p === pane));
    setSel(id);
    if (typeof restore === 'function' && win.classList.contains('minimized')) restore();
    content.scrollTop = 0;
}

$$('[data-go]').forEach(b => b.addEventListener('click', e => {
    if (b.tagName === 'A') e.preventDefault();
    activatePane(b.dataset.go);
    closeStart();
}));

// detail modal (experience + projects)
const detailModal = $('#detailModal');
const EXP = {
    one_main:  {
        desc:   ['Drove data engineering initiatives across Snowflake, SQL Server, and IBM Mainframe, operating with high autonomy across multiple concurrent priorities.',
                 'Developed complex SQL solutions, including advanced queries, stored procedures, and data transformations, to power enterprise reporting and cross-departmental analytics.',
                 'Led strategic data analysis efforts that delivered actionable insights to business and technical stakeholders, directly informing operational decision-making.',
                 'Strengthened data integrity by stewarding database schemas and resolving systemic data quality issues, reducing downstream errors and improving cross-team confidence in shared datasets.',
                 'Improved system reliability and performance through targeted optimisation and structured root cause analysis, resolving issues that had previously evaded detection.',
                 'Partnered with the Custom Applications team to deliver specialised SQL solutions for the E-Disputes Dashboard, giving customer-facing teams accurate and timely data visibility.',
                 'Collaborated with the Law Coding team to modernise their workflows by designing a custom web application that streamlined law grid modification and automated mainframe publication.',
                 {
                     text: 'Served as principal architect and lead developer for the Law Coding Dev Portal, establishing the team\u2019s authoritative platform for law grid data management.',
                     sub:  ['Designed the SQL Server data model and governance approach to ensure long-term schema maintainability.',
                            'Built a reliable ETL pipeline using a C# CLI application to automate data ingestion.',
                            'Delivered an ASP.NET Core API and Blazor WebAssembly client, providing a modern, maintainable front-to-back solution.',
                            'Defined the system\u2019s infrastructure, integration points, and architectural direction to support future growth.']
                 },
                 'Produced comprehensive technical documentation and translated complex concepts for non-technical stakeholders, enabling faster decision-making and smoother cross-team coordination.',
                 'Replaced an error-prone Excel-based amortisation workflow with a purpose-built C# CLI tool that validated loan term inputs and generated accurate amortisation schedules, eliminating manual calculation errors on a recurring business-critical process.'],
        skills: ['Data Engineering', 'Data Analytics', 'Software Design', 'Software Infrastructure', 'Cloud & Deployment Architecture', 'Data Warehousing', 'ETL Pipeline Design',
                 'Database Governance', 'Performance Tuning', 'Stakeholder Communication'],
        tech:   [{name: 'Advanced Excel Workbooks'}, {
            name:  'IBM Mainframe',
            items: ['JCL', 'Easytrieve']
        }, {
            name:  '.NET (C#)',
            items: ['Console / CLI', 'ASP.NET Core API', 'Blazor WebAssembly']
        }, {
            name:  'Data Platforms',
            items: ['Snowflake', 'MS SQL Server', 'T-SQL']
        }, {
            name:  'Tooling',
            items: ['JetBrains Rider', 'Visual Studio Code', 'DataSpell']
        }]
    },
    toyota:    {
        desc:   ['Engineered and maintained internal web applications supporting TMNA\u2019s manufacturing, safety, maintenance, and administrative operations.',
                 'Delivered scalable solutions that reduced manual effort across multiple departments, contributing directly to production engineering objectives.',
                 'Contributed as a key SCRUM team member, driving automation and workflow improvements that increased operational efficiency and freed teams from repetitive manual tasks.',
                 'Participated in all architectural reviews for the team\u2019s project portfolio, shaping system design decisions and ensuring alignment with long-term architectural goals.',
                 'Elevated engineering standards through code reviews, a consistent .editorconfig-driven style baseline, and a formalised code style guide, reducing friction across development and review cycles.',
                 'Shaped the architecture and implementation of a mission-critical Blazor application used by hundreds of thousands of TMNA employees and contractors, serving as the team\u2019s primary Blazor subject matter expert.',
                 'Replaced monolithic service classes with CQRS, improving separation of concerns, testability, and long-term extensibility across the codebase.',
                 'Implemented client-side state management patterns that produced more predictable application behaviour, improved rendering performance, and clarified component architecture.',
                 'Delivered offline-first inspection functionality using IndexedDB, reducing data transfer times by over 80% (from 3+ minutes to 15 to 30 seconds) and ensuring reliable operation in low-connectivity factory-floor environments.',
                 'Partnered with cross-functional teams across Production Safety, Maintenance, and Accounting to gather requirements, validate solutions, and align deliverables with operational needs.',
                 'Maintained quality and stability through hands-on testing at each stage of development and deployment, proactively identifying issues before they reached production.'],
        skills: ['Software Infrastructure', 'Software Design', 'Web Engineering', 'Relational Databases', 'Scrum', 'Microservices', 'CQRS', 'Client-Side State Management',
                 'Offline-First Architecture', 'Code Quality & Standards'],
        tech:   [{name: '.NET Framework'}, {name: 'CQRS'}, {name: 'JetBrains Rider'}, {
            name:  '.NET (C#)',
            items: ['Console / CLI', 'ASP.NET Core API', 'Blazor', 'MVC']
        }, {
            name:  'Data & Storage',
            items: ['MS SQL Server', 'IndexedDB']
        }]
    },
    lieberman: {
        desc:   ['Eliminated systemic technical debt across multiple client projects by authoring a custom PHP micro-framework modelled on ASP.NET Core, incorporating MVC, Repository, and Unit of Work patterns.',
                 'Improved long-term code quality and maintainability, replacing fragmented legacy codebases with consistent, clean architectural foundations that reduced future development friction.',
                 'Designed and delivered an in-house business management application that improved operational visibility and increased the lead-to-customer conversion rate by approximately 15% within three months of launch.',
                 'Diversified the company\u2019s technology stack by building production-grade C# and .NET solutions, demonstrating their viability and giving the business a scalable development path beyond its PHP-centric history.',
                 'Planned, architected, and delivered custom software solutions for clients, translating business requirements into robust technical implementations through close stakeholder collaboration.',
                 'Improved project clarity and team coordination by producing structured documentation, development plans, and transparent time-tracking practices.',
                 'Consistently delivered clean, well-structured code by logging, prioritising, and executing tasks against defined system requirements.',
                 'Advanced the company\u2019s engineering culture by championing modern architectural patterns and maintainability as core development principles.'],
        skills: ['Software Infrastructure', 'Software Design', 'Web Development', 'Web Applications', 'Relational Databases', 'Agile', 'Custom Framework Design',
                 'Legacy Modernisation', 'Repository / Unit of Work', 'Technical Debt Reduction'],
        tech:   [{name: 'Custom PHP Micro-Framework'}, {name: 'MariaDB & MySQL'}, {
            name:  '.NET (C#)',
            items: ['Console / CLI', 'ASP.NET Core API', 'Blazor', 'MVC']
        }, {
            name:  'Tooling',
            items: ['JetBrains Rider', 'PhpStorm']
        }]
    }
};
const PROJ = {
    zoo:         {
        img:        'wwwroot/images/zoo-tycoon-nexus.png',
        shotAlt:    'Zoo Tycoon Nexus screenshot',
        shotRatio:  '730 / 676',
        tagline:    'Native launcher for Zoo Tycoon (2001).',
        overview:   ['A modern, native Windows launcher that brings sane install management and configuration to a 20-year-old classic. It discovers every copy of the game on the machine, manages their settings, and launches the right one in a single click.',
                     'Built as a real-world proving ground for .NET 10 + Avalonia and an EF Core / SQLite persistence layer with full audit history.'],
        highlights: ['Auto-discovers and manages multiple game installs side by side.', 'Edits every zoo.ini setting through a typed UI \u2014 no hand-editing config files.',
                     'Full version history of every settings change, backed by SQLite.', 'One-click launch of the selected install with its saved configuration.'],
        tech:       ['C# / .NET 10', 'Avalonia', 'MVVM', 'EF Core', 'SQLite'],
        href:       'https://github.com/JustinianErdmier/Erdmier.ZooTycoonLauncher'
    },
    domain_core: {
        code:       '<div class="m-code">' +
                    '<div class="m-code-bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="nm">Order.cs</span><span class="pkg">NuGet \u00b7 400+ downloads</span></div>' +
                    '<pre><span class="c-cmd">$ dotnet add package Erdmier.DomainCore</span>\n\n' +
                    '<span class="c-cmt">// Identity, equality &amp; EF Core mapping \u2014 for free</span>\n' +
                    '<span class="c-key">public sealed class</span> <span class="c-type">Order</span> : <span class="c-type">AggregateRoot</span>&lt;<span class="c-type">OrderId</span>&gt;\n' +
                    '{\n' +
                    '    <span class="c-key">public</span> <span class="c-type">Money</span> Total { <span class="c-key">get</span>; <span class="c-key">private set</span>; }\n' +
                    '}</pre>' + '</div>',
        tagline:    'Lightweight DDD building blocks for .NET \u2014 published on NuGet.',
        overview:   ['A small, focused library that provides the base types every domain-driven .NET project keeps rewriting: entities, aggregate roots, and value objects \u2014 with sensible equality, identity, and EF Core mapping out of the box.',
                     'Published on NuGet with 400+ downloads, it\'s the foundation I reach for to start a clean-architecture solution without boilerplate.'],
        highlights: ['Base types for Entity, AggregateRoot, and ValueObject with correct equality semantics.',
                     'Works with EF Core out of the box \u2014 no extra configuration ceremony.', 'Zero heavy dependencies; drops into any clean-architecture solution.',
                     'Published and versioned on NuGet \u2014 400+ downloads.'],
        tech:       ['C#', 'Domain-Driven Design', 'NuGet', 'EF Core'],
        href:       'https://github.com/JustinianErdmier/Erdmier.DomainCore'
    },
    reliquary:   {
        img:        'wwwroot/images/reliquary.png',
        shotAlt:    'Reliquary screenshot',
        shotRatio:  '996 / 560',
        tagline:    'Curate, deduplicate & tidy large media collections.',
        overview:   ['A native desktop app for taming sprawling media libraries. Import into a staging area, clean and review, then commit into a managed library \u2014 with content-hash identity so files keep their identity even when cloud-sync moves or renames them.',
                     'Tackles the genuinely hard parts of a media manager: reliable dedup, stable identity across moves, and a non-destructive staging workflow.'],
        highlights: ['Staging-first import: review and clean before anything touches the managed library.', 'Content-hash identity that survives cloud-sync moves and renames.',
                     'Deduplication that finds true duplicates regardless of filename or path.', 'Non-destructive workflow \u2014 nothing is committed until you say so.'],
        tech:       ['C# / .NET', 'Avalonia', 'EF Core', 'SQLite', 'Content Hashing'],
        href:       'https://github.com/JustinianErdmier/Erdmier.Reliquary'
    }
};
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderExp(d) {
    if (!d) { return '<p class="modal-empty"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5h16v11H7l-3 3z"/><path d="M8 9h8M8 12h5"/></svg>Full description coming soon.</p>'; }
    const li = d.desc.map(it => {
        if (typeof it === 'string') return '<li>' + esc(it) + '</li>';
        return '<li>' + esc(it.text) + '<ul class="m-sublist">' + it.sub.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul></li>';
    }).join('');
    const chips = d.skills.map(s => '<span class="m-chip">' + esc(s) + '</span>').join('');
    const flats = d.tech.filter(t => !t.items).map(t => '<span class="m-tflat">' + esc(t.name) + '</span>').join('');
    const groups = d.tech.filter(t => t.items).map(
        t => '<div class="m-tgroup"><span class="m-tname">' + esc(t.name) + '</span><div class="m-tsub">' + t.items.map(i => '<span>' + esc(i) + '</span>').join('') +
             '</div></div>').join('');
    const tech = (flats ? '<div class="m-tflats">' + flats + '</div>' : '') + (groups ? '<div class="m-tgroups">' + groups + '</div>' : '');
    return '<div class="m-sec"><h4>Overview</h4><ul class="m-list">' + li + '</ul></div>' + '<div class="m-sec"><h4>Skills</h4><div class="m-chips">' + chips + '</div></div>' +
           '<div class="m-sec"><h4>Technologies</h4><div class="m-tech">' + tech + '</div></div>';
}

function renderProj(d) {
    if (!d) return '<p class="modal-empty">Details are coming soon.</p>';
    const ov = d.overview.map(p => '<p style="margin:0 0 11px; font-size:13px; line-height:1.65; color:var(--text-2);">' + esc(p) + '</p>').join('');
    const hl = d.highlights.map(h => '<li>' + esc(h) + '</li>').join('');
    const tech = d.tech.map(t => '<span class="m-chip">' + esc(t) + '</span>').join('');
    const media = d.img ?
                  '<img class="m-shot" src="' + d.img + '" alt="' + esc(d.shotAlt || 'Project screenshot') + '" loading="lazy" style="aspect-ratio:' + d.shotRatio + ';" />' :
                  (d.code || '');
    return media + '<div class="m-sec"><h4>Overview</h4>' + ov + '</div>' + '<div class="m-sec"><h4>Highlights</h4><ul class="m-list">' + hl + '</ul></div>' +
           '<div class="m-sec"><h4>Built with</h4><div class="m-chips">' + tech + '</div></div>' + '<div class="m-actions">' + '<a class="btn primary" href="' + d.href +
           '" target="_blank" rel="noopener"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.25-4.6-1.1-4.6-5a4 4 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6a4 4 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg> Open on GitHub</a>' +
           '</div>';
}

// ---- modal open/close with focus management ----
let lastFocus = null;

function openModal(title, sub, html) {
    lastFocus = document.activeElement;
    $('#detailModalTitle').innerHTML = title || 'Details';
    $('#detailModalSub').textContent = sub || '';
    const body = $('#detailModalBody');
    body.innerHTML = html;
    body.scrollTop = 0;
    detailModal.classList.add('open');
    $('#detailModalClose').focus();
}

function closeModal() {
    if (!detailModal.classList.contains('open')) return;
    detailModal.classList.remove('open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
}

$$('.tl-btn').forEach(b => b.addEventListener('click', () => openModal(b.dataset.title, b.dataset.sub, renderExp(EXP[b.dataset.key]))));
$$('.proj').forEach(p => p.addEventListener('click', () => {
    const d = PROJ[p.dataset.key];
    const title = p.querySelector('h4').textContent;
    openModal(esc(title), d ? d.tagline : '', renderProj(d));
}));
$('#detailModalClose').addEventListener('click', closeModal);
detailModal.addEventListener('click', e => { if (e.target === detailModal) closeModal(); });
// focus trap + esc
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal();
        return;
    }
    if (e.key === 'Tab' && detailModal.classList.contains('open')) {
        const f = [...detailModal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

// ---- theme: persistence + system preference ----
const tt = $('#themeToggle');

function applyTheme(mode) {
    document.body.setAttribute('data-theme', mode);
    $('#themeLabel').textContent = mode === 'dark' ? 'Light mode' : 'Dark mode';
    tt.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', mode === 'dark' ? '#1c1f24' : '#0067c0');
}

const savedTheme = localStorage.getItem('je-theme');
if (savedTheme) { applyTheme(savedTheme); } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { applyTheme('dark'); } else {
    applyTheme('light');
}
tt.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('je-theme', next);
});
// follow system changes only if user hasn't explicitly chosen
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('je-theme')) applyTheme(e.matches ? 'dark' : 'light');
    });
}

// ---- window chrome: maximize / minimize / close ----
const win = $('.win'), tbApp = $('#tbApp');
$('#capMax').addEventListener('click', () => {
    win.classList.toggle('maximized');
    win.classList.remove('minimized');
});

function minimize() {
    win.classList.add('minimized');
    tbApp.classList.remove('active');
}

function restore() {
    win.classList.remove('minimized');
    tbApp.classList.add('active');
}

$('#capMin').addEventListener('click', minimize);
tbApp.addEventListener('click', () => { win.classList.contains('minimized') ? restore() : minimize(); });
$('#tbStart').addEventListener('click', e => {
    e.stopPropagation();
    toggleStart();
});
$('#capClose').addEventListener('click', () => {
    showToast('A portfolio is never really closed. <a href="mailto:justinian.erdmier@outlook.com">Let\u2019s connect</a> instead.');
});

// ---- toast ----
let toastTimer = null;

function showToast(msg) {
    const t = $('#toast');
    $('#toastMsg').innerHTML = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 5200);
}

// ---- live taskbar clock ----
function tick() {
    const now = new Date();
    $('#clockTime').textContent = now.toLocaleTimeString([], {
        hour:   '2-digit',
        minute: '2-digit'
    });
    $('#clockDate').textContent = now.toLocaleDateString([], {
        month: 'numeric',
        day:   'numeric',
        year:  'numeric'
    });
}

tick();
setInterval(tick, 1000 * 15);

// ---- start menu ----
const startMenu = $('#startMenu'), tbStart = $('#tbStart');

function openStart() {
    startMenu.classList.add('open');
    tbStart.classList.add('active');
}

function closeStart() {
    startMenu.classList.remove('open');
    tbStart.classList.remove('active');
}

function toggleStart() { startMenu.classList.contains('open') ? closeStart() : openStart(); }

document.addEventListener('click', e => {
    if (startMenu.classList.contains('open') && !startMenu.contains(e.target) && e.target !== tbStart) closeStart();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeStart(); });

// ---- boot sequence ----
const boot = $('#boot');

function endBoot() {
    boot.classList.add('fade');
    setTimeout(() => { boot.hidden = true; }, 620);
}

function bootDuration() { return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 1300 : 2700; }

function playBoot() {
    clearTimeout(window.__bt);
    boot.hidden = false;
    boot.classList.remove('fade');
    void boot.offsetWidth; // restart the loader animation
    sessionStorage.setItem('je-booted', '1');
    window.__bt = setTimeout(endBoot, bootDuration());
}

if (!boot.hidden) { // it loaded visible — run the fade-out timer
    sessionStorage.setItem('je-booted', '1');
    window.__bt = setTimeout(endBoot, bootDuration());
}
