// ── FILE UPLOAD ────────────────────────────────────────────────────────────────

document.getElementById('file-input').addEventListener('change', handleFile);
document.getElementById('file-reload').addEventListener('change', handleFile);

async function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const data = parseWorkbook(wb);
  renderDashboard(data);
}

// ── PARSE WORKBOOK ─────────────────────────────────────────────────────────────

const MONTH_SHEET_NAMES = [
  'Jan-26','Feb-26','Mar-26','Apr-26','May-26','Jun-26',
  'Jul-26','Aug-26','Sep-26','Oct-26','Nov-26','Dec-26'
];

function parseWorkbook(wb) {
  const months = {};

  MONTH_SHEET_NAMES.forEach(name => {
    if (wb.Sheets[name]) {
      months[name] = parseMonthlySheet(wb.Sheets[name]);
    }
  });

  return {
    yearSummary: parseSummarySheet(wb.Sheets['Summary']),
    months
  };
}

// ── PARSE SUMMARY SHEET ────────────────────────────────────────────────────────
// Reads the year-level monthly totals table (cols B–G)

function parseSummarySheet(ws) {
  if (!ws) return [];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return rows
    .filter(row => row[1] && MONTHS.includes(String(row[1]).trim()))
    .map(row => ({
      name:         String(row[1]).trim(),
      in:           num(row[2]),
      out:          num(row[3]),
      balance:      num(row[4]),
      savings:      num(row[5]),
      overpayments: num(row[6])
    }))
    .filter(m => m.in > 0); // only show months with actual data
}

// ── PARSE MONTHLY SHEET ────────────────────────────────────────────────────────
// Uses label search rather than hardcoded positions — more resilient to layout changes

const CATEGORIES = [
  'Groceries', 'Leisure / Days out', 'Others (Not essential)',
  'Others (Essential)', 'Holidays', 'Clothing', 'Savings', 'Overpayment'
];

function parseMonthlySheet(ws) {
  if (!ws) return null;
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  // Income and savings balances live in the top ~15 rows of the sheet
  const headerRows = rows.slice(0, 15);

  const totalIncome = findLabel(headerRows, 'Total Income');
  const totalFixed  = findLabel(headerRows, 'Total Fixed');
  const totalOther  = findLabel(headerRows, 'Total Other');

  // Calculate balance instead of reading it — avoids matching the wrong "Balance" label
  const balance = num(totalIncome - totalFixed - totalOther);

  // Savings account balances — restrict to header area to avoid matching savings transactions
  const savings = {
    emergency:  findLabel(headerRows, 'Emergency'),
    matteo:     findLabel(headerRows, 'Matteo'),
    lucas:      findLabel(headerRows, 'Lucas'),
    trading212: findLabel(headerRows, 'Trading 212'),
  };

  // Individual income sources
  const income = {
    fabricio:     findLabel(headerRows, 'Fabricio'),
    martina:      findLabel(headerRows, 'Martina'),
    childBenefits:findLabel(headerRows, 'Child'),
    others:       findLabel(headerRows, "Other's"),
  };

  // Category totals live in a summary panel further down the sheet
  const categoryTotals = {};
  CATEGORIES.forEach(cat => {
    categoryTotals[cat] = findLabel(rows, cat);
  });

  // Fixed expenses: col B=day, col C=name, col D=cost (col A is blank margin)
  // Skip "Start of the month" savings rows — identified by single-letter names
  const fixedExpenses = [];
  for (let r = 10; r < rows.length; r++) {
    const row = rows[r];
    const day  = row[1];
    const name = row[2];
    const cost = row[3];
    if (typeof day === 'number' && day >= 1 && day <= 31 &&
        typeof name === 'string' && name.trim().length > 2 &&
        typeof cost === 'number' && cost > 0) {
      fixedExpenses.push({ day: Math.round(day), name: name.trim(), cost: num(cost) });
    }
  }

  // Variable expenses: col E=day, col F=name, col G=cost, col H=type
  const variableExpenses = [];
  for (let r = 10; r < rows.length; r++) {
    const row = rows[r];
    const day  = row[4];
    const name = row[5];
    const cost = row[6];
    const type = row[7];
    if (typeof day === 'number' && day >= 1 && day <= 31 &&
        typeof name === 'string' && name.trim() &&
        typeof cost === 'number' && cost > 0) {
      variableExpenses.push({
        day:  Math.round(day),
        name: name.trim(),
        cost: num(cost),
        type: typeof type === 'string' ? type.trim() : 'Other',
      });
    }
  }

  return { totalIncome, totalFixed, totalOther, balance, savings, income, categoryTotals, fixedExpenses, variableExpenses };
}

// Searches rows for a label string and returns the first number that follows it in the same row
function findLabel(rows, label) {
  for (const row of rows) {
    for (let i = 0; i < row.length; i++) {
      if (typeof row[i] === 'string' && row[i].toLowerCase().includes(label.toLowerCase())) {
        for (let j = i + 1; j < row.length; j++) {
          if (typeof row[j] === 'number' && isFinite(row[j])) return num(row[j]);
        }
      }
    }
  }
  return 0;
}

// Round to 2 decimal places, handle nulls and floats
function num(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : Math.round(n * 100) / 100;
}

// Format as currency string: 1234.5 → "1,234.50"
function fmt(val) {
  return Math.abs(val).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── RENDER DASHBOARD ───────────────────────────────────────────────────────────

function renderDashboard(data) {
  document.getElementById('upload-screen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');

  const tabsEl = document.getElementById('month-tabs');
  tabsEl.innerHTML = '';

  // Year tab
  const yearBtn = makeTab('Year', () => showYear(data.yearSummary, yearBtn));
  tabsEl.appendChild(yearBtn);

  // One tab per month that has data
  const monthButtons = [];
  MONTH_SHEET_NAMES.forEach(key => {
    const monthData = data.months[key];
    if (!monthData || monthData.totalIncome === 0) return;
    const label = key.replace('-26', '');
    const btn = makeTab(label, () => showMonth(monthData, label, btn));
    tabsEl.appendChild(btn);
    monthButtons.push(btn);
  });

  // Default: show the latest month with data, or year if none
  if (monthButtons.length > 0) {
    monthButtons[monthButtons.length - 1].click();
  } else {
    yearBtn.click();
  }
}

function makeTab(label, onClick) {
  const btn = document.createElement('button');
  btn.className = 'tab-btn';
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

function setActiveTab(btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── YEAR VIEW ─────────────────────────────────────────────────────────────────

function showYear(yearData, btn) {
  setActiveTab(btn);
  document.getElementById('view-year').classList.remove('hidden');
  document.getElementById('view-month').classList.add('hidden');

  const maxIn = Math.max(...yearData.map(m => m.in), 1);

  document.getElementById('year-chart').innerHTML = `
    <div class="year-bars">
      ${yearData.map(m => `
        <div class="year-bar-col">
          <div class="year-bar-wrap">
            <div class="year-bar-in"  style="height:${(m.in  / maxIn * 100).toFixed(1)}%" title="In: £${fmt(m.in)}"></div>
            <div class="year-bar-out" style="height:${(m.out / maxIn * 100).toFixed(1)}%" title="Out: £${fmt(m.out)}"></div>
          </div>
          <div class="year-bar-label">${m.name}</div>
        </div>
      `).join('')}
    </div>
    <div class="year-legend">
      <span><span class="legend-dot green"></span>In</span>
      <span><span class="legend-dot red"></span>Out</span>
    </div>
  `;

  document.getElementById('year-table').innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Month</th><th>In</th><th>Out</th><th>Balance</th><th>Saved</th>
        </tr>
      </thead>
      <tbody>
        ${yearData.map(m => `
          <tr>
            <td>${m.name}</td>
            <td class="green">£${fmt(m.in)}</td>
            <td class="red">£${fmt(m.out)}</td>
            <td class="${m.balance >= 0 ? 'green' : 'red'}">£${fmt(m.balance)}</td>
            <td class="blue">£${fmt(m.savings)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ── MONTHLY VIEW ──────────────────────────────────────────────────────────────

function showMonth(data, monthName, btn) {
  setActiveTab(btn);
  document.getElementById('view-month').classList.remove('hidden');
  document.getElementById('view-year').classList.add('hidden');

  renderSummaryCards(data);
  renderCategoryBars(data.categoryTotals);
  renderSavings(data.savings);
  renderIncome(data.income, data.totalIncome);
  renderFixedExpenses(data.fixedExpenses);
  renderVariableExpenses(data.variableExpenses);
}

function renderSummaryCards(data) {
  const totalOut = num(data.totalFixed + data.totalOther);
  document.getElementById('summary-cards').innerHTML = `
    <div class="card">
      <div class="card-label">Total In</div>
      <div class="card-value green">£${fmt(data.totalIncome)}</div>
    </div>
    <div class="card">
      <div class="card-label">Total Out</div>
      <div class="card-value red">£${fmt(totalOut)}</div>
    </div>
    <div class="card">
      <div class="card-label">Balance</div>
      <div class="card-value ${data.balance >= 0 ? 'green' : 'red'}">£${fmt(data.balance)}</div>
    </div>
    <div class="card">
      <div class="card-label">Saved</div>
      <div class="card-value blue">£${fmt(data.categoryTotals['Savings'] || 0)}</div>
    </div>
  `;
}

const CATEGORY_COLORS = {
  'Groceries':              '#3fb950',
  'Leisure / Days out':     '#58a6ff',
  'Others (Not essential)': '#f85149',
  'Others (Essential)':     '#e6a817',
  'Holidays':               '#bc8cff',
  'Clothing':               '#ec6cb9',
  'Savings':                '#39d353',
  'Overpayment':            '#56d364',
};

function renderCategoryBars(categoryTotals) {
  const el = document.getElementById('category-bars');
  const entries = Object.entries(categoryTotals)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    el.innerHTML = '<p class="empty">No data for this month</p>';
    return;
  }

  const max = Math.max(...entries.map(([, v]) => v));

  el.innerHTML = entries.map(([cat, val]) => `
    <div class="bar-row">
      <div class="bar-label">${cat}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${(val / max * 100).toFixed(1)}%; background:${CATEGORY_COLORS[cat] || '#8b949e'}"></div>
      </div>
      <div class="bar-value">£${fmt(val)}</div>
    </div>
  `).join('');
}

function renderIncome(income, total) {
  const sources = [
    { label: 'Fabricio',       val: income.fabricio },
    { label: 'Martina',        val: income.martina },
    { label: 'Child Benefits', val: income.childBenefits },
    { label: "Other's",        val: income.others },
  ].filter(s => s.val > 0);

  document.getElementById('income-list').innerHTML = `
    <table class="data-table">
      <tbody>
        ${sources.map(s => `
          <tr>
            <td>${s.label}</td>
            <td class="green" style="text-align:right">£${fmt(s.val)}</td>
          </tr>
        `).join('')}
        <tr style="border-top:1px solid var(--border); font-weight:700">
          <td>Total</td>
          <td class="green" style="text-align:right">£${fmt(total)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderFixedExpenses(expenses) {
  const el = document.getElementById('fixed-expenses');
  if (!expenses.length) { el.innerHTML = '<p class="empty">No data</p>'; return; }
  const total = expenses.reduce((sum, e) => sum + e.cost, 0);
  el.innerHTML = `
    <table class="data-table">
      <thead><tr><th>Day</th><th>Expense</th><th style="text-align:right">Cost</th></tr></thead>
      <tbody>
        ${expenses.map(e => `
          <tr>
            <td class="dim">${e.day}</td>
            <td>${e.name}</td>
            <td class="red" style="text-align:right">£${fmt(e.cost)}</td>
          </tr>
        `).join('')}
        <tr style="border-top:1px solid var(--border); font-weight:700">
          <td colspan="2">Total</td>
          <td class="red" style="text-align:right">£${fmt(total)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderVariableExpenses(expenses) {
  const el = document.getElementById('variable-expenses');
  if (!expenses.length) { el.innerHTML = '<p class="empty">No data</p>'; return; }
  const total = expenses.reduce((sum, e) => sum + e.cost, 0);
  el.innerHTML = `
    <table class="data-table">
      <thead><tr><th>Day</th><th>Expense</th><th>Type</th><th style="text-align:right">Cost</th></tr></thead>
      <tbody>
        ${expenses.map(e => `
          <tr>
            <td class="dim">${e.day}</td>
            <td>${e.name}</td>
            <td><span class="type-badge" style="background:${CATEGORY_COLORS[e.type] || '#8b949e'}20; color:${CATEGORY_COLORS[e.type] || '#8b949e'}">${e.type}</span></td>
            <td style="text-align:right">£${fmt(e.cost)}</td>
          </tr>
        `).join('')}
        <tr style="border-top:1px solid var(--border); font-weight:700">
          <td colspan="3">Total</td>
          <td style="text-align:right">£${fmt(total)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderSavings(savings) {
  const accounts = [
    { label: 'Emergency',   key: 'emergency',  icon: '🛡️' },
    { label: 'Matteo',      key: 'matteo',     icon: '👦' },
    { label: 'Lucas',       key: 'lucas',      icon: '👶' },
    { label: 'Trading 212', key: 'trading212', icon: '📈' },
  ];
  const total = Object.values(savings).reduce((sum, v) => sum + v, 0);

  document.getElementById('savings-cards').innerHTML =
    accounts.map(acc => `
      <div class="savings-card">
        <div class="savings-icon">${acc.icon}</div>
        <div class="savings-label">${acc.label}</div>
        <div class="savings-value">£${fmt(savings[acc.key])}</div>
      </div>
    `).join('') + `
    <div class="savings-card savings-total">
      <div class="savings-icon">💰</div>
      <div class="savings-label">Total</div>
      <div class="savings-value">£${fmt(total)}</div>
    </div>
  `;
}
