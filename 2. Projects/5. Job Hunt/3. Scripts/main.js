// ============================================================
// Job Hunt Dashboard — main.js
// All data stored in localStorage. No server needed.
// ============================================================

// ---- DATA ----

function loadApplications() {
  return JSON.parse(localStorage.getItem('jobhunt_applications') || '[]');
}

function saveApplications(apps) {
  localStorage.setItem('jobhunt_applications', JSON.stringify(apps));
}

const DEFAULT_PROFILE = {
  role: 'Language Services Director',
  company: 'translate plus (Publicis Groupe)',
  years: '7+',
  salary: '£50,000',
  skills: 'Language services management, localisation operations (memoQ, SDL Trados, Phrase, QA Distiller), multilingual content, vendor management, account management, team leadership (7-person global teams), project management (Jira), B2B sales, QBRs, C-suite stakeholder management, portfolio management (£1m–£2m+), Power BI, Microsoft Excel & PowerPoint, multi-timezone operations',
  looking: '100% remote, similar or better salary and conditions. Prefer analytical/data-driven work over pure sales pressure. Open to same industry (language/localisation at a tech company or enterprise) or adjacent roles in operations, revenue ops, vendor management, or customer success.',
  resume: `Fabrício da Rocha da Luz
fab14rocha@gmail.com | 07481 599705 | Leeds, UK
linkedin.com/in/fabriciodarocha

LANGUAGES
Portuguese (native), English (fluent), Italian (basic), Spanish (basic)

EXPERIENCE

Language Services Director — translate plus (Publicis Groupe), London, UK
May 2025 – Present
• Manage a £2m+ annual portfolio of key external and internal accounts (Publicis Groupe), cultivating long-term partnerships and driving contract renewal rates.
• Lead external and internal pitches to grow key accounts and generate new business.
• Leverage cross-functional teams to craft tailored client solutions, driving additional revenue while minimising churn among long-term accounts.
• Collaborate with C-suite stakeholders to align multilingual solutions with global brand strategies, ensuring seamless integration across diverse markets.

Account Director — translate plus, London, UK
May 2024 – Apr 2025 (1 year)
• Managed a £1m+ portfolio of key external accounts in medical, pharma, and robotics sectors.
• Prepared and delivered quarterly business reviews (QBRs) and client presentations, highlighting performance metrics and custom solutions.
• Coordinated with internal teams (creative, production, and ops) to deliver localisation projects on time.

Team Manager — translate plus, London, UK
Jul 2023 – Apr 2024 (10 months)
• Led a 7-person operations team across multiple timezones through regular 1-to-1s and personalised development plans.
• Acted as escalation point for client issues, resolving them quickly to maintain trust and avoid disruptions.

Assistant Team Manager — translate plus, London, UK
Sep 2022 – Jun 2023 (10 months)
• Mentored junior team members on localisation best practices, boosting overall performance and cutting errors through training and feedback.

Senior Project Manager — translate plus, London, UK
Nov 2021 – Aug 2022 (10 months)
• Lead PM for two global client accounts, overseeing hundreds of localisation projects across cross-functional teams.

Senior Project Manager — thebigword, Leeds, UK
Nov 2019 – Oct 2021 (2 years)

Project Manager — thebigword, Leeds, UK
May 2018 – Oct 2019 (1.5 years)

Face to Face Interpreting Coordinator — thebigword, Leeds, UK
Nov 2017 – Apr 2018 (6 months)

SKILLS
Leadership · Team management (global, multi-timezone) · Localisation operations · memoQ · SDL Trados · Phrase · QA Distiller · Jira · Power BI · Microsoft Excel & PowerPoint · Portfolio management · Client relationship management · QBRs · C-suite communication · B2B sales · Project management

EDUCATION
Escola Secundaria de Albufeira — Técnico de Informática, Informática · 2006–2009

CERTIFICATIONS
Essential New Skills in Sales — LinkedIn (Jan 2023)
Dealing with Difficult Clients in B2B Sales — LinkedIn (Dec 2018)`
};

function loadProfile() {
  const saved = localStorage.getItem('jobhunt_profile');
  if (saved) return JSON.parse(saved);
  return DEFAULT_PROFILE;
}

function saveProfile(profile) {
  localStorage.setItem('jobhunt_profile', JSON.stringify(profile));
}

// ---- STATS ----

function updateStats(apps) {
  document.getElementById('stat-total').textContent =
    apps.filter(a => a.status === 'Applied').length;
  document.getElementById('stat-interview').textContent =
    apps.filter(a => a.status === 'Interview').length;
  document.getElementById('stat-offer').textContent =
    apps.filter(a => a.status === 'Offer').length;
  document.getElementById('stat-rejected').textContent =
    apps.filter(a => a.status === 'Rejected').length;
}

// ---- APPLICATIONS TABLE ----

function renderTable() {
  const apps = loadApplications();
  const statusFilter = document.getElementById('filter-status').value;
  const searchFilter = document.getElementById('filter-search').value.toLowerCase();
  const tbody = document.getElementById('applications-body');
  const emptyState = document.getElementById('empty-state');

  const filtered = apps.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.company.toLowerCase().includes(searchFilter) ||
      app.role.toLowerCase().includes(searchFilter);
    return matchesStatus && matchesSearch;
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    document.getElementById('applications-table').style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    document.getElementById('applications-table').style.display = 'table';

    filtered.forEach(app => {
      const tr = document.createElement('tr');
      const companyCell = app.url
        ? `<a href="${app.url}" target="_blank" class="company-link">${app.company}</a>`
        : app.company;

      let daysCell = '—';
      if (app.date) {
        const diff = Math.floor((Date.now() - new Date(app.date)) / 86400000);
        const label = diff === 0 ? 'today' : diff === 1 ? '1 day ago' : `${diff} days ago`;
        daysCell = `${app.date}<br><span class="days-ago">${label}</span>`;
      }

      tr.innerHTML = `
        <td>${companyCell}</td>
        <td>${app.role}</td>
        <td>${daysCell}</td>
        <td><span class="status-badge status-${app.status}">${app.status}</span></td>
        <td class="notes-cell">${app.notes || ''}</td>
        <td>
          <div class="row-actions">
            <button class="btn-view" data-id="${app.id}">View</button>
            <button class="btn-edit" data-id="${app.id}">Edit</button>
            <button class="btn-delete" data-id="${app.id}">✕</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteApplication(btn.dataset.id));
    });

    tbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });

    tbody.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => openDetailModal(btn.dataset.id));
    });
  }

  updateStats(apps);
}

// ---- ADD / EDIT MODAL ----

let editingId = null;

function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Add Application';
  document.getElementById('form-company').value = '';
  document.getElementById('form-role').value = '';
  document.getElementById('form-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('form-status').value = 'Applied';
  document.getElementById('form-url').value = '';
  document.getElementById('form-apply-url').value = '';
  document.getElementById('form-cv').value = '';
  document.getElementById('form-salary').value = '';
  document.getElementById('form-salary-in-role').value = 'not-listed';
  document.getElementById('form-app-method').value = 'portal';
  document.getElementById('form-notes').value = '';
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('form-company').focus();
}

function openEditModal(id) {
  const apps = loadApplications();
  const app = apps.find(a => a.id === id);
  if (!app) return;

  editingId = id;
  document.getElementById('modal-title').textContent = 'Edit Application';
  document.getElementById('form-company').value = app.company;
  document.getElementById('form-role').value = app.role;
  document.getElementById('form-date').value = app.date || '';
  document.getElementById('form-status').value = app.status;
  document.getElementById('form-url').value = app.url || '';
  document.getElementById('form-apply-url').value = app.applyUrl || '';
  document.getElementById('form-cv').value = app.cv || '';
  document.getElementById('form-salary').value = app.salaryExpectation || '';
  document.getElementById('form-salary-in-role').value = app.salaryInRole || 'not-listed';
  document.getElementById('form-app-method').value = app.appMethod || 'portal';
  document.getElementById('form-notes').value = app.notes || '';
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function openDetailModal(id) {
  const apps = loadApplications();
  const app = apps.find(a => a.id === id);
  if (!app) return;

  document.getElementById('detail-title').textContent = `${app.company} — ${app.role}`;
  document.getElementById('detail-company').value = app.company || '';
  document.getElementById('detail-role').value = app.role || '';
  document.getElementById('detail-date').value = app.date || '';
  document.getElementById('detail-status').value = app.status || 'Applied';
  document.getElementById('detail-cv').value = app.cv || '';
  document.getElementById('detail-salary').value = app.salaryExpectation || '';
  document.getElementById('detail-salary-in-role').value = app.salaryInRole || 'not-listed';
  document.getElementById('detail-app-method').value = app.appMethod || 'portal';
  document.getElementById('detail-url').value = app.url || '';
  document.getElementById('detail-apply-url').value = app.applyUrl || '';
  document.getElementById('detail-notes').value = app.notes || '';

  document.getElementById('detail-overlay').classList.remove('hidden');
  document.getElementById('save-detail').dataset.id = id;
}

function closeDetailModal() {
  document.getElementById('detail-overlay').classList.add('hidden');
}

function saveFromDetail() {
  const id = document.getElementById('save-detail').dataset.id;
  const apps = loadApplications();
  const index = apps.findIndex(a => a.id === id);
  if (index === -1) return;

  const company = document.getElementById('detail-company').value.trim();
  const role = document.getElementById('detail-role').value.trim();
  if (!company || !role) { alert('Company and Role are required.'); return; }

  apps[index] = {
    ...apps[index],
    company,
    role,
    date: document.getElementById('detail-date').value,
    status: document.getElementById('detail-status').value,
    cv: document.getElementById('detail-cv').value.trim(),
    salaryExpectation: document.getElementById('detail-salary').value.trim(),
    salaryInRole: document.getElementById('detail-salary-in-role').value,
    appMethod: document.getElementById('detail-app-method').value,
    url: document.getElementById('detail-url').value.trim(),
    applyUrl: document.getElementById('detail-apply-url').value.trim(),
    notes: document.getElementById('detail-notes').value.trim(),
  };

  saveApplications(apps);
  closeDetailModal();
  renderTable();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  editingId = null;
}

function saveApplication() {
  const company = document.getElementById('form-company').value.trim();
  const role = document.getElementById('form-role').value.trim();

  if (!company || !role) {
    alert('Company and Role are required.');
    return;
  }

  const apps = loadApplications();

  const fields = {
    company,
    role,
    date: document.getElementById('form-date').value,
    status: document.getElementById('form-status').value,
    url: document.getElementById('form-url').value.trim(),
    applyUrl: document.getElementById('form-apply-url').value.trim(),
    cv: document.getElementById('form-cv').value.trim(),
    salaryExpectation: document.getElementById('form-salary').value.trim(),
    salaryInRole: document.getElementById('form-salary-in-role').value,
    appMethod: document.getElementById('form-app-method').value,
    notes: document.getElementById('form-notes').value.trim(),
  };

  if (editingId) {
    const index = apps.findIndex(a => a.id === editingId);
    if (index !== -1) apps[index] = { ...apps[index], ...fields };
  } else {
    apps.push({ id: Date.now().toString(), ...fields });
  }

  saveApplications(apps);
  closeModal();
  renderTable();
}

function deleteApplication(id) {
  if (!confirm('Delete this application?')) return;
  const apps = loadApplications().filter(a => a.id !== id);
  saveApplications(apps);
  renderTable();
}

// ---- PROFILE ----

function loadProfileUI() {
  const p = loadProfile();
  document.getElementById('profile-role').value = p.role || '';
  document.getElementById('profile-company').value = p.company || '';
  document.getElementById('profile-years').value = p.years || '';
  document.getElementById('profile-salary').value = p.salary || '';
  document.getElementById('profile-skills').value = p.skills || '';
  document.getElementById('profile-looking').value = p.looking || '';
  document.getElementById('profile-resume').value = p.resume || '';
}

function saveProfileUI() {
  saveProfile({
    role: document.getElementById('profile-role').value,
    company: document.getElementById('profile-company').value,
    years: document.getElementById('profile-years').value,
    salary: document.getElementById('profile-salary').value,
    skills: document.getElementById('profile-skills').value,
    looking: document.getElementById('profile-looking').value,
    resume: document.getElementById('profile-resume').value,
  });
  const btn = document.getElementById('save-profile');
  btn.textContent = 'Saved!';
  setTimeout(() => { btn.textContent = 'Save'; }, 1500);
}

// ---- JOB BOARD ROLE SEARCHES ----

const ROLE_SEARCHES = {
  'localization-pm': {
    label: 'Localisation Program Manager',
    links: [
      { label: 'LinkedIn — Localisation Program Manager', note: 'Localisation / Localization Program Manager · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=localization%20program%20manager%20OR%20localisation%20program%20manager%20OR%20localization%20manager&f_WT=2&geoId=101165590' },
      { label: 'LinkedIn — Globalisation / i18n Manager', note: 'Related titles used by tech companies · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=localization%20project%20manager%20OR%20globalization%20manager%20OR%20i18n%20manager&f_WT=2&geoId=101165590' },
      { label: 'LinkedIn — Localisation Ops (Tech & Software)', note: 'Filtered to Technology & Software industry · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=localization%20operations%20manager%20OR%20translation%20program%20manager&f_WT=2&f_I=96%2C6&geoId=101165590' },
      { label: 'Indeed UK — Localisation Program Manager', note: 'Remote only · UK-based search', url: 'https://uk.indeed.com/jobs?q=localization+program+manager+OR+localisation+program+manager&sc=0kf%3Aattr%28DSQF7%29%3B' },
      { label: 'Glassdoor UK — Localisation Program Manager', note: 'United Kingdom · Apply remote filter once on page', url: 'https://www.glassdoor.co.uk/Job/united-kingdom-localization-program-manager-jobs-SRCH_IL.0,14_IN2_KO15,43.htm' },
      { label: 'Reed — Localisation Manager', note: 'UK job board · Localisation roles', url: 'https://www.reed.co.uk/jobs/localisation-program-manager-jobs' },
      { label: 'Remote OK — Localisation', note: 'Remote-only global board', url: 'https://remoteok.com/remote-localization-jobs' },
      { label: 'ITI Job Board', note: 'Institute of Translation and Interpreting · UK industry roles', url: 'https://www.iti.org.uk/discover/jobs.html' },
    ]
  },
  'head-of-localisation': {
    label: 'Head of Localisation',
    links: [
      { label: 'LinkedIn — Head of Localisation / Director', note: 'Director-level localisation roles · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=head%20of%20localisation%20OR%20head%20of%20localization%20OR%20director%20of%20localization&f_WT=2&geoId=101165590' },
      { label: 'LinkedIn — Localisation Director / VP', note: 'Senior leadership · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=localisation%20director%20OR%20localization%20director%20OR%20VP%20localization&f_WT=2&geoId=101165590' },
      { label: 'Indeed UK — Head of Localisation', note: 'Remote only · UK-based search', url: 'https://uk.indeed.com/jobs?q=head+of+localisation+OR+director+of+localization&sc=0kf%3Aattr%28DSQF7%29%3B' },
      { label: 'Glassdoor UK — Head of Localisation', note: 'United Kingdom · Apply remote filter once on page', url: 'https://www.glassdoor.co.uk/Job/united-kingdom-head-of-localization-jobs-SRCH_IL.0,14_IN2_KO15,31.htm' },
      { label: 'Reed — Localisation Director', note: 'UK job board', url: 'https://www.reed.co.uk/jobs/localisation-director-jobs' },
      { label: 'ITI Job Board', note: 'Institute of Translation and Interpreting · UK industry roles', url: 'https://www.iti.org.uk/discover/jobs.html' },
    ]
  },
  'vendor-manager': {
    label: 'Vendor Manager (Language)',
    links: [
      { label: 'LinkedIn — Vendor Manager (Language / Translation)', note: 'Vendor management · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=vendor%20manager%20translation%20OR%20vendor%20manager%20language%20OR%20supplier%20manager%20localisation&f_WT=2&geoId=101165590' },
      { label: 'LinkedIn — Language Procurement / Supplier Manager', note: 'Related procurement roles · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=language%20procurement%20manager%20OR%20translation%20vendor%20manager%20OR%20LSP%20manager&f_WT=2&geoId=101165590' },
      { label: 'Indeed UK — Vendor Manager (Language)', note: 'Remote only · UK-based search', url: 'https://uk.indeed.com/jobs?q=vendor+manager+translation+OR+language+vendor+manager&sc=0kf%3Aattr%28DSQF7%29%3B' },
      { label: 'Reed — Vendor / Supplier Manager', note: 'UK job board', url: 'https://www.reed.co.uk/jobs/vendor-manager-jobs' },
      { label: 'ITI Job Board', note: 'Institute of Translation and Interpreting · UK industry roles', url: 'https://www.iti.org.uk/discover/jobs.html' },
    ]
  },
  'revenue-ops': {
    label: 'Revenue Operations Manager',
    links: [
      { label: 'LinkedIn — Revenue Operations Manager', note: 'RevOps roles · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=revenue%20operations%20manager%20OR%20RevOps%20manager&f_WT=2&geoId=101165590' },
      { label: 'LinkedIn — Sales Operations Manager', note: 'Related title · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=sales%20operations%20manager%20OR%20GTM%20operations%20manager&f_WT=2&geoId=101165590' },
      { label: 'Indeed UK — Revenue Operations', note: 'Remote only · UK-based search', url: 'https://uk.indeed.com/jobs?q=revenue+operations+manager+OR+revops+manager&sc=0kf%3Aattr%28DSQF7%29%3B' },
      { label: 'Glassdoor UK — Revenue Operations Manager', note: 'United Kingdom · Apply remote filter once on page', url: 'https://www.glassdoor.co.uk/Job/united-kingdom-revenue-operations-manager-jobs-SRCH_IL.0,14_IN2_KO15,41.htm' },
      { label: 'Reed — Revenue Operations', note: 'UK job board', url: 'https://www.reed.co.uk/jobs/revenue-operations-manager-jobs' },
    ]
  },
  'customer-success': {
    label: 'Customer Success Director',
    links: [
      { label: 'LinkedIn — Customer Success Director', note: 'Director-level CSM · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=customer%20success%20director%20OR%20VP%20customer%20success&f_WT=2&geoId=101165590' },
      { label: 'LinkedIn — Head of Customer Success', note: 'Related title · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=head%20of%20customer%20success%20OR%20customer%20success%20manager%20director&f_WT=2&geoId=101165590' },
      { label: 'Indeed UK — Customer Success Director', note: 'Remote only · UK-based search', url: 'https://uk.indeed.com/jobs?q=customer+success+director+OR+head+of+customer+success&sc=0kf%3Aattr%28DSQF7%29%3B' },
      { label: 'Glassdoor UK — Customer Success Director', note: 'United Kingdom · Apply remote filter once on page', url: 'https://www.glassdoor.co.uk/Job/united-kingdom-customer-success-director-jobs-SRCH_IL.0,14_IN2_KO15,40.htm' },
      { label: 'Reed — Customer Success Director', note: 'UK job board', url: 'https://www.reed.co.uk/jobs/customer-success-director-jobs' },
    ]
  },
  'operations-director': {
    label: 'Operations Director',
    links: [
      { label: 'LinkedIn — Operations Director', note: 'Operations Director / Head of Ops · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=operations%20director%20OR%20head%20of%20operations&f_WT=2&geoId=101165590' },
      { label: 'LinkedIn — VP / Director of Operations', note: 'Related title · Remote · UK', url: 'https://www.linkedin.com/jobs/search/?keywords=VP%20operations%20OR%20director%20of%20operations%20OR%20COO&f_WT=2&geoId=101165590' },
      { label: 'Indeed UK — Operations Director', note: 'Remote only · UK-based search', url: 'https://uk.indeed.com/jobs?q=operations+director+OR+head+of+operations&sc=0kf%3Aattr%28DSQF7%29%3B' },
      { label: 'Glassdoor UK — Operations Director', note: 'United Kingdom · Apply remote filter once on page', url: 'https://www.glassdoor.co.uk/Job/united-kingdom-operations-director-jobs-SRCH_IL.0,14_IN2_KO15,34.htm' },
      { label: 'Reed — Operations Director', note: 'UK job board', url: 'https://www.reed.co.uk/jobs/operations-director-jobs' },
    ]
  },
  'university-he': {
    label: 'University / Higher Education',
    links: [
      { label: 'jobs.ac.uk — Language / Localisation roles', note: 'Main UK university jobs board · Language Services & Translation', url: 'https://www.jobs.ac.uk/search/?keywords=language+services+OR+localisation+OR+translation+manager&location=Leeds&distance=30' },
      { label: 'jobs.ac.uk — Programme / Operations Manager', note: 'Professional services roles · 30 miles from Leeds', url: 'https://www.jobs.ac.uk/search/?keywords=programme+manager+OR+operations+manager+OR+project+manager&location=Leeds&distance=30&type=professional-support' },
      { label: 'jobs.ac.uk — International Office / Global Engagement', note: 'International student services · 30 miles from Leeds', url: 'https://www.jobs.ac.uk/search/?keywords=international+manager+OR+global+engagement+OR+international+partnerships&location=Leeds&distance=30' },
      { label: 'University of Leeds — All vacancies', note: 'Direct university jobs portal', url: 'https://jobs.leeds.ac.uk/' },
      { label: 'Leeds Beckett University — Jobs', note: 'Direct university jobs portal', url: 'https://www.leedsbeckett.ac.uk/jobs/' },
      { label: 'University of Bradford — Jobs', note: 'Direct university jobs portal', url: 'https://www.bradford.ac.uk/jobs/' },
      { label: 'University of York — Jobs', note: 'Direct university jobs portal', url: 'https://jobs.york.ac.uk/' },
      { label: 'Leeds Trinity University — Jobs', note: 'Direct university jobs portal', url: 'https://www.leedstrinity.ac.uk/about/working-here/' },
    ]
  },
};

let activeRole = 'localization-pm';

function renderJobBoards(roleKey) {
  activeRole = roleKey;
  const role = ROLE_SEARCHES[roleKey];
  const list = document.getElementById('job-board-links');
  const note = document.getElementById('links-note');

  note.innerHTML = `Showing searches for: <strong>${role.label}</strong> · Remote · UK-based hiring. <button class="btn-reset-role" id="reset-role">Show all</button>`;

  list.innerHTML = role.links.map(link => `
    <li>
      <a href="${link.url}" target="_blank" class="job-link">
        <strong>${link.label}</strong>
        <small>${link.note}</small>
      </a>
    </li>
  `).join('');

  document.getElementById('reset-role').addEventListener('click', resetJobBoards);

  document.querySelectorAll('.role-card').forEach(card => {
    card.classList.toggle('role-card--active', card.dataset.role === roleKey);
  });
}

function resetJobBoards() {
  activeRole = null;
  const note = document.getElementById('links-note');
  note.textContent = 'Click a role in the Role Explorer to filter these searches. Remote · UK-based hiring.';

  const allLinks = Object.values(ROLE_SEARCHES).flatMap(r => r.links);
  const seen = new Set();
  const unique = allLinks.filter(l => {
    if (seen.has(l.url)) return false;
    seen.add(l.url);
    return true;
  });

  const list = document.getElementById('job-board-links');
  list.innerHTML = unique.map(link => `
    <li>
      <a href="${link.url}" target="_blank" class="job-link">
        <strong>${link.label}</strong>
        <small>${link.note}</small>
      </a>
    </li>
  `).join('');

  document.querySelectorAll('.role-card').forEach(card => card.classList.remove('role-card--active'));
}

// ---- RESUME TAILORER ----

function generatePrompt() {
  const jd = document.getElementById('tailor-jd').value.trim();
  const profile = loadProfile();

  if (!jd) {
    alert('Paste a job description first.');
    return;
  }

  const resumeSection = profile.resume
    ? `\n\nMy current resume:\n${profile.resume}`
    : '';

  const skillsSection = profile.skills
    ? `\n\nMy key skills: ${profile.skills}`
    : '';

  const lookingSection = profile.looking
    ? `\n\nWhat I'm looking for: ${profile.looking}`
    : '';

  const prompt = `I'm applying for a job and need help tailoring my resume to this specific role.

My background:
- Current role: ${profile.role || 'Language Services Director'}
- Current company: ${profile.company || 'Publicis Production'}
- Years of experience: ${profile.years || '10+'}
- Target salary: ${profile.salary || 'similar to current'}${skillsSection}${lookingSection}

Job description I'm applying to:
${jd}${resumeSection}

Please:
1. Identify the most relevant parts of my background for this role
2. Rewrite my resume (or key bullet points) to match the language and priorities of this job description
3. Flag any gaps between my experience and what they're asking for
4. Suggest how I could address those gaps in a cover letter`;

  document.getElementById('tailor-output').value = prompt;
}

function copyPrompt() {
  const output = document.getElementById('tailor-output').value;
  if (!output) return;
  navigator.clipboard.writeText(output).then(() => {
    const confirm = document.getElementById('copy-confirm');
    confirm.classList.add('visible');
    setTimeout(() => confirm.classList.remove('visible'), 2000);
  });
}

// ---- INIT ----

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  loadProfileUI();
  renderJobBoards('localization-pm');

  document.querySelectorAll('.role-card[data-role]').forEach(card => {
    card.addEventListener('click', () => renderJobBoards(card.dataset.role));
  });

  // Modal
  document.getElementById('open-add-modal').addEventListener('click', openAddModal);
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('cancel-modal').addEventListener('click', closeModal);
  document.getElementById('save-application').addEventListener('click', saveApplication);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // Filters
  document.getElementById('filter-status').addEventListener('change', renderTable);
  document.getElementById('filter-search').addEventListener('input', renderTable);

  // Profile
  document.getElementById('save-profile').addEventListener('click', saveProfileUI);

  // Tailorer
  document.getElementById('generate-prompt').addEventListener('click', generatePrompt);
  document.getElementById('copy-prompt').addEventListener('click', copyPrompt);

  // Detail modal
  document.getElementById('close-detail').addEventListener('click', closeDetailModal);
  document.getElementById('close-detail-btn').addEventListener('click', closeDetailModal);
  document.getElementById('save-detail').addEventListener('click', saveFromDetail);
  document.getElementById('detail-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('detail-overlay')) closeDetailModal();
  });

  // Keyboard shortcut: Escape closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeDetailModal(); }
    if (e.key === 'Enter' && !document.getElementById('modal-overlay').classList.contains('hidden')) {
      saveApplication();
    }
  });
});
