/* The Hurdle Desk: FINAN IV Unit 11 (the cost of capital, worked in dollars). Config for lib/coursedev/desk-engine.
   Names swept for reuse 2026-11-04 (case_reuse.py): Halfmoon Dumplings, Halfmoon, Imogen Takeda, Imogen, Takeda, all clean.
   Real numbers (Vail Resorts, Chipotle, Damodaran, Treasury) trace to ../sources/FACTS.md. No taxes in this unit (Unit 12). */
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

  // ---------- number helpers ----------
  const r2 = (x) => Math.round(x * 100) / 100;
  // A rate typed as 8.2, 8.2% or 0.082 all mean 8.2 percent.
  function pctv(h, s) { const v = h.parseMoney(s); if (!isFinite(v)) return NaN; return Math.abs(v) < 1 ? v * 100 : v; }
  // Millions typed as 5,740.9 (or in full dollars, 5,740,900,000) both mean 5,740.9 million.
  function mil(h, s) { const v = h.parseMoney(s); if (!isFinite(v)) return NaN; return Math.abs(v) >= 1e5 ? v / 1e6 : v; }
  const tolM = (x) => ({ tol: Math.max(0.05, 0.002 * Math.abs(x)), unreadable: 'Type an amount in millions of dollars, like 412.5.', closeMsg: 'Close. Keep two decimal places and round only at the end.' });
  const tolP = { tol: 0.02, unreadable: 'Type a rate, like 8.25%.', closeMsg: 'Close. Give the rate to two decimal places, like 8.25%, and round only at the end.' };

  function buildTasks(rng, h) {
    const T = [];
    // t1: a food truck, in dollars
    let C, L, rd, re, rel;
    for (let k = 0; k < 50; k++) {
      C = h.between(rng, 70000, 150000, 5000); const s = h.pick(rng, [0.45, 0.55, 0.6, 0.65, 0.7]); L = h.round(C * s, 5000);
      rd = h.pick(rng, [6, 6.5, 7, 7.5, 8]); re = h.pick(rng, [10, 11, 12, 13]);
      if (L > 0.3 * C && L < 0.8 * C && Math.abs(L / C - 0.5) >= 0.05) break; }
    rel = h.pick(rng, ['aunt', 'uncle', 'grandmother', 'cousin']);
    { const dd = L * rd / 100, de = (C - L) * re / 100;
      T.push({ id: 't1', C, L, E: C - L, rd, re, rel, dd, de, tot: dd + de, answer: 100 * (dd + de) / C }); }

    // t2: Halfmoon Dumplings in $ millions, market value of shares
    let D, hrd, Nsh, P, hre, B, E;
    for (let k = 0; k < 80; k++) {
      D = h.between(rng, 40, 120, 5); hrd = h.pick(rng, [5.5, 6, 6.5, 7]);
      Nsh = h.between(rng, 6, 16, 1); P = h.between(rng, 14, 38, 0.5); hre = h.pick(rng, [9.5, 10, 10.5, 11]);
      E = Nsh * P; B = Math.round(E * (0.3 + 0.2 * rng()) * 10) / 10;
      const hm = 100 * (D * hrd / 100 + E * hre / 100) / (D + E), hb = 100 * (D * hrd / 100 + B * hre / 100) / (D + B);
      if (E > 1.2 * D && hm - hb > 0.15 && Math.abs(hm - (hrd + hre) / 2) > 0.1) break; }
    { const dd = D * hrd / 100, de = E * hre / 100;
      T.push({ id: 't2', D, rd: hrd, N: Nsh, P, re: hre, B, E, dd, de, answer: 100 * (dd + de) / (D + E) }); }

    // t3: Vail Resorts, a given real-company row set
    { const E3 = VAIL.N * VAIL.P, dd = VAIL.D * VAIL.rd / 100, de = E3 * VAIL.re / 100;
      T.push(Object.assign({ id: 't3', E: E3, dd, de, answer: 100 * (dd + de) / (VAIL.D + E3) }, VAIL)); }

    // t4: Chipotle, no debt, so its hurdle is its owners' required return
    T.push({ id: 't4', answer: RF + CMG.beta * ERP, decision: 'close' });

    // t5: a riskier project judged at the wrong rate and the right one
    const hc = Math.round(T[1].answer * 10) / 10;            // Halfmoon's hurdle from t2, one decimal
    let ra, I, CF, AFc, AFa;
    for (let k = 0; k < 80; k++) {
      ra = h.pick(rng, [13, 14, 15].filter((x) => x >= hc + 3)); I = h.between(rng, 3000000, 8000000, 250000);
      AFc = Math.round(h.annuityFactor(hc / 100, NY) * 1e4) / 1e4; AFa = Math.round(h.annuityFactor(ra / 100, NY) * 1e4) / 1e4;
      const lo = I / AFc, hi = I / AFa; CF = h.round(lo + (0.3 + 0.4 * rng()) * (hi - lo), 10000);
      if (CF * AFc - I > 0.03 * I && CF * AFa - I < -0.03 * I) break; }
    T.push({ id: 't5', hc, ra, I, CF, AFc, AFa, nC: CF * AFc - I, nA: CF * AFa - I, decision: 'pass' });
    return T;
  }

  const m = (x, dp) => root.DeskEngine.h.money(x, dp);
  const sgn = (x) => (x >= 0 ? '+' : '−') + m(Math.abs(x));
  const mm = (x, dp) => { const d = dp == null ? 1 : dp; return '$' + (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' million'; };
  const pp = (x, dp) => (Math.round(x * Math.pow(10, dp == null ? 2 : dp)) / Math.pow(10, dp == null ? 2 : dp)).toLocaleString('en-US', { maximumFractionDigits: dp == null ? 2 : dp }) + '%';
  const af = (x) => x.toFixed(4);
  const cell = (L, y, label, ph) => `<label class="sr-only" for="r${y}">${label}</label><input id="r${y}" class="rowin" data-row="${y}" inputmode="decimal" autocomplete="off" placeholder="${ph || ''}" value="${(L.rows || [])[y] ? String(L.rows[y]).replace(/"/g, '') : ''}"><span class="mark" id="mk${y}"></span>`;
  const kv = (rows, caption) => `<div class="tw"><table class="cf"><caption>${caption}</caption><tbody>${rows.map((x) => `<tr><td class="lbl">${x[0]}</td><td>${x[1]}</td></tr>`).join('')}</tbody></table></div>`;
  // The hurdle table every task shares: who put money in, how much, the rate they expect, and the dollars a year.
  function hurdleTable(caption, rows, unit) {
    return `<div class="tw"><table class="cf"><caption>${caption}</caption><thead><tr><th scope="col" style="text-align:left">Who put money in</th><th scope="col">Amount</th><th scope="col">Rate</th><th scope="col">Dollars a year${unit ? ' (' + unit + ')' : ''}</th></tr></thead><tbody>${rows.map((r) => `<tr class="${r[4] || ''}"><td class="lbl">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function taskView(t, L, h) {
    if (t.id === 't1') return { title: 'A friend’s food truck', place: `Imogen’s friend from culinary school wants to start a food truck, and asks her what it has to earn.`,
      body: `<p>The truck costs <b>${m(t.C)}</b>. A bank lends <b>${m(t.L)}</b> at <b>${pp(t.rd, 1)}</b> a year, owed in good months and bad. The friend’s ${t.rel} puts in the other <b>${m(t.E)}</b> for part ownership and expects at least <b>${pp(t.re, 0)}</b> a year, or the money goes into an index fund instead.</p>
        <p>Fill in the dollars each one expects a year, the total, and the hurdle rate: the total dollars as a percentage of the ${m(t.C)} cost.</p>`,
      table: hurdleTable('What the food truck must earn', [
        ['The bank', m(t.L), pp(t.rd, 1), cell(L, 1, 'Dollars a year for the bank', '$0')],
        [`The ${t.rel} (owner)`, m(t.E), pp(t.re, 0), cell(L, 2, `Dollars a year for the ${t.rel}`, '$0')],
        ['Total', m(t.C), '', cell(L, 3, 'Total dollars a year', '$0'), 'total'],
        ['<b>Hurdle rate</b> (total ÷ cost)', '', '', cell(L, 4, 'Hurdle rate', '0.00%'), 'hl']]),
      helpLabels: ['Show me the bank’s row', 'Show me every row'] };
    if (t.id === 't2') return { title: 'Halfmoon’s hurdle rate', place: 'Halfmoon began as one food truck. Today it is a restaurant chain whose shares trade on the stock market.',
      body: `<p>The same table works for a company, with more zeros. Halfmoon’s lenders hold its bonds and its owners hold its shares. Work in millions of dollars.</p>
        ${kv([['Bonds Halfmoon owes its lenders', mm(t.D, 0)], ['Interest rate on the bonds', pp(t.rd, 1)], ['Shares owners hold', t.N + ' million'], ['Share price today', m(t.P, 2)], ['Owners’ equity on the balance sheet', mm(t.B)], ['Return Halfmoon’s owners expect (Unit 10)', pp(t.re, 1)]], 'Halfmoon Dumplings, today')}
        <p>First work out what the owners’ stake is worth today. Then fill in the dollars a year and the hurdle rate. Type amounts in millions, so type 412.5 for $412.5 million.</p>`,
      table: `<div class="tw"><table class="cf"><caption>What Halfmoon must earn (in millions of dollars)</caption><tbody>
        <tr><td class="lbl">Owners’ stake at today’s price (shares × price)</td><td>${cell(L, 1, 'Owners stake at today’s price, in millions', '0.0')}</td></tr>
        <tr><td class="lbl">Dollars a year for lenders (bonds × ${pp(t.rd, 1)})</td><td>${cell(L, 2, 'Dollars a year for lenders, in millions', '0.00')}</td></tr>
        <tr><td class="lbl">Dollars a year for owners (owners’ stake × ${pp(t.re, 1)})</td><td>${cell(L, 3, 'Dollars a year for owners, in millions', '0.00')}</td></tr>
        <tr class="hl"><td class="lbl"><b>Hurdle rate</b> (total dollars a year ÷ (bonds + owners’ stake))</td><td>${cell(L, 4, 'Hurdle rate', '0.00%')}</td></tr></tbody></table></div>`,
      helpLabels: ['Show me the owners’ stake', 'Show me every row'] };
    if (t.id === 't3') return { title: 'Vail Resorts, a real company', place: 'Vail Resorts runs ski areas such as Vail, Whistler and Park City, and sells the Epic Pass.',
      body: `<p>Imogen wants to see the same table on a real company. These numbers come from Vail’s 10-K for the year to July 31, 2026, and from the stock market on November 4, 2026.</p>
        ${kv([['Debt Vail owes its lenders', mm(t.D, 0)], ['Interest rate (Vail’s interest cost last year was $205.6 million)', pp(t.rd, 1)], ['Shares owners hold', t.N + ' million'], ['Share price, November 4, 2026', m(t.P, 2)], [`Return Vail’s owners expect: ${RF}% + ${t.beta} × ${ERP}% (Unit 10)`, pp(t.re, 2)]], 'Vail Resorts')}
        <p>Fill in the table the same way as Halfmoon’s, in millions of dollars.</p>`,
      table: `<div class="tw"><table class="cf"><caption>What Vail Resorts must earn (in millions of dollars)</caption><tbody>
        <tr><td class="lbl">Owners’ stake at today’s price (shares × price)</td><td>${cell(L, 1, 'Owners stake at today’s price, in millions', '0.0')}</td></tr>
        <tr><td class="lbl">Dollars a year for lenders (debt × ${pp(t.rd, 1)})</td><td>${cell(L, 2, 'Dollars a year for lenders, in millions', '0.00')}</td></tr>
        <tr><td class="lbl">Dollars a year for owners (owners’ stake × ${pp(t.re, 2)})</td><td>${cell(L, 3, 'Dollars a year for owners, in millions', '0.00')}</td></tr>
        <tr class="hl"><td class="lbl"><b>Hurdle rate</b> (total dollars a year ÷ (debt + owners’ stake))</td><td>${cell(L, 4, 'Hurdle rate', '0.00%')}</td></tr></tbody></table></div>`,
      helpLabels: ['Show me the owners’ stake', 'Show me every row'] };
    if (t.id === 't4') return { title: 'Chipotle’s hurdle rate', place: 'In Unit 5 you valued a new Chipotle restaurant at a 9% rate. Was that rate padded?',
      body: `<p>Chipotle has no bank loans and no bonds, so its table has a single row: the owners. Its hurdle rate is just the return its owners expect.</p>
        ${kv([['10-year Treasury rate, November 4, 2026', RF + '%'], ['Chipotle’s beta', String(CMG.beta)], ['Market premium (Damodaran, January 2026)', ERP + '%'], ['Average hurdle rate of 64 restaurant companies (Damodaran, January 2026)', CMG.damo + '%']], 'Chipotle’s inputs')}
        <p>Use Unit 10’s formula: Treasury rate + beta × market premium. Then decide whether the 9% from Unit 5 was padding.</p>`,
      value: { label: 'Return Chipotle’s owners expect, which is its hurdle rate', placeholder: '0.00%', help: 'Give the rate to two decimal places, like 8.25%.' },
      choice: { legend: 'Was the 9% in Unit 5 padding?', options: [['close', 'No. Chipotle’s owners expect about 9%, so 9% was a fair rate'], ['pad', 'Yes. Chipotle’s hurdle rate is far below 9%'], ['industry', 'Yes. 9% is above the 7.2% restaurant average, so it was padded']] } };
    if (t.id === 't5') return { title: 'When the company’s rate is the wrong rate', place: 'Halfmoon is thinking about a delivery-only app, which is a very different business from its restaurants.',
      body: `<p>Halfmoon’s hurdle rate is <b>${pp(t.hc, 1)}</b>, from the Halfmoon step. That rate fits new restaurants. A delivery app competes with tech companies, and companies whose whole business is a delivery app have hurdle rates of about <b>${pp(t.ra, 0)}</b>.</p>
        ${kv([['Cost of building the app, paid today', m(t.I)], ['Cash the app brings in each year', m(t.CF)], ['Life of the app', NY + ' years'], [`Annuity factor (${pp(t.hc, 1)}, ${NY} years)`, af(t.AFc)], [`Annuity factor (${pp(t.ra, 0)}, ${NY} years)`, af(t.AFa)]], 'The delivery app')}
        <p>Work out the app’s NPV at each rate (cash each year × annuity factor − cost). Then decide.</p>`,
      table: `<div class="tw"><table class="cf"><caption>The app’s NPV at two rates</caption><tbody>
        <tr><td class="lbl">NPV at Halfmoon’s ${pp(t.hc, 1)}</td><td>${cell(L, 1, 'NPV at Halfmoon’s rate', '$0')}</td></tr>
        <tr class="hl"><td class="lbl">NPV at the delivery-app rate, ${pp(t.ra, 0)}</td><td>${cell(L, 2, 'NPV at the delivery app rate', '$0')}</td></tr></tbody></table></div>`,
      choice: { legend: 'Should Halfmoon build the app?', options: [['build', 'Build it. It clears Halfmoon’s hurdle rate'], ['pass', 'Pass. It does not earn what a business this risky must earn']] },
      helpLabels: ['Show me the first NPV', 'Show me both NPVs'] };
  }

  function judgeTask(t, e, h) {
    const rows = e.rows || []; const rr = [];
    const firstBad = (names) => { const b = Object.keys(names).map(Number).find((y) => !rr[y].ok); return b ? { ok: false, rowRes: rr, msg: `${names[b]}: ${rr[b].msg}` } : null; };
    if (t.id === 't1') {
      rr[1] = h.judgeNumber(h.parseMoney(rows[1]), t.dd, [[t.L * t.re / 100, 'rate', `The bank charges ${pp(t.rd, 1)}, not ${pp(t.re, 0)}.`], [t.C * t.rd / 100, 'whole', `Use only the ${m(t.L)} the bank lent, not the whole cost.`], [t.L * t.rd, 'pct', `Turn ${pp(t.rd, 1)} into ${t.rd / 100} before multiplying.`]],
        { otherMsg: `${m(t.L)} × ${pp(t.rd, 1)}.` });
      rr[2] = h.judgeNumber(h.parseMoney(rows[2]), t.de, [[t.E * t.rd / 100, 'rate', `The ${t.rel} expects ${pp(t.re, 0)}, not the bank’s rate.`], [t.C * t.re / 100, 'whole', `Use only the ${m(t.E)} the ${t.rel} put in.`], [t.E * t.re, 'pct', `Turn ${pp(t.re, 0)} into ${t.re / 100} before multiplying.`]],
        { otherMsg: `${m(t.E)} × ${pp(t.re, 0)}.` });
      rr[3] = h.judgeNumber(h.parseMoney(rows[3]), t.tot, [], { otherMsg: 'Add the bank’s dollars and the part owner’s dollars.' });
      rr[4] = h.judgeNumber(pctv(h, rows[4]), t.answer, [[(t.rd + t.re) / 2, 'avg', `That is the plain average of the two rates. The bank put in ${m(t.L)} and the ${t.rel} ${m(t.E)}, so work it in dollars: total dollars ÷ ${m(t.C)}.`],
        [100 * (t.L * t.re + t.E * t.rd) / 100 / t.C, 'swap', 'That puts each rate on the other person’s money. Check which amount goes with which rate.'], [t.re, 'own', `That is what the ${t.rel} expects alone. The truck has to pay the bank too.`], [t.rd, 'bank', 'That is the bank’s rate alone. The part owner expects more.'],
        [t.tot, 'dollars', `That is the dollar total. Divide it by the ${m(t.C)} cost to get a rate.`], [100 * t.tot / t.L, 'base', `Divide by the whole cost of the truck, ${m(t.C)}, not by the loan.`]],
        Object.assign({}, tolP, { otherMsg: `Total dollars a year ÷ ${m(t.C)}, as a percentage.` }));
      return firstBad({ 1: 'The bank', 2: `The ${t.rel}`, 3: 'Total', 4: 'Hurdle rate' }) || { ok: true, rowRes: rr };
    }
    if (t.id === 't2' || t.id === 't3') {
      const real = t.id === 't3'; const debtWord = real ? 'debt' : 'bonds';
      const diag1 = [[t.P, 'price', 'That is the price of one share. Multiply it by the number of shares.']];
      if (!real) diag1.unshift([t.B, 'book', 'That is the balance sheet number. Owners could sell their shares today for shares × price, so use that.']);
      if (real) diag1.push([t.book, 'book', 'That is the balance sheet number. Use shares × today’s price.']);
      rr[1] = h.judgeNumber(mil(h, rows[1]), t.E, diag1, Object.assign(tolM(t.E), { otherMsg: `${t.N} million shares × ${m(t.P, 2)}.` }));
      rr[2] = h.judgeNumber(mil(h, rows[2]), t.dd, [[t.D * t.re / 100, 'rate', `Lenders get the interest rate, ${pp(t.rd, 1)}.`], [t.D * t.rd, 'pct', `Turn ${pp(t.rd, 1)} into ${t.rd / 100} before multiplying.`]],
        Object.assign(tolM(t.dd), { otherMsg: `${mm(t.D, 0)} × ${pp(t.rd, 1)}.` }));
      const d3 = [[t.E * t.rd / 100, 'rate', `Owners expect ${pp(t.re, 2)}, not the interest rate.`], [t.E * t.re, 'pct', `Turn ${pp(t.re, 2)} into ${t.re / 100} before multiplying.`]];
      if (!real) d3.unshift([t.B * t.re / 100, 'book', 'That uses the balance sheet number. Use the owners’ stake at today’s price from row 1.']);
      rr[3] = h.judgeNumber(mil(h, rows[3]), t.de, d3, Object.assign(tolM(t.de), { otherMsg: `Row 1 × ${pp(t.re, 2)}.` }));
      const d4 = [[(t.rd + t.re) / 2, 'avg', 'That is the plain average of the two rates. The owners put in more money, so work it in dollars: (row 2 + row 3) ÷ (' + debtWord + ' + row 1).'],
        [t.re, 'own', 'That is what owners expect alone. Lenders put in money too, at a lower rate.'], [t.dd + t.de, 'dollars', 'That is the dollar total in millions. Divide it by all the money put in to get a rate.'],
        [100 * (t.dd + t.de) / t.E, 'base', `Divide by all the money put in: ${debtWord} + owners’ stake.`]];
      if (!real) d4.unshift([100 * (t.dd + t.B * t.re / 100) / (t.D + t.B), 'book', 'That uses the balance sheet number for the owners. Use the owners’ stake at today’s price.']);
      rr[4] = h.judgeNumber(pctv(h, rows[4]), t.answer, d4, Object.assign({}, tolP, { otherMsg: `(row 2 + row 3) ÷ (${mm(t.D, 0)} + row 1), as a percentage.` }));
      return firstBad({ 1: 'Owners’ stake', 2: 'Lenders', 3: 'Owners', 4: 'Hurdle rate' }) || { ok: true, rowRes: rr };
    }
    if (t.id === 't4') {
      const n = h.judgeNumber(pctv(h, e.value), t.answer, [[RF + ERP, 'nobeta', `If you rounded ${pp(t.answer)} to 9.1%, give two decimal places. If you added ${RF}% and ${ERP}%, multiply the premium by Chipotle’s beta first.`],
        [RF + CMG.beta, 'addbeta', `Multiply the beta by the premium: ${CMG.beta} × ${ERP}%. Then add the ${RF}% Treasury rate.`], [CMG.beta * ERP, 'norf', `Add the ${RF}% Treasury rate as well.`], [(RF + ERP) * CMG.beta, 'order', `Multiply only the premium by beta, then add the Treasury rate: ${RF}% + ${CMG.beta} × ${ERP}%.`]],
        Object.assign({}, tolP, { otherMsg: `${RF}% + ${CMG.beta} × ${ERP}%.` }));
      if (!n.ok) return n;
      if (e.choice !== t.decision) return { ok: false, code: 'decision', msg: !e.choice ? 'Say whether the 9% was padding as well.' : (e.choice === 'industry' ? 'The 7.2% is an average for restaurants that also borrow, and lenders accept less than owners. Chipotle borrows nothing, so compare 9% with what Chipotle’s own owners expect.' : `Compare 9% with the rate you just found, ${pp(t.answer)}.`) };
      return { ok: true };
    }
    if (t.id === 't5') {
      const und = t.CF * NY - t.I;
      rr[1] = h.judgeNumber(h.parseMoney(rows[1]), t.nC, [[t.CF * t.AFc, 'nocost', `Subtract the ${m(t.I)} cost.`], [und, 'nodisc', `Multiply by the annuity factor, ${af(t.AFc)}, not by ${NY}.`], [t.nA, 'swap', `That uses the ${pp(t.ra, 0)} factor. This row uses Halfmoon’s ${pp(t.hc, 1)}.`]],
        { scale: t.I, otherMsg: `${m(t.CF)} × ${af(t.AFc)} − ${m(t.I)}.` });
      rr[2] = h.judgeNumber(h.parseMoney(rows[2]), t.nA, [[t.CF * t.AFa, 'nocost', `Subtract the ${m(t.I)} cost.`], [und, 'nodisc', `Multiply by the annuity factor, ${af(t.AFa)}, not by ${NY}.`], [t.nC, 'swap', `That uses Halfmoon’s ${pp(t.hc, 1)} factor. This row uses ${pp(t.ra, 0)}.`]],
        { scale: t.I, otherMsg: `${m(t.CF)} × ${af(t.AFa)} − ${m(t.I)}.` });
      const bad = firstBad({ 1: `NPV at ${pp(t.hc, 1)}`, 2: `NPV at ${pp(t.ra, 0)}` }); if (bad) return bad;
      if (e.choice !== t.decision) return { ok: false, rowRes: rr, msg: !e.choice ? 'Say whether Halfmoon should build the app as well.' : 'Halfmoon’s rate fits restaurants. Judge the app at the rate for a business as risky as a delivery app, where its NPV is below zero.' };
      return { ok: true, rowRes: rr };
    }
  }

  function helpText(t, lvl) {
    if (t.id === 't1') return lvl === 1 ? `The bank: ${m(t.L)} × ${pp(t.rd, 1)} = ${m(t.dd)} a year.`
      : `The bank: ${m(t.L)} × ${pp(t.rd, 1)} = ${m(t.dd)}. The ${t.rel}: ${m(t.E)} × ${pp(t.re, 0)} = ${m(t.de)}. Total: ${m(t.tot)}. Hurdle rate: ${m(t.tot)} ÷ ${m(t.C)} = ${pp(t.answer)}.`;
    if (t.id === 't2' || t.id === 't3') { const w = t.id === 't3' ? 'debt' : 'bonds';
      return lvl === 1 ? `Owners’ stake: ${t.N} million × ${m(t.P, 2)} = ${mm(t.E)}.`
        : `Owners’ stake: ${mm(t.E)}. Lenders: ${mm(t.D, 0)} × ${pp(t.rd, 1)} = ${mm(t.dd, 2)}. Owners: ${mm(t.E)} × ${pp(t.re, 2)} = ${mm(t.de, 2)}. Hurdle rate: ${mm(t.dd + t.de, 2)} ÷ (${mm(t.D, 0)} of ${w} + ${mm(t.E)}) = ${pp(t.answer)}.`; }
    if (t.id === 't5') return lvl === 1 ? `At ${pp(t.hc, 1)}: ${m(t.CF)} × ${af(t.AFc)} − ${m(t.I)} = ${sgn(t.nC)}.`
      : `At ${pp(t.hc, 1)}: ${sgn(t.nC)}. At ${pp(t.ra, 0)}: ${m(t.CF)} × ${af(t.AFa)} − ${m(t.I)} = ${sgn(t.nA)}. At the rate that fits a delivery app, the NPV is below zero, so pass.`;
    return '';
  }
  function praise(t) {
    if (t.id === 't1') return `The truck must earn ${m(t.tot)} a year on ${m(t.C)}, a hurdle rate of ${pp(t.answer)}. If it earns less, the ${t.rel} would have done better in an index fund.`;
    if (t.id === 't2') return `Halfmoon must earn ${pp(t.answer)} on its money. Using the balance sheet number for the owners would have given ${pp(100 * (t.dd + t.B * t.re / 100) / (t.D + t.B))}, which understates what the owners could earn elsewhere.`;
    if (t.id === 't3') return `Vail must earn about ${pp(t.answer, 1)} a year. Its balance sheet shows owners’ equity of only ${mm(t.book)}, but the market values their shares at ${mm(t.E)}, and that is the money they could take elsewhere.`;
    if (t.id === 't4') return `Chipotle’s owners expect about ${pp(t.answer)}, so the 9% in Unit 5 was a fair rate, not padding. The 7.2% restaurant average is lower because most restaurants borrow part of their money, and lenders accept less than owners.`;
    if (t.id === 't5') return `At Halfmoon’s rate the app looks like a winner (${sgn(t.nC)}), but at the rate that fits its risk it loses ${m(-t.nA)} of value. Using the company’s rate for a riskier project makes bad projects look good.`;
  }
  const s2 = (x) => String(Math.round(x * 100) / 100);
  function selfAnswer(t) {
    if (t.id === 't1') return { rows: [null, String(Math.round(t.dd)), String(Math.round(t.de)), String(Math.round(t.tot)), t.answer.toFixed(2)] };
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
        const rows = [['The bank', '$50,000', '8%', '$4,000', ''], ['Her brother (owner)', '$30,000', '12%', '$3,600', ''], ['Total', '$80,000', '', '$7,600', 'total'], ['<b>Hurdle rate</b> ($7,600 ÷ $80,000)', '', '', '<b>9.5%</b>', 'hl']];
        const show = stage === 0 ? rows.slice(0, 1) : stage === 1 ? rows.slice(0, 2) : rows;
        return hurdleTable('What the first truck had to earn', show.map((r, i) => i === show.length - 1 ? [r[0], r[1], r[2], r[3], (r[4] + ' reveal').trim()] : r));
      }
      if (stage === 3) {
        const rows = [['A good year: the truck earns $9,200', '$4,000', '$5,200', '17.3%'], ['A bad year: the truck earns $6,000', '$4,000', '$2,000', '6.7%']];
        return `<div class="tw"><table class="cf"><caption>Who gets paid, and what the brother earns on his $30,000</caption><thead><tr><th scope="col" style="text-align:left">Year</th><th scope="col">The bank gets</th><th scope="col">Her brother gets</th><th scope="col">His return</th></tr></thead><tbody>${rows.map((r) => `<tr><td class="lbl">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="${r[3] === '6.7%' ? 'neg' : ''}">${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
      }
      const rows = [['What lenders charge', '8%', 'cost of debt'], ['What owners expect', '12%', 'cost of equity'], ['The hurdle rate for the whole business', '9.5%', 'weighted average cost of capital (WACC)']];
      return `<div class="tw"><table class="cf"><caption>The names finance teams use</caption><thead><tr><th scope="col" style="text-align:left">Plain words</th><th scope="col">The truck</th><th scope="col" style="text-align:left">Finance name</th></tr></thead><tbody>${rows.map((r, i) => `<tr class="${i === 2 ? 'hl' : ''}"><td class="lbl">${r[0]}</td><td>${r[1]}</td><td class="lbl">${r[2]}</td></tr>`).join('')}</tbody></table></div>`;
    },
    stages: [
      { t: 'The bank', p: 'The bank lent $50,000 at 8%, so it is owed $50,000 × 8% = $4,000 a year, in good months and bad, like a car loan or a student loan.' },
      { t: 'The part owner', p: 'Her brother owns part of the truck. He is paid from whatever is left after the bank, so he takes more risk than the bank and expects more: $30,000 × 12% = $3,600 a year.' },
      { t: 'The hurdle rate', p: 'Together the bank and her brother expect $7,600 a year on the $80,000 they put in. That is 9.5%, the truck’s <b>hurdle rate</b>: the return it has to earn to pay everyone who funded it what they could have earned elsewhere. It sits between 8% and 12%, closer to 8% because the bank put in more.' },
      { t: 'Clear the hurdle, or not', p: 'In a year when the truck earns $9,200, the bank gets its $4,000 and her brother gets $5,200, more than the 12% he wanted. In a year when it earns $6,000, the bank still gets $4,000 and her brother gets only $2,000, or 6.7%. Below the hurdle rate, he would have done better elsewhere.' },
      { t: 'The names', p: 'Finance teams call what lenders charge the <b>cost of debt</b>, what owners expect the <b>cost of equity</b>, and the hurdle rate for the whole business the <b>weighted average cost of capital</b>, or WACC. In Unit 5 this was the discount rate.' },
    ],
  };

  root.DESK = {
    app: 'finan4-u11-hurdle-desk', version: 1, seedVersion: 1, salt: 'rize-finan4-u11-hurdle:3c81d4', points: 20,
    storageKey: 'rize-finan4-u11-hurdle-v1', filePrefix: 'HurdleDesk',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-hurdle-desk/verify.html',
    calcPlaceholder: '(50000*0.08+30000*0.12)/80000',
    calcHint: 'Type or tap. Use * to multiply and / to divide, so (50000*0.08+30000*0.12)/80000 gives 0.095, the worked example’s 9.5% hurdle rate.',
    story: { title: 'The Hurdle Desk', kicker: 'Corporate Finance, Unit 11', company: 'Halfmoon Dumplings', team: 'Finance Team',
      from: 'Imogen Takeda', fromTitle: 'head of finance, Halfmoon Dumplings',
      dek: 'You have joined the finance team at Halfmoon Dumplings, a restaurant chain that began as one food truck. Imogen Takeda, the head of finance, wants you to work out the return a new project has to beat, first for a food truck and then for real companies.',
      whatBox: '<b>Every project is paid for with someone’s money.</b> Lenders charge interest and owners expect a return. A project has to earn enough to pay both, or the people who funded it would have done better elsewhere. That return is the hurdle rate.',
      stepsLine: 'There are eleven steps: a worked example, five problems with three one-question checks between them, one exam-style question, and a short note to Imogen.' },
    steps: STEPS, quiz: QUIZ, walk: WALK, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong,
    note: { title: 'A note for the board', label: 'Your note to Imogen', minWords: 30, receiptHeading: 'Note to the head of finance',
      prompt: 'Imogen presents to the board next week. Give Halfmoon’s hurdle rate and say what it means for a new restaurant. Say which rate the delivery app should be judged at, and why. Name one input in the hurdle rate you would double-check before the meeting.' },
  };
})(typeof window !== 'undefined' ? window : globalThis);
