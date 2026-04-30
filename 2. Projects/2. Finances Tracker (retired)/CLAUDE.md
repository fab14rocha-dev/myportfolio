# Finances Tracker

## What It Is
A personal finances dashboard that reads Fabricio's Excel spreadsheet (Expenses 2026.xlsx) and displays the data as a clean, visual webpage — accessible from phone or PC. For personal use only.

## The Problem It Solves
The spreadsheet is functional but not pleasant to look at. This turns the same data into something visually appealing and easy to read at a glance.

## How It Works
- User uploads their Excel file via a button on the page
- SheetJS (free, runs in the browser) parses the file — no server needed
- App reads the data and renders it visually
- Standalone — no login, no database

## Spreadsheet Structure (Expenses 2026.xlsx)
- **Monthly sheets** (Jan-26, Feb-26, Mar-26...): core data — fixed expenses, variable expenses, income, savings
- **Summary sheet**: year-level totals — income, expenses, balance, savings per month
- **Pay dates**: which bills are charged on which day of the month
- **Next house**: house purchase planning (equity, deposit, mortgage calc)
- **expenses**: scenario comparison (current vs two houses)
- **list**: expense category dropdown values

### Income sources (per month)
- Fabricio Rocha, Martina Sanna, Child Benefits, Others

### Expense categories (variable)
- Groceries, Leisure / Days out, Others (Not essential), Others (Essential), Holidays, Clothing, Savings, Overpayment

### Fixed expenses (monthly, tracked by day)
- Mortgage, Council Tax, Aviva, Electricity + Gas, Ageas, Water, Phones, etc.
- Total fixed: ~£2,144.92/month

### Savings accounts tracked
- Emergency, Matteo, Lucas, Trading 212

## Key Views to Build
1. **Monthly summary** — income vs expenses vs savings for selected month
2. **Spending by category** — visual breakdown (bar or donut chart)
3. **Year overview** — all months at a glance (Summary sheet)
4. **Savings balances** — current totals per account
5. **Fixed expenses** — bills calendar / list by day of month

## Stack
- Vanilla JS, HTML, CSS
- SheetJS (CDN, free) — for reading the Excel file in the browser

## Roadmap
- **Phase 1** — Upload Excel file, app reads and displays it visually
- **Phase 2** — Add data entry directly in the app (income, expenses, savings) so the spreadsheet becomes optional
- **Phase 3** — App is fully self-contained, spreadsheet no longer needed
- The core data structure (months, categories, fixed expenses, savings accounts) stays the same across all phases — Phase 2 just adds input forms on top, nothing gets rebuilt

## Rules
- Free tools only
- No login, no server, no database — fully standalone
- Must work well on mobile (phone) and desktop
