/* The Hurdle Desk: FINAN IV Unit 11 (the cost of capital, worked in dollars). Config for lib/coursedev/desk-engine.
   Names swept for reuse 2026-11-04 (case_reuse.py): Halfmoon Dumplings, Halfmoon, Imogen Takeda, Imogen, Takeda, all clean.
   Real numbers (Vail Resorts, Chipotle, Damodaran, Treasury) trace to ../sources/FACTS.md. No taxes in this unit (Unit 12).
   Rework 2026-11-05 (Samuel's Unit 10 review, design/course-principles.md; standards rules 17 to 23):
   - Round seeds. The food truck costs $100,000 to $250,000 with the bank's share in tenths and whole-number rates, so every
     dollar figure is whole and the hurdle rate has one decimal. Halfmoon's shares and price are round, its debt is 20%, 25%,
     30% or 40% of the money put in, and the rates are whole numbers. The delivery app's cost is a round million.
   - A 2 to 4 line worked `example` on every task, with numbers that differ from the task, the reading and the exam-style question.
   - `parts` on Chipotle (rate, then the padding question) and on the delivery app (the NPV table, then the decision).
   - Citations moved to `sources`; every formula names its cells; feedback quotes the student's own numbers.
   - No step here lacks a right answer, so none uses `autosave` (the note keeps the engine's own save button).
   seedVersion and version moved to 2, so saved progress and receipts from v1 do not carry over. */
(function (root) {
  'use strict';
  const RF = 4.9, ERP = 4.2;                       // 10-year Treasury 2026-11-04; Damodaran implied premium, January 2026
  const VAIL = { D: 3184, rd: 6.5, N: 35.64, P: 161.08, beta: 0.75, book: 240.5 };
  VAIL.re = Math.round((RF + VAIL.beta * ERP) * 100) / 100;                 // 8.05
  const CMG = { beta: 0.99, unit5: 9, damo: 7.2 };
  const QUIZ = [
    { title: 'Quick win: who expects more',
      q: 'Imogen’s brother expects 12% a year on his share of the food truck, but the bank charges only 8%. Why does he expect more than the bank?',
      options: ['He is paid only after the bank, so in a bad year he could get nothing', 'He put in less money than the bank did', 'Family members always charge more than banks', 'The bank’s 8% is paid out of his share'],
      answer: 0,
      why: ['Right. The bank is owed its interest in good months and bad. Her brother owns part of the truck and is paid from whatever is left after the bank, so he takes more risk and expects more for it.',
        'The amount he put in does not set his rate. He expects more because he is paid last, after the bank, and could get nothing in a bad year.',
        'Who the person is does not matter. What matters is the position: an owner is paid after the lender, so an owner takes more risk.',
        'The bank’s interest is a cost of the truck, paid before the owners get anything. Her brother expects more because he is paid last.'] },
    { title: 'Quick win: what the owners’ stake is worth',
      q: 'A company’s balance sheet says its owners’ equity is $30 million. Its shares are worth $120 million at today’s stock price. Which number belongs in the owners’ row of the hurdle table?',
      options: ['$120 million, what the shares are worth today', '$30 million, the balance sheet number', '$75 million, the average of the two', 'Neither. Use the number of shares'],
      answer: 0,
      why: ['Right. The owners could sell their shares today for $120 million and invest that money somewhere else. That is the money they leave in the company, so it is the amount they expect a return on.',
        'The balance sheet number is mostly what owners paid in years ago plus profits kept since then. The owners could sell today for $120 million, so that is the money they leave in the company.',
        'Averaging two different measures gives a number nobody could sell for. Use what the shares are worth today.',
        'A share count is not an amount of money. Multiply the shares by today’s price to get what the owners’ stake is worth.'] },
    { title: 'Quick win: the loan is not the rate',
      q: 'Halfmoon will pay for one new restaurant entirely with a new bank loan at 6%. Its hurdle rate is 9%, and the new restaurant is as risky as the ones it already runs. Which rate should Imogen use to judge it?',
      options: ['9%, Halfmoon’s hurdle rate', '6%, because the loan pays for it', '7.5%, the average of 6% and 9%', '0%, because no owner money is used'],
      answer: 0,
      why: ['Right. The rate depends on how risky the project is, not on which source of money pays for this one restaurant. Lenders agree to lend at 6% only because the owners’ money stands behind the loan, so the owners still carry the risk.',
        'The loan is cheap because the owners’ stake stands behind it. Borrowing for this restaurant uses up borrowing Halfmoon could have used elsewhere, so judge the restaurant at the 9% hurdle rate.',
        'There is no reason to average the two. A restaurant as risky as Halfmoon’s others should be judged at Halfmoon’s hurdle rate, 9%.',
        'The owners still carry the risk, because they are paid only after the bank. Judge the restaurant at the 9% hurdle rate.'] },
    { title: 'Exam-style question',
      q: 'A company owes its lenders $40 million at 6% a year. Its shares are worth $60 million at today’s price, and its owners expect 11% a year. What hurdle rate should it use for a new project as risky as its current business?',
      options: ['9.0%', '8.5%', '8.0%', '11.0%'],
      answer: 0,
      why: ['Right. Lenders expect $40 million × 6% = $2.4 million a year and owners expect $60 million × 11% = $6.6 million. That is $9.0 million on $100 million, a 9.0% hurdle rate. Questions on the exams look like this one.',
        '8.5% is the plain average of 6% and 11%. The owners put in more money, so their 11% counts for more. Work it in dollars: ($2.4 million + $6.6 million) ÷ $100 million = 9.0%.',
        '8.0% swaps the amounts, putting $60 million at 6% and $40 million at 11%. The lenders put in $40 million and the owners $60 million.',
        '11.0% is what the owners alone expect. The lenders put in $40 million at a lower rate, so the hurdle rate for the whole company is lower: 9.0%.'] },
  ];

  const STEPS = [
    { id: 'walk', label: 'Worked example', kind: 'walk' },
    { id: 'q1', label: 'Check 1', kind: 'check', quiz: 0 },
    { id: 't1', label: 'A food truck', kind: 'task' },
    { id: 't2', label: 'Halfmoon', kind: 'task' },
    { id: 'q2', label: 'Check 2', kind: 'check', quiz: 1 },
    { id: 't3', label: 'Vail Resorts', kind: 'task' },
    { id: 't4', label: 'Chipotle', kind: 'task' },
    { id: 'q3', label: 'Check 3', kind: 'check', quiz: 2 },
    { id: 't5', label: 'A riskier project', kind: 'task' },
    { id: 'q4', label: 'Exam-style question', kind: 'check', quiz: 3 },
    { id: 'note', label: 'Your note', kind: 'note' },
  ];
  const NY = 8;   // life of the delivery app in years (t5)

  // Round seed sets (the tests read these).
  const ROUND = {
    C: [100000, 120000, 150000, 200000, 250000], s: [0.3, 0.4, 0.6, 0.7], rd1: [5, 6, 7, 8], re1: [10, 11, 12, 13],
    N: [5, 6, 8, 10, 12, 15, 20], P: [10, 12, 15, 20, 25, 30, 40], ratio: [[1, 4], [1, 3], [3, 7], [2, 3]], rd2: [5, 6, 7], re2: [10, 11, 12],
    ra: [13, 14, 15, 16], I: [3000000, 4000000, 5000000, 6000000, 8000000],
  };

  // ---------- number helpers ----------
  // A rate typed as 8.2, 8.2% or 0.082 all mean 8.2 percent.
  function pctv(h, s) { const v = h.parseMoney(s); if (!isFinite(v)) return NaN; return Math.abs(v) < 1 ? v * 100 : v; }
  // Millions typed as 5,740.9 (or in full dollars, 5,740,900,000) both mean 5,740.9 million.
  function mil(h, s) { const v = h.parseMoney(s); if (!isFinite(v)) return NaN; return Math.abs(v) >= 1e5 ? v / 1e6 : v; }
  const tolM = (x) => ({ tol: Math.max(0.05, 0.002 * Math.abs(x)), unreadable: 'Type an amount in millions of dollars, like 412.5.', closeMsg: 'Close. Keep the decimals and round only at the end.' });
  const tolP = { tol: 0.02, unreadable: 'Type a rate, like 8.25%.', closeMsg: 'Close. Keep the decimals and round only at the end.' };
  const shuffle = (rng, a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  function buildTasks(rng, h) {
    const T = [];
    // t1: a food truck, in whole dollars. Never the reading's truck ($100,000; $60,000 at 7%; owner 10%).
    let C, s, rd, re;
    for (let k = 0; k < 50; k++) {
      C = h.pick(rng, ROUND.C); s = h.pick(rng, ROUND.s); rd = h.pick(rng, ROUND.rd1); re = h.pick(rng, ROUND.re1);
      if (!(C === 100000 && s === 0.6 && rd === 7 && re === 10)) break; }
    const rel = h.pick(rng, ['aunt', 'uncle', 'grandmother', 'cousin']);
    { const L = Math.round(C * s), E = C - L, dd = L * rd / 100, de = E * re / 100;
      T.push({ id: 't1', C, L, E, rd, re, rel, dd, de, tot: dd + de, answer: Math.round(1000 * (dd + de) / C) / 10 }); }

    // t2: Halfmoon Dumplings in $ millions. Round shares and price; debt is a round share of the money put in.
    let D = 75, hrd = 6, Nsh = 10, P = 30, hre = 11, E = 300, B = 120;          // a valid fallback
    for (let k = 0; k < 200; k++) {
      const n = h.pick(rng, ROUND.N), p = h.pick(rng, ROUND.P), e = n * p; if (e < 150 || e > 600) continue;
      const [a, b] = h.pick(rng, ROUND.ratio); if (e % b) continue; const d = e * a / b; if (d % 5) continue;
      const r1 = h.pick(rng, ROUND.rd2), r2 = h.pick(rng, ROUND.re2); const bk = h.round(e * (0.3 + 0.2 * rng()), 5);
      const hm = (d * r1 + e * r2) / (d + e), hb = (d * r1 + bk * r2) / (d + bk);
      if (hm - hb > 0.15 && Math.abs(hm - (r1 + r2) / 2) > 0.1 && Math.abs(hb - (r1 + r2) / 2) > 0.05) { D = d; hrd = r1; Nsh = n; P = p; hre = r2; E = e; B = bk; break; } }
    { const dd = D * hrd / 100, de = E * hre / 100;
      T.push({ id: 't2', D, rd: hrd, N: Nsh, P, re: hre, B, E, dd, de, answer: Math.round(1e4 * (dd + de) / (D + E)) / 100 }); }

    // t3: Vail Resorts, a given real-company row set
    { const E3 = VAIL.N * VAIL.P, dd = VAIL.D * VAIL.rd / 100, de = E3 * VAIL.re / 100;
      T.push(Object.assign({ id: 't3', E: E3, dd, de, answer: 100 * (dd + de) / (VAIL.D + E3) }, VAIL)); }

    // t4: Chipotle, no debt, so its hurdle is its owners' required return
    T.push({ id: 't4', answer: RF + CMG.beta * ERP, decision: 'close' });

    // t5: a riskier project judged at the wrong rate and the right one. Cost a round million; yearly cash a multiple of $50,000
    // where one fits (else $25,000, else $10,000), so the NPV is clearly positive at Halfmoon's rate and clearly negative at the app's.
    const hc = Math.round(T[1].answer * 10) / 10;            // Halfmoon's hurdle from t2, one decimal
    const ra = h.pick(rng, ROUND.ra.filter((x) => x >= hc + 3));
    const AFc = Math.round(h.annuityFactor(hc / 100, NY) * 1e4) / 1e4, AFa = Math.round(h.annuityFactor(ra / 100, NY) * 1e4) / 1e4;
    let I = 5000000, CF = null;
    for (const step of [50000, 25000, 10000]) {
      for (const i of shuffle(rng, ROUND.I)) {
        const lo = Math.floor(1.03 * i / AFc / step) + 1, hi = Math.ceil(0.97 * i / AFa / step) - 1; const ok = [];
        // skip a cash figure whose two NPVs are near mirror images, or a dropped minus sign would read as the swapped-rate mistake
        for (let k = lo; k <= hi; k++) { const cf = step * k; if (Math.abs(cf * AFc + cf * AFa - 2 * i) > 0.02 * i) ok.push(cf); }
        if (ok.length) { I = i; CF = h.pick(rng, ok); break; } }
      if (CF) break; }
    T.push({ id: 't5', hc, ra, I, CF, AFc, AFa, nC: CF * AFc - I, nA: CF * AFa - I, decision: 'pass' });
    return T;
  }

  const m = (x, dp) => root.DeskEngine.h.money(x, dp);
  const sgn = (x) => (x >= 0 ? '+' : '−') + m(Math.abs(x));
  // $ millions with up to dp decimals (trailing zeros dropped)
  const mn = (x, dp) => { const d = dp == null ? 2 : dp; return '$' + (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toLocaleString('en-US', { maximumFractionDigits: d }) + ' million'; };
  const pp = (x, dp) => (Math.round(x * Math.pow(10, dp == null ? 2 : dp)) / Math.pow(10, dp == null ? 2 : dp)).toLocaleString('en-US', { maximumFractionDigits: dp == null ? 2 : dp }) + '%';
  const price = (x) => m(x, x % 1 ? 2 : 0);
  const af = (x) => x.toFixed(4);
  const cell = (L, y, label, ph) => `<label class="sr-only" for="r${y}">${label}</label><input id="r${y}" class="rowin" data-row="${y}" inputmode="decimal" autocomplete="off" placeholder="${ph || ''}" value="${(L.rows || [])[y] ? String(L.rows[y]).replace(/"/g, '') : ''}"><span class="mark" id="mk${y}"></span>`;
  const kv = (rows, caption) => `<div class="tw"><table class="cf"><caption>${caption}</caption><tbody>${rows.map((x) => `<tr><td class="lbl">${x[0]}</td><td>${x[1]}</td></tr>`).join('')}</tbody></table></div>`;
  // The hurdle table every task shares: who put money in, how much, the rate they expect, and the dollars a year.
  function hurdleTable(caption, rows, unit) {
    return `<div class="tw"><table class="cf"><caption>${caption}</caption><thead><tr><th scope="col" style="text-align:left">Who put money in</th><th scope="col">Amount</th><th scope="col">Rate</th><th scope="col">Dollars a year${unit ? ' (' + unit + ')' : ''}</th></tr></thead><tbody>${rows.map((r) => `<tr class="${r[4] || ''}"><td class="lbl">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
  }
  // t2 and t3 share a layout: the owners' stake, then the dollars a year, then the hurdle rate.
  const stakeOf = (t) => (t.id === 't3' ? mn(t.E, 1) : mn(t.E));
  const debtWord = (t) => (t.id === 't3' ? 'debt' : 'bonds');
  function companyTable(t, L, name) {
    const w = debtWord(t);
    return `<div class="tw"><table class="cf"><caption>What ${name} must earn (in millions of dollars)</caption><tbody>
        <tr><td class="lbl">Owners’ stake at today’s price (shares × price)</td><td>${cell(L, 1, 'Owners stake at today’s price, in millions', '0.0')}</td></tr>
        <tr><td class="lbl">Lenders’ dollars a year (${w} × ${pp(t.rd, 1)})</td><td>${cell(L, 2, 'Lenders’ dollars a year, in millions', '0.00')}</td></tr>
        <tr><td class="lbl">Owners’ dollars a year (owners’ stake × ${pp(t.re, 2)})</td><td>${cell(L, 3, 'Owners’ dollars a year, in millions', '0.00')}</td></tr>
        <tr class="hl"><td class="lbl"><b>Hurdle rate</b> ((lenders’ dollars + owners’ dollars) ÷ (${w} + owners’ stake))</td><td>${cell(L, 4, 'Hurdle rate', '0.00%')}</td></tr></tbody></table></div>`;
  }

  function taskView(t, L, h) {
    if (t.id === 't1') return { title: 'A friend’s food truck', place: `Imogen’s friend from culinary school wants to start a food truck, and asks her what it has to earn.`,
      body: `<p>The truck costs <b>${m(t.C)}</b>. A bank lends <b>${m(t.L)}</b> at <b>${pp(t.rd, 1)}</b> a year, owed in good months and bad. The friend’s ${t.rel} puts in the other <b>${m(t.E)}</b> for part ownership and expects at least <b>${pp(t.re, 0)}</b> a year, or the money goes into an index fund instead.</p>`,
      example: `<p>A $50,000 coffee cart. A bank lends $30,000 at 5%: $30,000 × 5% = $1,500 a year.</p>
        <p>A part owner puts in $20,000 and expects 10%: $20,000 × 10% = $2,000 a year.</p>
        <p>Hurdle rate = ($1,500 + $2,000) ÷ $50,000 = $3,500 ÷ $50,000 = 7%.</p>`,
      table: hurdleTable('What the food truck must earn', [
        ['The bank', m(t.L), pp(t.rd, 1), cell(L, 1, 'Dollars a year for the bank', '$0')],
        [`The ${t.rel} (owner)`, m(t.E), pp(t.re, 0), cell(L, 2, `Dollars a year for the ${t.rel}`, '$0')],
        ['Total (bank’s dollars + ' + t.rel + '’s dollars)', m(t.C), '', cell(L, 3, 'Total dollars a year', '$0'), 'total'],
        [`<b>Hurdle rate</b> (total dollars ÷ ${m(t.C)} cost)`, '', '', cell(L, 4, 'Hurdle rate', '0.0%'), 'hl']])
        + '<p class="small">Type the hurdle rate as a percentage, like 8.5%.</p>',
      helpLabels: ['Show me the bank’s row', 'Show me every row'] };
    if (t.id === 't2') return { title: 'Halfmoon’s hurdle rate', place: 'Halfmoon began as one food truck. Today it is a restaurant chain whose shares trade on the stock market.',
      body: `<p>The same table works for a company, with more zeros. Halfmoon’s lenders hold its bonds and its owners hold its shares.</p>
        ${kv([['Bonds Halfmoon owes its lenders', mn(t.D)], ['Interest rate on the bonds', pp(t.rd, 1)], ['Shares owners hold', t.N + ' million'], ['Share price today', price(t.P)], ['Owners’ equity on the balance sheet', mn(t.B)], ['Return Halfmoon’s owners expect (Unit 10)', pp(t.re, 1)]], 'Halfmoon Dumplings, today')}
        <p>Fill in the table in millions of dollars, so type 412.5 for $412.5 million.</p>`,
      example: `<p>A chain owes $200 million of bonds at 4%: $200 million × 4% = $8 million a year.</p>
        <p>Its owners hold 10 million shares at $30, a stake of $300 million. They expect 12%: $300 million × 12% = $36 million a year.</p>
        <p>Hurdle rate = ($8 million + $36 million) ÷ ($200 million + $300 million) = $44 million ÷ $500 million = 8.8%.</p>`,
      table: companyTable(t, L, 'Halfmoon'),
      helpLabels: ['Show me the owners’ stake', 'Show me every row'] };
    if (t.id === 't3') return { title: 'Vail Resorts, a real company', place: 'Vail Resorts runs ski areas such as Vail, Whistler and Park City, and sells the Epic Pass.',
      body: `<p>Imogen wants to see the same table on a real company.</p>
        ${kv([['Debt Vail owes its lenders', mn(t.D)], ['Interest rate on the debt', pp(t.rd, 1)], ['Shares owners hold', t.N + ' million'], ['Share price, November 4, 2026', price(t.P)], [`Return Vail’s owners expect (Treasury rate + β × market premium = ${RF}% + ${t.beta} × ${ERP}%)`, pp(t.re, 2)]], 'Vail Resorts')}
        <p>Fill in the table the same way as Halfmoon’s, in millions of dollars.</p>`,
      example: `<p>A resort company owes $1,000 million at 5%: $1,000 million × 5% = $50 million a year.</p>
        <p>Its owners hold 30 million shares at $100, a stake of $3,000 million. They expect 9%: $3,000 million × 9% = $270 million a year.</p>
        <p>Hurdle rate = ($50 million + $270 million) ÷ ($1,000 million + $3,000 million) = $320 million ÷ $4,000 million = 8%.</p>`,
      table: companyTable(t, L, 'Vail Resorts'),
      sources: '<p>Debt, interest and shares: Vail Resorts 10-K for the year to July 31, 2026. Debt was $3,184 million; interest cost for the year was $205.6 million, and $205.6 million ÷ $3,184 million is about 6.5%. Shares outstanding: 35,635,298. Share price and β: Yahoo Finance, close and “Beta (5Y Monthly),” November 4, 2026. Treasury rate: US Treasury 10-year par yield, November 4, 2026. Market premium: Aswath Damodaran (NYU), implied premium at the start of 2026 (4.23%).</p>',
      helpLabels: ['Show me the owners’ stake', 'Show me every row'] };
    if (t.id === 't4') return { title: 'Chipotle’s hurdle rate', place: 'In Unit 5 you valued a new Chipotle restaurant at a 9% rate. Was that rate padded?',
      body: '<p>Chipotle has no bank loans and no bonds, so its table has a single row: the owners. Its hurdle rate is the return its owners expect.</p>',
      example: `<p>A company with no debt: Treasury rate 3%, β = 0.8, market premium 5%.</p>
        <p>β × market premium = 0.8 × 5% = 4%.</p>
        <p>Owners expect 3% + 4% = 7%, so its hurdle rate is 7%.</p>`,
      parts: [
        { html: `${kv([['10-year Treasury rate', RF + '%'], ['Chipotle’s β', String(CMG.beta)], ['Market premium', ERP + '%']], 'Chipotle’s inputs')}`, field: 'value' },
        { html: `<p>Unit 5 used 9%. The average hurdle rate of 64 restaurant companies is about ${CMG.damo}%.</p>`, field: 'choice' }],
      value: { label: '1. What return do Chipotle’s owners expect (Treasury rate + β × market premium)? That is its hurdle rate.', placeholder: '0.00%', help: 'Give the rate to two decimal places, like 8.25%.' },
      choice: { legend: '2. Was the 9% in Unit 5 padding?', options: [['close', 'No. Chipotle’s owners expect about 9%, so 9% was a fair rate'], ['pad', 'Yes. Chipotle’s hurdle rate is far below 9%'], ['industry', `Yes. 9% is above the ${CMG.damo}% restaurant average, so it was padded`]] },
      sources: `<p>No debt: Chipotle 10-Q for the quarter to September 30, 2026; its $500 million bank credit line was unused. β: Yahoo Finance, “Beta (5Y Monthly),” November 4, 2026. Treasury rate: US Treasury 10-year par yield, November 4, 2026. Market premium: Aswath Damodaran (NYU), implied premium at the start of 2026. Restaurant average: Damodaran, cost of capital by industry, January 2026 (7.16% for 64 restaurant companies).</p>` };
    if (t.id === 't5') return { title: 'When the company’s rate is the wrong rate', place: 'Halfmoon is thinking about a delivery-only app, which is a very different business from its restaurants.',
      body: `<p>Halfmoon’s hurdle rate is <b>${pp(t.hc, 1)}</b>, from the Halfmoon step. That rate fits new restaurants. A delivery app competes with tech companies, and companies whose whole business is a delivery app have hurdle rates of about <b>${pp(t.ra, 0)}</b>.</p>`,
      example: `<p>A project costs $1,000,000 today and brings in $200,000 a year for 8 years.</p>
        <p>At 10%, the 8-year annuity factor is 5.3349.</p>
        <p>NPV = $200,000 × 5.3349 − $1,000,000 = $66,980.</p>`,
      parts: [
        { html: `${kv([['Cost of building the app, paid today', m(t.I)], ['Cash the app brings in each year', m(t.CF)], ['Life of the app', NY + ' years'], [`Annuity factor at ${pp(t.hc, 1)}, ${NY} years`, af(t.AFc)], [`Annuity factor at ${pp(t.ra, 0)}, ${NY} years`, af(t.AFa)]], 'The delivery app')}`, field: 'table' },
        { html: '', field: 'choice' }],
      table: `<div class="tw"><table class="cf"><caption>The app’s NPV at two rates</caption><tbody>
        <tr><td class="lbl">NPV at Halfmoon’s ${pp(t.hc, 1)} (cash each year × annuity factor at ${pp(t.hc, 1)} − cost)</td><td>${cell(L, 1, 'NPV at Halfmoon’s rate', '$0')}</td></tr>
        <tr class="hl"><td class="lbl">NPV at the delivery-app rate, ${pp(t.ra, 0)} (cash each year × annuity factor at ${pp(t.ra, 0)} − cost)</td><td>${cell(L, 2, 'NPV at the delivery app rate', '$0')}</td></tr></tbody></table></div>
        <p class="small">Start a negative NPV with a minus sign.</p>`,
      choice: { legend: 'Should Halfmoon build the app?', options: [['build', 'Build it. It clears Halfmoon’s hurdle rate'], ['pass', 'Pass. It does not earn what a business this risky must earn']] },
      helpLabels: ['Show me the first NPV', 'Show me both NPVs'] };
  }

  function judgeTask(t, e, h) {
    const rows = e.rows || []; const rr = [];
    const firstBad = (names) => { const b = Object.keys(names).map(Number).find((y) => !rr[y].ok); return b ? { ok: false, rowRes: rr, msg: `${names[b]}: ${rr[b].msg}` } : null; };
    if (t.id === 't1') {
      const own = `the ${t.rel}`, way = `${m(t.tot)} ÷ ${m(t.C)}`;
      rr[1] = h.judgeNumber(h.parseMoney(rows[1]), t.dd, [[t.L * t.re / 100, 'rate', `The bank charges ${pp(t.rd, 1)}, not ${pp(t.re, 0)}: ${m(t.L)} × ${pp(t.rd, 1)}.`],
        [t.C * t.rd / 100, 'whole', `Use only the ${m(t.L)} the bank lent, not the whole ${m(t.C)}: ${m(t.L)} × ${pp(t.rd, 1)}.`], [t.L * t.rd, 'pct', `Turn ${pp(t.rd, 1)} into ${t.rd / 100} before multiplying: ${m(t.L)} × ${t.rd / 100}.`]],
        { otherMsg: `${m(t.L)} × ${pp(t.rd, 1)}.` });
      rr[2] = h.judgeNumber(h.parseMoney(rows[2]), t.de, [[t.E * t.rd / 100, 'rate', `The ${t.rel} expects ${pp(t.re, 0)}, not the bank’s ${pp(t.rd, 1)}: ${m(t.E)} × ${pp(t.re, 0)}.`],
        [t.C * t.re / 100, 'whole', `Use only the ${m(t.E)} the ${t.rel} put in, not the whole ${m(t.C)}: ${m(t.E)} × ${pp(t.re, 0)}.`], [t.E * t.re, 'pct', `Turn ${pp(t.re, 0)} into ${t.re / 100} before multiplying: ${m(t.E)} × ${t.re / 100}.`]],
        { otherMsg: `${m(t.E)} × ${pp(t.re, 0)}.` });
      rr[3] = h.judgeNumber(h.parseMoney(rows[3]), t.tot, [[t.dd, 'onlybank', `That is the bank’s dollars alone. Add the ${t.rel}’s: ${m(t.dd)} + ${m(t.de)}.`], [t.de, 'onlyown', `That is the ${t.rel}’s dollars alone. Add the bank’s: ${m(t.dd)} + ${m(t.de)}.`], [t.C, 'cost', `That is the cost of the truck. Add the dollars a year: ${m(t.dd)} + ${m(t.de)}.`]],
        { otherMsg: `Add the bank’s dollars and the ${t.rel}’s dollars: ${m(t.dd)} + ${m(t.de)}.` });
      rr[4] = h.judgeNumber(pctv(h, rows[4]), t.answer, [[(t.rd + t.re) / 2, 'avg', `That is the plain average of ${pp(t.rd, 1)} and ${pp(t.re, 0)}. The bank put in ${m(t.L)} and the ${t.rel} ${m(t.E)}, so work it in dollars: ${way}.`],
        [(t.L * t.re + t.E * t.rd) / t.C, 'swap', `That puts each rate on the other person’s money. The bank’s ${m(t.L)} goes with ${pp(t.rd, 1)}, and the ${t.rel}’s ${m(t.E)} with ${pp(t.re, 0)}.`],
        [t.re, 'own', `That is what ${own} expects alone. The truck has to pay the bank too: ${way}.`], [t.rd, 'bank', `That is the bank’s rate alone. The truck has to pay ${own} too: ${way}.`],
        [t.tot, 'dollars', `${m(t.tot)} is the dollar total. Divide it by the ${m(t.C)} cost to get a rate: ${way}.`], [100 * t.tot / t.L, 'base', `That divides by the bank’s ${m(t.L)}. Divide by the whole cost of the truck: ${way}.`],
        [100 * t.tot / t.E, 'baseE', `That divides by the ${t.rel}’s ${m(t.E)}. Divide by the whole cost of the truck: ${way}.`]],
        Object.assign({}, tolP, { otherMsg: `Total dollars a year ÷ cost of the truck: ${way}, as a percentage.` }));
      return firstBad({ 1: 'The bank', 2: `The ${t.rel}`, 3: 'Total', 4: 'Hurdle rate' }) || { ok: true, rowRes: rr };
    }
    if (t.id === 't2' || t.id === 't3') {
      const w = debtWord(t), st = stakeOf(t);
      const diag1 = [[t.P, 'price', `That is the price of one share. Multiply it by the number of shares: ${t.N} million × ${price(t.P)}.`],
        [t.id === 't3' ? t.book : t.B, 'book', `That is the balance sheet number. Owners could sell their shares today for shares × price: ${t.N} million × ${price(t.P)}.`],
        [t.N, 'shares', `That is the number of shares. Multiply it by the price: ${t.N} million × ${price(t.P)}.`]];
      if (t.id === 't3') diag1[1][2] = `That is the balance sheet number. Use shares × today’s price: ${t.N} million × ${price(t.P)}.`;
      rr[1] = h.judgeNumber(mil(h, rows[1]), t.E, diag1, Object.assign(tolM(t.E), { otherMsg: `Shares × price: ${t.N} million × ${price(t.P)}.` }));
      rr[2] = h.judgeNumber(mil(h, rows[2]), t.dd, [[t.D * t.re / 100, 'rate', `Lenders get the interest rate, ${pp(t.rd, 1)}: ${mn(t.D)} × ${pp(t.rd, 1)}.`], [t.D * t.rd, 'pct', `Turn ${pp(t.rd, 1)} into ${t.rd / 100} before multiplying: ${mn(t.D)} × ${t.rd / 100}.`],
        [t.E * t.rd / 100, 'stake', `That uses the owners’ stake. Lenders’ dollars come from the ${w}: ${mn(t.D)} × ${pp(t.rd, 1)}.`]],
        Object.assign(tolM(t.dd), { otherMsg: `${w[0].toUpperCase() + w.slice(1)} × interest rate: ${mn(t.D)} × ${pp(t.rd, 1)}.` }));
      const bk = t.id === 't3' ? t.book : t.B;
      rr[3] = h.judgeNumber(mil(h, rows[3]), t.de, [[bk * t.re / 100, 'book', `That uses the balance sheet number. Use the owners’ stake at today’s price: ${st} × ${pp(t.re, 2)}.`],
        [t.E * t.rd / 100, 'rate', `Owners expect ${pp(t.re, 2)}, not the interest rate: ${st} × ${pp(t.re, 2)}.`], [t.E * t.re, 'pct', `Turn ${pp(t.re, 2)} into ${t.re / 100} before multiplying: ${st} × ${t.re / 100}.`],
        [t.D * t.re / 100, 'debt', `That uses the ${w}. Owners’ dollars come from the owners’ stake: ${st} × ${pp(t.re, 2)}.`]],
        Object.assign(tolM(t.de), { otherMsg: `Owners’ stake × the return owners expect: ${st} × ${pp(t.re, 2)}.` }));
      const way = `(${mn(t.dd)} + ${mn(t.de)}) ÷ (${mn(t.D)} + ${st})`;
      const d4 = [[100 * (t.dd + bk * t.re / 100) / (t.D + bk), 'book', `That uses the balance sheet number for the owners. Use the owners’ stake at today’s price: ${way}.`],
        [(t.rd + t.re) / 2, 'avg', `That is the plain average of ${pp(t.rd, 1)} and ${pp(t.re, 2)}. The owners put in more money, so work it in dollars: ${way}.`],
        [t.re, 'own', `That is what owners expect alone. Lenders put in money too, at a lower rate: ${way}.`],
        [t.dd + t.de, 'dollars', `That is the dollar total in millions. Divide it by all the money put in: ${way}.`],
        [100 * (t.dd + t.de) / t.E, 'base', `That divides by the owners’ stake alone. Divide by all the money put in, ${w} + owners’ stake: ${way}.`],
        [100 * (t.dd + t.de) / t.D, 'baseD', `That divides by the ${w} alone. Divide by all the money put in, ${w} + owners’ stake: ${way}.`]];
      rr[4] = h.judgeNumber(pctv(h, rows[4]), t.answer, d4, Object.assign({}, tolP, { otherMsg: `(lenders’ dollars + owners’ dollars) ÷ (${w} + owners’ stake) = ${way}, as a percentage.` }));
      return firstBad({ 1: 'Owners’ stake', 2: 'Lenders’ dollars', 3: 'Owners’ dollars', 4: 'Hurdle rate' }) || { ok: true, rowRes: rr };
    }
    if (t.id === 't4') {
      const n = h.judgeNumber(pctv(h, e.value), t.answer, [[RF + ERP, 'nobeta', `If you rounded ${pp(t.answer)} to 9.1%, give two decimal places. If you added ${RF}% and ${ERP}%, multiply the premium by β first: ${RF}% + ${CMG.beta} × ${ERP}%.`],
        [RF + CMG.beta, 'addbeta', `Multiply β by the premium: ${CMG.beta} × ${ERP}%. Then add the ${RF}% Treasury rate.`], [CMG.beta * ERP, 'norf', `That is β × market premium alone. Add the ${RF}% Treasury rate: ${RF}% + ${CMG.beta} × ${ERP}%.`],
        [(RF + ERP) * CMG.beta, 'order', `Multiply only the premium by β, then add the Treasury rate: ${RF}% + ${CMG.beta} × ${ERP}%.`], [RF * CMG.beta + ERP, 'swap', `Multiply the premium by β, not the Treasury rate: ${RF}% + ${CMG.beta} × ${ERP}%.`]],
        Object.assign({}, tolP, { otherMsg: `Treasury rate + β × market premium = ${RF}% + ${CMG.beta} × ${ERP}%.` }));
      if (!n.ok) return Object.assign({}, n, { msg: 'Question 1: ' + n.msg });
      if (e.choice !== t.decision) return { ok: false, code: 'decision', msg: !e.choice ? 'Now answer question 2: was the 9% padding?' : (e.choice === 'industry' ? `The ${CMG.damo}% is an average for restaurants that also borrow, and lenders accept less than owners. Chipotle borrows nothing, so compare 9% with what its own owners expect, ${pp(t.answer)}.` : `Compare 9% with the rate you just found, ${pp(t.answer)}. They are almost the same.`) };
      return { ok: true };
    }
    if (t.id === 't5') {
      const und = t.CF * NY - t.I;
      rr[1] = h.judgeNumber(h.parseMoney(rows[1]), t.nC, [[t.CF * t.AFc, 'nocost', `That is the value of the cash coming in. Subtract the ${m(t.I)} cost: ${m(t.CF)} × ${af(t.AFc)} − ${m(t.I)}.`], [und, 'nodisc', `Multiply by the annuity factor, ${af(t.AFc)}, not by ${NY}: ${m(t.CF)} × ${af(t.AFc)} − ${m(t.I)}.`], [t.nA, 'swap', `That uses the ${pp(t.ra, 0)} factor. This row uses Halfmoon’s ${pp(t.hc, 1)}: ${m(t.CF)} × ${af(t.AFc)} − ${m(t.I)}.`]],
        { scale: t.I, otherMsg: `${m(t.CF)} × ${af(t.AFc)} − ${m(t.I)}.` });
      rr[2] = h.judgeNumber(h.parseMoney(rows[2]), t.nA, [[t.CF * t.AFa, 'nocost', `That is the value of the cash coming in. Subtract the ${m(t.I)} cost: ${m(t.CF)} × ${af(t.AFa)} − ${m(t.I)}.`], [und, 'nodisc', `Multiply by the annuity factor, ${af(t.AFa)}, not by ${NY}: ${m(t.CF)} × ${af(t.AFa)} − ${m(t.I)}.`], [t.nC, 'swap', `That uses Halfmoon’s ${pp(t.hc, 1)} factor. This row uses ${pp(t.ra, 0)}: ${m(t.CF)} × ${af(t.AFa)} − ${m(t.I)}.`]],
        { scale: t.I, signMsg: `The size is right, but the app loses value at ${pp(t.ra, 0)}: ${m(t.CF)} × ${af(t.AFa)} is less than ${m(t.I)}, so start with a minus sign.`, otherMsg: `${m(t.CF)} × ${af(t.AFa)} − ${m(t.I)}.` });
      const bad = firstBad({ 1: `NPV at ${pp(t.hc, 1)}`, 2: `NPV at ${pp(t.ra, 0)}` }); if (bad) return bad;
      if (e.choice !== t.decision) return { ok: false, rowRes: rr, msg: !e.choice ? 'Now say whether Halfmoon should build the app.' : `Halfmoon’s ${pp(t.hc, 1)} fits restaurants. A business as risky as a delivery app must earn ${pp(t.ra, 0)}, and at that rate the app’s NPV is ${sgn(t.nA)}.` };
      return { ok: true, rowRes: rr };
    }
  }

  function helpText(t, lvl) {
    if (t.id === 't1') return lvl === 1 ? `The bank: ${m(t.L)} × ${pp(t.rd, 1)} = ${m(t.dd)} a year.`
      : `The bank: ${m(t.L)} × ${pp(t.rd, 1)} = ${m(t.dd)}. The ${t.rel}: ${m(t.E)} × ${pp(t.re, 0)} = ${m(t.de)}. Total: ${m(t.dd)} + ${m(t.de)} = ${m(t.tot)}. Hurdle rate: ${m(t.tot)} ÷ ${m(t.C)} = ${pp(t.answer, 1)}.`;
    if (t.id === 't2' || t.id === 't3') { const w = debtWord(t), st = stakeOf(t);
      return lvl === 1 ? `Owners’ stake: ${t.N} million × ${price(t.P)} = ${st}.`
        : `Owners’ stake: ${st}. Lenders’ dollars: ${mn(t.D)} × ${pp(t.rd, 1)} = ${mn(t.dd)}. Owners’ dollars: ${st} × ${pp(t.re, 2)} = ${mn(t.de)}. Hurdle rate: (${mn(t.dd)} + ${mn(t.de)}) ÷ (${mn(t.D)} of ${w} + ${st}) = ${pp(t.answer)}.`; }
    if (t.id === 't4') return lvl === 1 ? `β × market premium = ${CMG.beta} × ${ERP}% = ${pp(CMG.beta * ERP, 3)}. In the calculator: <code>${RF}+${CMG.beta}*${ERP}</code>.`
      : `Treasury rate + β × market premium = ${RF}% + ${pp(CMG.beta * ERP, 3)} = ${pp(t.answer)}. That is almost exactly 9%, so the 9% in Unit 5 was a fair rate.`;
    if (t.id === 't5') return lvl === 1 ? `At ${pp(t.hc, 1)}: ${m(t.CF)} × ${af(t.AFc)} − ${m(t.I)} = ${sgn(t.nC)}.`
      : `At ${pp(t.hc, 1)}: ${sgn(t.nC)}. At ${pp(t.ra, 0)}: ${m(t.CF)} × ${af(t.AFa)} − ${m(t.I)} = ${sgn(t.nA)}. At the rate that fits a delivery app, the NPV is below zero, so pass.`;
    return '';
  }
  function praise(t) {
    if (t.id === 't1') return `The truck must earn ${m(t.tot)} a year on ${m(t.C)}, a hurdle rate of ${pp(t.answer, 1)}. If it earns less, the ${t.rel} would have done better in an index fund.`;
    if (t.id === 't2') return `Halfmoon must earn ${pp(t.answer)} on its money. Using the balance sheet number for the owners would have given ${pp(100 * (t.dd + t.B * t.re / 100) / (t.D + t.B))}, which understates what the owners could earn elsewhere.`;
    if (t.id === 't3') return `Vail must earn about ${pp(t.answer, 1)} a year. Its balance sheet shows owners’ equity of only ${mn(t.book, 1)}, but the market values their shares at ${mn(t.E, 1)}, and that is the money they could take elsewhere.`;
    if (t.id === 't4') return `Chipotle’s owners expect about ${pp(t.answer)}, so the 9% in Unit 5 was a fair rate, not padding. The ${CMG.damo}% restaurant average is lower because most restaurants borrow part of their money, and lenders accept less than owners.`;
    if (t.id === 't5') return `At Halfmoon’s rate the app looks like a winner (${sgn(t.nC)}), but at the rate that fits its risk it loses ${m(-t.nA)} of value. Using the company’s rate for a riskier project makes bad projects look good.`;
  }
  const s2 = (x) => String(Math.round(x * 100) / 100);
  function selfAnswer(t) {
    if (t.id === 't1') return { rows: [null, String(Math.round(t.dd)), String(Math.round(t.de)), String(Math.round(t.tot)), t.answer.toFixed(1)] };
    if (t.id === 't2' || t.id === 't3') return { rows: [null, String(Math.round(t.E * 10) / 10), s2(t.dd), s2(t.de), t.answer.toFixed(2) + '%'] };
    if (t.id === 't4') return { value: t.answer.toFixed(2), choice: 'close' };
    if (t.id === 't5') return { rows: [null, String(Math.round(t.nC)), String(Math.round(t.nA))], choice: 'pass' };
  }
  function selfWrong(t) {
    if (t.id === 't1') return { rows: [null, String(Math.round(t.dd)), String(Math.round(t.de)), String(Math.round(t.tot)), ((t.rd + t.re) / 2).toFixed(2)] };
    if (t.id === 't2') return { rows: [null, String(t.B), s2(t.dd), s2(t.B * t.re / 100), (100 * (t.dd + t.B * t.re / 100) / (t.D + t.B)).toFixed(2)] };
    if (t.id === 't3') return { rows: [null, String(Math.round(t.E * 10) / 10), s2(t.dd), s2(t.de), ((t.rd + t.re) / 2).toFixed(2)] };
    if (t.id === 't4') return { value: t.answer.toFixed(2), choice: 'industry' };
    if (t.id === 't5') return { rows: [null, String(Math.round(t.nC)), String(Math.round(t.nA))], choice: 'build' };
  }

  const WALK = {
    title: 'How Imogen’s first food truck set its hurdle rate',
    intro: '<p>Halfmoon began as one food truck. It cost <b>$80,000</b>. A bank lent <b>$50,000</b> at <b>8%</b> a year, and Imogen’s brother put in the other <b>$30,000</b> for part ownership. He expected <b>12%</b> a year, or he would have put the money somewhere else.</p>',
    render(stage) {
      if (stage <= 2) {
        const rows = [['The bank', '$50,000', '8%', '$4,000', ''], ['Her brother (owner)', '$30,000', '12%', '$3,600', ''], ['Total ($4,000 + $3,600)', '$80,000', '', '$7,600', 'total'], ['<b>Hurdle rate</b> ($7,600 ÷ $80,000)', '', '', '<b>9.5%</b>', 'hl']];
        const show = stage === 0 ? rows.slice(0, 1) : stage === 1 ? rows.slice(0, 2) : rows;
        return hurdleTable('What the first truck had to earn', show.map((r, i) => i === show.length - 1 ? [r[0], r[1], r[2], r[3], (r[4] + ' reveal').trim()] : r));
      }
      if (stage === 3) {
        const rows = [['A good year: the truck earns $10,000', '$4,000', '$6,000', '20%'], ['A bad year: the truck earns $5,500', '$4,000', '$1,500', '5%']];
        return `<div class="tw"><table class="cf"><caption>Who gets paid, and what the brother earns on his $30,000</caption><thead><tr><th scope="col" style="text-align:left">Year</th><th scope="col">The bank gets</th><th scope="col">Her brother gets</th><th scope="col">His return</th></tr></thead><tbody>${rows.map((r) => `<tr><td class="lbl">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="${r[3] === '5%' ? 'neg' : ''}">${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
      }
      const rows = [['What lenders charge', '8%', 'cost of debt'], ['What owners expect', '12%', 'cost of equity'], ['The hurdle rate for the whole business', '9.5%', 'weighted average cost of capital (WACC)']];
      return `<div class="tw"><table class="cf"><caption>The names finance teams use</caption><thead><tr><th scope="col" style="text-align:left">Plain words</th><th scope="col">The truck</th><th scope="col" style="text-align:left">Finance name</th></tr></thead><tbody>${rows.map((r, i) => `<tr class="${i === 2 ? 'hl' : ''}"><td class="lbl">${r[0]}</td><td>${r[1]}</td><td class="lbl">${r[2]}</td></tr>`).join('')}</tbody></table></div>`;
    },
    stages: [
      { t: 'The bank', p: 'The bank is owed $50,000 × 8% = $4,000 a year, in good months and bad, like a car loan.' },
      { t: 'The part owner', p: 'Her brother is paid from what is left after the bank, so he takes more risk and expects more: $30,000 × 12% = $3,600 a year.' },
      { t: 'The hurdle rate', p: 'Together they expect $4,000 + $3,600 = $7,600 a year on $80,000. $7,600 ÷ $80,000 = 9.5%, the truck’s <b>hurdle rate</b>: the return it must earn to pay everyone who funded it. It sits closer to 8% than to 12% because the bank put in more money.' },
      { t: 'Clear the hurdle, or not', p: 'When the truck earns $10,000, the bank gets $4,000 and her brother $6,000, or 20% on his $30,000. When it earns $5,500, the bank still gets $4,000 and her brother only $1,500, or 5%. Below the hurdle rate, he would have done better elsewhere.' },
      { t: 'The names', p: 'Finance teams call what lenders charge the <b>cost of debt</b>, what owners expect the <b>cost of equity</b>, and the hurdle rate for the whole business the <b>weighted average cost of capital</b>, or WACC. In Unit 5 this was the discount rate.' },
    ],
  };

  root.DESK = {
    app: 'finan4-u11-hurdle-desk', version: 2, seedVersion: 2, salt: 'rize-finan4-u11-hurdle:3c81d4', points: 20,
    storageKey: 'rize-finan4-u11-hurdle-v1', filePrefix: 'HurdleDesk', practiceStart: 't1',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-hurdle-desk/verify.html',
    calcPlaceholder: '(50000*0.08+30000*0.12)/80000',
    calcHint: 'Type or tap. Use * to multiply and / to divide, so (50000*0.08+30000*0.12)/80000 gives 0.095, a 9.5% hurdle rate.',
    story: { title: 'The Hurdle Desk', kicker: 'Corporate Finance, Unit 11', company: 'Halfmoon Dumplings', team: 'Finance Team',
      from: 'Imogen Takeda', fromTitle: 'head of finance, Halfmoon Dumplings',
      dek: 'You have joined the finance team at Halfmoon Dumplings, a restaurant chain that began as one food truck. Imogen Takeda, the head of finance, wants you to work out the return a new project has to beat, first for a food truck and then for real companies.',
      whatBox: '<b>Every project is paid for with someone’s money.</b> Lenders charge interest and owners expect a return. A project has to earn enough to pay both, or the people who funded it would have done better elsewhere. That return is the hurdle rate.',
      stepsLine: 'There are eleven steps: a worked example, five problems with three one-question checks between them, one exam-style question, and a short note to Imogen.' },
    steps: STEPS, quiz: QUIZ, walk: WALK, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong, ROUND,
    note: { title: 'A note for the board', label: 'Your note to Imogen', minWords: 30, receiptHeading: 'Note to the head of finance',
      prompt: 'Imogen presents to the board next week. Give Halfmoon’s hurdle rate and say what it means for a new restaurant. Say which rate the delivery app should be judged at, and why. Name one input in the hurdle rate you would double-check before the meeting.' },
  };
})(typeof window !== 'undefined' ? window : globalThis);
