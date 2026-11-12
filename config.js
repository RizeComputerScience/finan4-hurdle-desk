/* The Hurdle Desk: FINAN IV Unit 11 (the cost of capital). Config for lib/coursedev/desk-engine.
   Names swept for reuse (case_reuse.py --course "FINAN IV"): Halfmoon Dumplings, Imogen Takeda (2026-11-04) and Saltbox Grill
   (2026-11-12), all clean.
   Version 3 (2026-11-12), rebuilt to the Unit 9 pattern (process/standards/interactive-assignments.md rules 25 to 39;
   u11/TEACHING-MAP.md; design/scope-2026-11-11.md):
   - The reading teaches; the desk has no walkthrough of its own (rule 32).
   - Two calculations, each as a faded step then the student's own: the hurdle rate in dollars (food trucks) and a company's
     hurdle rate with the owners' stake at today's share price (Saltbox Grill, then Halfmoon). Every task states the problem
     first, then shows a worked example drawn as the SAME table the student fills (h.ladder), with different numbers.
   - Cut from the desk: the walkthrough, the riskier-project task (delivery app), the "the loan is not the rate" check, the
     "who expects more" check, Vail Resorts and Chipotle (the reading covers Chipotle).
   The previous version is in v2-archive/. seedVersion 3 and version 3: progress and receipts from v2 do not carry over. */
(function (root) {
  'use strict';
  const QUIZ = [
    { title: 'Quick check: the owners’ stake',
      q: 'A company’s balance sheet says its owners’ equity is $30 million. Its shares are worth $120 million at today’s share price. Which number belongs in the owners’ stake line of the hurdle table?',
      options: ['$120 million, what the shares are worth today', '$30 million, the balance sheet number', '$75 million, the average of the two', 'Neither. Use the number of shares'],
      answer: 0,
      why: ['Right. The owners could sell their shares today for $120 million and invest that money somewhere else. That is the money they leave in the company, so it is the amount they expect a return on.',
        'The balance sheet number mostly records what owners paid in years ago. The owners could sell today for $120 million, so that is the money they leave in the company.',
        'Averaging two different measures gives a number nobody could sell for. Use what the shares are worth today.',
        'A share count is not an amount of money. Multiply the shares by today’s price to get the owners’ stake.'] },
    { title: 'Exam-style question',
      q: 'A company owes its lenders $40 million at 6% a year. Its shares are worth $60 million at today’s price, and its owners expect 11% a year. What hurdle rate should it use for a new project as risky as its current business?',
      options: ['9.0%', '8.5%', '8.0%', '11.0%'],
      answer: 0,
      why: ['Right. Lenders expect $40 million × 6% = $2.4 million a year and owners expect $60 million × 11% = $6.6 million. That is $9.0 million on $100 million, a 9.0% hurdle rate. Exam questions look like this one.',
        '8.5% is the plain average of 6% and 11%. The owners put in more money, so their 11% counts for more. Work in dollars: ($2.4 million + $6.6 million) ÷ $100 million = 9.0%.',
        '8.0% swaps the amounts, putting $60 million at 6% and $40 million at 11%. The lenders put in $40 million and the owners $60 million.',
        '11.0% is what the owners alone expect. The lenders put in $40 million at a lower rate, so the hurdle rate for the whole company is lower: 9.0%.'] },
  ];

  const STEPS = [
    { id: 'tr1', label: 'The first truck', kind: 'task' },
    { id: 'tr2', label: 'A friend’s truck', kind: 'task' },
    { id: 'co1', label: 'A rival chain', kind: 'task' },
    { id: 'q1', label: 'Quick check', kind: 'check', quiz: 0 },
    { id: 'co2', label: 'Halfmoon', kind: 'task' },
    { id: 'q2', label: 'Exam-style question', kind: 'check', quiz: 1 },
    { id: 'note', label: 'Your note', kind: 'note' },
  ];

  // Round seed sets (the tests read these). Trucks: whole dollars, whole-number rates, the bank's share in tenths, so the hurdle
  // rate has one decimal. Companies: $ millions, round shares and price, debt a round share of the money put in.
  const ROUND = {
    C: [100000, 120000, 150000, 200000, 250000], s: [0.3, 0.4, 0.6, 0.7], rd1: [5, 6, 7, 8], re1: [10, 11, 12, 13],
    N: [5, 6, 8, 10, 12, 15, 20], P: [10, 12, 15, 20, 25, 30, 40], ratio: [[1, 4], [1, 3], [3, 7], [2, 3]], rd2: [5, 6, 7], re2: [10, 11, 12],
    rel: ['aunt', 'uncle', 'grandmother', 'cousin'],
  };
  // Hurdle rates (in %) no student answer may equal: the reading's truck (8.2) and Mattel (6.6), each step's worked example,
  // and the exam-style question (9.0).
  const AVOID = { tr1: [8.2, 7.0], tr2: [8.2, 7.5], co1: [6.6, 8.8, 9.0], co2: [6.6, 9.5, 9.0] };
  const near = (a, b) => Math.abs(a - b) < 0.05;

  function truck(rng, h, id, not) {
    for (let k = 0; k < 400; k++) {
      const C = h.pick(rng, ROUND.C), s = h.pick(rng, ROUND.s), rd = h.pick(rng, ROUND.rd1), re = h.pick(rng, ROUND.re1);
      const L = Math.round(C * s), E = C - L, dd = L * rd / 100, de = E * re / 100, hp = Math.round(1000 * (dd + de) / C) / 10;
      if (AVOID[id].some((x) => near(x, hp)) || (not && not.C === C && not.L === L)) continue;
      return { id, C, L, E, rd, re, rel: h.pick(rng, ROUND.rel), dd, de, tot: dd + de, answer: hp / 100 };
    }
  }
  function company(rng, h, id, not) {
    for (let k = 0; k < 2000; k++) {
      const N = h.pick(rng, ROUND.N), P = h.pick(rng, ROUND.P), E = N * P; if (E < 150 || E > 600) continue;
      const [a, b] = h.pick(rng, ROUND.ratio); if (E % b) continue; const D = E * a / b; if (D % 5) continue;
      const rd = h.pick(rng, ROUND.rd2), re = h.pick(rng, ROUND.re2), B = h.round(E * (0.3 + 0.2 * rng()), 5);
      const dd = D * rd / 100, de = E * re / 100, hm = 100 * (dd + de) / (D + E), hb = 100 * (dd + B * re / 100) / (D + B);
      if (hm - hb < 0.15 || Math.abs(hm - (rd + re) / 2) < 0.1 || AVOID[id].some((x) => near(x, hm))) continue;
      if (not && not.D === D && not.E === E) continue;
      return { id, N, P, E, D, rd, re, B, dd, de, tot: dd + de, answer: (dd + de) / (D + E) };
    }
  }
  function buildTasks(rng, h) {
    const T = [];
    T.push(truck(rng, h, 'tr1'));
    T.push(truck(rng, h, 'tr2', T[0]));
    T.push(company(rng, h, 'co1'));
    const c2 = company(rng, h, 'co2', T[2]);
    // The new restaurant's expected return sits 1 to 1.5 points from Halfmoon's hurdle rate, on a random side.
    const delta = h.pick(rng, [-0.015, -0.01, 0.01, 0.015]), X = Math.round((c2.answer + delta) * 1000) / 1000;
    T.push(Object.assign(c2, { X, decision: X > c2.answer ? 'build' : 'pass' }));
    return T;
  }

  const H = () => root.DeskEngine.h;
  const m = (x) => H().money(x);
  const fx = (x, dp) => (Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp)).toLocaleString('en-US', { maximumFractionDigits: dp });
  const mn = (x) => '$' + fx(x, 2) + ' million';
  const price = (x) => H().money(x, x % 1 ? 2 : 0);
  const pc = (r) => fx(r * 100, 2) + '%';               // a decimal rate shown as a percent, up to two decimals
  const ip = (x) => x + '%';                            // a whole-number percent
  // A rate typed as 8.2%, 8.2 or 0.082 all mean 8.2%. Every rate on this desk is above 1%.
  const pctIn = (h, s) => { const v = h.parseMoney(s); if (!isFinite(v)) return v; return (!/%/.test(String(s)) && Math.abs(v) >= 1) ? v / 100 : v; };
  // Millions typed as 412.5 (or in full dollars, 412,500,000) both mean $412.5 million.
  const milIn = (h, s) => { const v = h.parseMoney(s); if (!isFinite(v)) return v; return Math.abs(v) >= 1e5 ? v / 1e6 : v; };

  // Lines for each task. The worked example uses the same function on other numbers, so the two tables always match.
  // Each line: key, label, calc, num (the right answer), shown (text in a filled cell), input, kind ('usd' | 'mil' | 'pct').
  const LINES = {
    truck: (C, L, E, rd, re, who, faded, filled) => {
      const dd = L * rd / 100, de = E * re / 100, open = !faded && !filled, Who = who[0].toUpperCase() + who.slice(1);
      return [
        { key: 'bank', label: 'Bank’s dollars a year', calc: `${m(L)} × ${ip(rd)}`, num: dd, shown: m(dd), input: !faded, kind: 'usd' },
        { key: 'own', label: `${Who}’s dollars a year`, calc: `${m(E)} × ${ip(re)}`, num: de, shown: m(de), input: !faded, kind: 'usd' },
        { key: 'tot', label: 'Total dollars a year', calc: open ? `bank’s dollars + ${who}’s dollars` : `${m(dd)} + ${m(de)}`, num: dd + de, shown: m(dd + de), input: true, kind: 'usd' },
        { key: 'hr', label: 'Hurdle rate', calc: open ? `total ÷ ${m(C)}` : `${m(dd + de)} ÷ ${m(C)}`, num: (dd + de) / C, shown: pc((dd + de) / C), input: true, kind: 'pct' }];
    },
    company: (N, P, D, rd, re, faded, filled) => {
      const E = N * P, dd = D * rd / 100, de = E * re / 100, open = !filled;
      return [
        { key: 'stake', label: 'Owners’ stake', calc: `${N} million shares × ${price(P)}`, num: E, shown: mn(E), input: true, kind: 'mil' },
        { key: 'lend', label: 'Lenders’ dollars a year', calc: `${mn(D)} × ${ip(rd)}`, num: dd, shown: mn(dd), input: !faded, kind: 'mil' },
        { key: 'own', label: 'Owners’ dollars a year', calc: open ? `owners’ stake × ${ip(re)}` : `${mn(E)} × ${ip(re)}`, num: de, shown: mn(de), input: !faded, kind: 'mil' },
        { key: 'tot', label: 'Total dollars a year', calc: open ? 'lenders’ dollars + owners’ dollars' : `${mn(dd)} + ${mn(de)}`, num: dd + de, shown: mn(dd + de), input: !faded, kind: 'mil' },
        { key: 'hr', label: 'Hurdle rate', calc: open ? `total ÷ (${mn(D)} + owners’ stake)` : `${mn(dd + de)} ÷ (${mn(D)} + ${mn(E)})`, num: (dd + de) / (D + E), shown: pc((dd + de) / (D + E)), input: true, kind: 'pct' }];
    },
  };
  // For h.ladder: a filled cell shows its text; an input gets the placeholder that fits its kind.
  const forLadder = (lines, filled) => lines.map((l) => (filled || !l.input
    ? { label: l.label, calc: l.calc, value: l.shown, fmt: 'text', input: l.input }
    : { label: l.label, calc: l.calc, value: l.num, fmt: l.kind === 'pct' ? 'pct' : l.kind === 'mil' ? 'num' : 'money', input: true }));

  function linesFor(t) {
    if (t.id === 'tr1' || t.id === 'tr2') return LINES.truck(t.C, t.L, t.E, t.rd, t.re, t.rel, t.id === 'tr1', false);
    return LINES.company(t.N, t.P, t.D, t.rd, t.re, t.id === 'co1', false);
  }
  // Worked examples: other numbers, other answers (the tests check that none equals a student's answer).
  const EXAMPLES = {
    tr1: { cap: 'A coffee cart costs $50,000. A bank lends $30,000 at 5%, and a partner puts in $20,000 expecting 10%.', lines: () => LINES.truck(50000, 30000, 20000, 5, 10, 'partner', false, true) },
    tr2: { cap: 'A taco truck costs $120,000. A bank lends $90,000 at 6%, and a part owner puts in $30,000 expecting 12%.', lines: () => LINES.truck(120000, 90000, 30000, 6, 12, 'part owner', false, true) },
    co1: { cap: 'A pizza chain owes lenders $200 million at 4%. Its owners hold 10 million shares at $30 and expect 12%.', lines: () => LINES.company(10, 30, 200, 4, 12, false, true) },
    co2: { cap: 'A burger chain owes lenders $150 million at 5%. Its owners hold 15 million shares at $30 and expect 11%. Its balance sheet shows owners’ equity of $180 million.', lines: () => LINES.company(15, 30, 150, 5, 11, false, true),
      after: 'Its hurdle rate is 9.5%. A new burger restaurant expected to earn 10% a year clears it, so the chain should build. The $180 million balance sheet number is not used.' },
  };

  const PROBLEM = {
    tr1: (t) => ({ title: 'Halfmoon’s first food truck', place: 'Halfmoon began as one food truck. Imogen wants to show you what it had to earn.',
      body: `<p>The truck cost <b>${m(t.C)}</b>. A bank lent <b>${m(t.L)}</b> at <b>${ip(t.rd)}</b>, and Imogen’s ${t.rel} put in <b>${m(t.E)}</b> for part ownership, expecting <b>${ip(t.re)}</b> a year. What was the truck’s hurdle rate? The first two lines are done for you.</p>` }),
    tr2: (t) => ({ title: 'A friend’s food truck', place: 'Imogen’s friend wants to start a food truck and asks what it must earn.',
      body: `<p>The truck costs <b>${m(t.C)}</b>. A bank lends <b>${m(t.L)}</b> at <b>${ip(t.rd)}</b>, and the friend’s ${t.rel} puts in <b>${m(t.E)}</b> for part ownership, expecting <b>${ip(t.re)}</b> a year. What is the truck’s hurdle rate?</p>` }),
    co1: (t) => ({ title: 'A rival chain', place: 'Before Halfmoon’s own numbers, Imogen tries the table on a rival, Saltbox Grill.',
      body: `<p>Saltbox owes lenders <b>${mn(t.D)}</b> at <b>${ip(t.rd)}</b>. Its owners hold <b>${t.N} million</b> shares at <b>${price(t.P)}</b> and expect <b>${ip(t.re)}</b> a year. What is Saltbox’s hurdle rate? The middle lines are done for you.</p>` }),
    co2: (t) => ({ title: 'Halfmoon’s hurdle rate', place: 'Halfmoon wants to open a new restaurant, and Imogen needs the rate to judge it.',
      body: `<p>Halfmoon owes lenders <b>${mn(t.D)}</b> at <b>${ip(t.rd)}</b>. Its owners hold <b>${t.N} million</b> shares at <b>${price(t.P)}</b> and expect <b>${ip(t.re)}</b> a year. Its balance sheet shows owners’ equity of <b>${mn(t.B)}</b>. What is Halfmoon’s hurdle rate?</p>`,
      choice: { legend: `The new restaurant is expected to earn ${pc(t.X)} a year. Should Halfmoon build it?`, options: [['build', 'Build: it earns more than the hurdle rate'], ['pass', 'Pass: it earns less than the hurdle rate']] } }),
  };

  function taskView(t, L, h) {
    const P = PROBLEM[t.id](t), E = EXAMPLES[t.id];
    const example = h.ladder(forLadder(E.lines(), true), { filled: true, caption: E.cap }) + (E.after ? `<p>${E.after}</p>` : '');
    const co = /^co/.test(t.id);
    const table = h.ladder(forLadder(linesFor(t), false), { rows: L.rows, caption: co ? 'Your turn (amounts in millions of dollars)' : 'Your turn' })
      + `<p class="small">${co ? 'Type amounts in millions, like 412.5, and the rate as a percentage, like 8.25%.' : 'Type the hurdle rate as a percentage, like 8.5%.'}</p>`;
    const parts = [{ html: '', field: 'table' }];
    if (P.choice) parts.push({ html: '', field: 'choice' });
    return { title: P.title, place: P.place, body: P.body, example, table, parts, choice: P.choice,
      helpLabels: ['Show me the first blank', 'Show me every line'] };
  }

  // Common slips, per line, phrased with the student's own numbers.
  function diagFor(t, l) {
    const D = [];
    if (/^tr/.test(t.id)) {
      const way = `${m(t.tot)} ÷ ${m(t.C)}`, who = `the ${t.rel}`;
      if (l.key === 'bank') D.push([t.L * t.re / 100, 'rate', `The bank charges ${ip(t.rd)}, not ${ip(t.re)}: ${m(t.L)} × ${ip(t.rd)}.`],
        [t.C * t.rd / 100, 'whole', `Use only the ${m(t.L)} the bank lent, not the whole ${m(t.C)}: ${m(t.L)} × ${ip(t.rd)}.`],
        [t.L * t.rd, 'pct', `Turn ${ip(t.rd)} into ${t.rd / 100} before multiplying: ${m(t.L)} × ${t.rd / 100}.`]);
      if (l.key === 'own') D.push([t.E * t.rd / 100, 'rate', `The ${t.rel} expects ${ip(t.re)}, not the bank’s ${ip(t.rd)}: ${m(t.E)} × ${ip(t.re)}.`],
        [t.C * t.re / 100, 'whole', `Use only the ${m(t.E)} the ${t.rel} put in, not the whole ${m(t.C)}: ${m(t.E)} × ${ip(t.re)}.`],
        [t.E * t.re, 'pct', `Turn ${ip(t.re)} into ${t.re / 100} before multiplying: ${m(t.E)} × ${t.re / 100}.`]);
      if (l.key === 'tot') D.push([t.dd, 'onlybank', `That is the bank’s dollars alone. Add the ${t.rel}’s: ${m(t.dd)} + ${m(t.de)}.`],
        [t.de, 'onlyown', `That is the ${t.rel}’s dollars alone. Add the bank’s: ${m(t.dd)} + ${m(t.de)}.`],
        [t.C, 'cost', `That is the cost of the truck. Add the dollars a year: ${m(t.dd)} + ${m(t.de)}.`]);
      if (l.key === 'hr') D.push([(t.rd + t.re) / 200, 'avg', `That is the plain average of ${ip(t.rd)} and ${ip(t.re)}. The bank put in ${m(t.L)} and the ${t.rel} ${m(t.E)}, so work in dollars: ${way}.`],
        [(t.L * t.re + t.E * t.rd) / t.C / 100, 'swap', `That puts each rate on the other person’s money. The bank’s ${m(t.L)} goes with ${ip(t.rd)}, and the ${t.rel}’s ${m(t.E)} with ${ip(t.re)}.`],
        [t.re / 100, 'own', `That is what ${who} expects alone. The truck has to pay the bank too: ${way}.`],
        [t.rd / 100, 'bank', `That is the bank’s rate alone. The truck has to pay ${who} too: ${way}.`],
        [t.tot / t.L, 'base', `That divides by the bank’s ${m(t.L)}. Divide by the whole cost of the truck: ${way}.`],
        [t.tot / t.E, 'baseE', `That divides by the ${t.rel}’s ${m(t.E)}. Divide by the whole cost of the truck: ${way}.`]);
      return D;
    }
    const st = mn(t.E), way = `${mn(t.tot)} ÷ (${mn(t.D)} + ${st})`;
    if (l.key === 'stake') D.push([t.P, 'price', `That is the price of one share. Multiply it by the number of shares: ${t.N} million × ${price(t.P)}.`],
      [t.B, 'book', `That is the balance sheet number. Owners could sell their shares today for shares × price: ${t.N} million × ${price(t.P)}.`],
      [t.N, 'shares', `That is the number of shares. Multiply it by the price: ${t.N} million × ${price(t.P)}.`]);
    if (l.key === 'lend') D.push([t.D * t.re / 100, 'rate', `Lenders charge ${ip(t.rd)}: ${mn(t.D)} × ${ip(t.rd)}.`],
      [t.D * t.rd, 'pct', `Turn ${ip(t.rd)} into ${t.rd / 100} before multiplying: ${mn(t.D)} × ${t.rd / 100}.`],
      [t.E * t.rd / 100, 'stake', `That uses the owners’ stake. Lenders’ dollars come from what lenders put in: ${mn(t.D)} × ${ip(t.rd)}.`]);
    if (l.key === 'own') D.push([t.B * t.re / 100, 'book', `That uses the balance sheet number. Use the owners’ stake at today’s price: ${st} × ${ip(t.re)}.`],
      [t.E * t.rd / 100, 'rate', `Owners expect ${ip(t.re)}, not the lenders’ rate: ${st} × ${ip(t.re)}.`],
      [t.E * t.re, 'pct', `Turn ${ip(t.re)} into ${t.re / 100} before multiplying: ${st} × ${t.re / 100}.`],
      [t.D * t.re / 100, 'debt', `That uses the lenders’ ${mn(t.D)}. Owners’ dollars come from the owners’ stake: ${st} × ${ip(t.re)}.`]);
    if (l.key === 'tot') D.push([t.dd, 'onlylend', `That is the lenders’ dollars alone. Add the owners’: ${mn(t.dd)} + ${mn(t.de)}.`],
      [t.de, 'onlyown', `That is the owners’ dollars alone. Add the lenders’: ${mn(t.dd)} + ${mn(t.de)}.`],
      [t.D + t.E, 'money', `That is all the money put in. Add the dollars a year: ${mn(t.dd)} + ${mn(t.de)}.`]);
    if (l.key === 'hr') D.push([(t.dd + t.B * t.re / 100) / (t.D + t.B), 'book', `That uses the balance sheet number for the owners. Use the owners’ stake at today’s price: ${way}.`],
      [(t.rd + t.re) / 200, 'avg', `That is the plain average of ${ip(t.rd)} and ${ip(t.re)}. The owners put in more money, so work in dollars: ${way}.`],
      [t.re / 100, 'own', `That is what owners expect alone. Lenders put in money too, at a lower rate: ${way}.`],
      [t.tot / t.E, 'base', `That divides by the owners’ stake alone. Divide by all the money put in, ${mn(t.D)} + ${st}: ${way}.`],
      [t.tot / t.D, 'baseD', `That divides by the lenders’ ${mn(t.D)} alone. Divide by all the money put in, ${mn(t.D)} + ${st}: ${way}.`]);
    return D;
  }

  const plain = (s) => String(s).replace(/<[^>]+>/g, '');
  function judgeTask(t, e, h) {
    const lines = linesFor(t), rows = e.rows || [], rowRes = [];
    lines.forEach((l, i) => {
      if (!l.input) return;
      const other = `${plain(l.calc)}.`;
      const opts = l.kind === 'pct' ? { tol: 0.0006, scale: l.num, unreadable: 'Type a percentage, like 8.25%.', closeMsg: 'Close. Keep two decimal places in the percentage.', otherMsg: other }
        : l.kind === 'mil' ? { tol: Math.max(0.05, 0.002 * Math.abs(l.num)), scale: l.num, unreadable: 'Type an amount in millions of dollars, like 412.5.', closeMsg: 'Close. Keep the decimals and round only at the end.', otherMsg: other }
          : { tol: 1, scale: l.num, otherMsg: other };
      const v = l.kind === 'pct' ? pctIn(h, rows[i]) : l.kind === 'mil' ? milIn(h, rows[i]) : h.parseMoney(rows[i]);
      rowRes[i] = h.judgeNumber(v, l.num, diagFor(t, l), opts);
    });
    const bad = rowRes.findIndex((x) => x && !x.ok);
    if (bad >= 0) return { ok: false, rowRes, msg: `${plain(lines[bad].label)}: ${rowRes[bad].msg}` };
    if (t.decision && e.choice !== t.decision) {
      if (!e.choice) return { ok: false, rowRes, msg: 'Now answer the question under the table.' };
      return { ok: false, rowRes, msg: `Compare the restaurant’s ${pc(t.X)} with Halfmoon’s hurdle rate, ${pc(t.answer)}. Which is bigger?` };
    }
    return { ok: true, rowRes };
  }

  function helpText(t, lvl) {
    const lines = linesFor(t), blanks = lines.filter((l) => l.input);
    const say = (l) => `${l.label}: ${l.calc} = ${l.shown}`.replace(/owners’ stake × /, `${mn(t.E)} × `);
    const full = (l) => {   // every line with its numbers, as in the worked example
      const f = /^tr/.test(t.id) ? LINES.truck(t.C, t.L, t.E, t.rd, t.re, t.rel, false, true) : LINES.company(t.N, t.P, t.D, t.rd, t.re, false, true);
      return f.find((x) => x.key === l.key);
    };
    return lvl === 1 ? say(full(blanks[0])) : lines.map((l) => say(full(l))).join('<br>');
  }
  function praise(t) {
    if (t.id === 'tr1') return `The first truck had to earn ${m(t.tot)} a year on ${m(t.C)}, a hurdle rate of ${pc(t.answer)}. Earning less, the ${t.rel} would have done better in an index fund.`;
    if (t.id === 'tr2') return `The truck must earn ${pc(t.answer)} a year. That is closer to the ${t.L > t.E ? 'bank’s' : `${t.rel}’s`} rate, because the ${t.L > t.E ? 'bank' : t.rel} put in more money.`;
    if (t.id === 'co1') return `Saltbox must earn ${pc(t.answer)} a year on the ${mn(t.D + t.E)} its lenders and owners have in it.`;
    if (t.id === 'co2') return `Halfmoon’s hurdle rate is ${pc(t.answer)}. The new restaurant’s ${pc(t.X)} ${t.decision === 'build' ? 'clears it, so build' : 'falls short, so pass'}. The balance sheet number would have given ${pc((t.dd + t.B * t.re / 100) / (t.D + t.B))}, too low.`;
  }
  function selfAnswer(t) {
    const rows = []; linesFor(t).forEach((l, i) => { if (l.input) rows[i] = l.kind === 'pct' ? pc(l.num) : String(Math.round(l.num * 100) / 100); });
    return { rows, choice: t.decision || null };
  }
  function selfWrong(t) {
    const rows = []; linesFor(t).forEach((l, i) => { if (l.input) rows[i] = l.kind === 'pct' ? pc(l.num * 1.3) : String(Math.round(l.num * 1.3 * 100) / 100); });
    return { rows, choice: t.decision || null };
  }

  root.DESK = {
    app: 'finan4-u11-hurdle-desk', version: 3, seedVersion: 3, salt: 'rize-finan4-u11-hurdle:3c81d4', points: 20,
    storageKey: 'rize-finan4-u11-hurdle-v3', filePrefix: 'HurdleDesk',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-hurdle-desk/verify.html',
    calcPlaceholder: '(30000*0.05+20000*0.1)/50000',
    story: { title: 'The Hurdle Desk', kicker: 'Corporate Finance, Unit 11', company: 'Halfmoon Dumplings', team: 'Finance Team',
      from: 'Imogen Takeda', fromTitle: 'head of finance, Halfmoon Dumplings',
      dek: 'Halfmoon Dumplings began as one food truck and now runs a chain of restaurants. It wants to open another, and Imogen Takeda, its head of finance, must tell the board what return the new restaurant has to beat. You work out that hurdle rate with her, starting with a food truck.',
      whatBox: '',
      stepsLine: 'Seven short steps. Each problem shows a worked example in the same table you fill in, then you do the same calculation with your own numbers.' },
    steps: STEPS, quiz: QUIZ, walk: null, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong, ROUND,
    note: { title: 'A note for the board', label: 'Your note to Imogen', minWords: 30, receiptHeading: 'Note to the head of finance',
      prompt: 'Imogen presents to Halfmoon’s board next week. Give Halfmoon’s hurdle rate and say whether the new restaurant clears it. Explain why the owners’ stake uses today’s share price and not the balance sheet equity.' },
  };
})(typeof window !== 'undefined' ? window : globalThis);
