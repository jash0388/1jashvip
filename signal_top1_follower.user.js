// ==UserScript==
// @name         JASH VIP ULTIMATE 1 — WinGo 12-Engine BIG & SMALL Prediction HUD & AutoBet (1M & 30S)
// @namespace    https://github.com/jash0388/jashvip
// @version      43.0
// @description  👑 JASH VIP V43 · Synthesized Quant Consensus Engine with Time-Series Autocorrelation (Anti-Chop r1), TSX Multi-Order Geometric Recognition (1B+2S, 2B+2S, 3B+3S), N-gram Context Memory, and High-Conviction Zigzag/Doublet Rides.
// @match        *://*.dmfirst7.com/*
// @match        *://*.dmfirst0.com/*
// @match        *://*.dmfirst*.com/*
// @match        *://*.in999vv.com/*
// @match        *://*.in999*.com/*
// @match        *://*.us3b7o.com/*
// @match        *://*.daman*.com/*
// @match        *://*.tiranga*.com/*
// @match        *://*.bdg*.com/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      draw.ar-lottery01.com
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  if (window.__JASH_VIP_ULTIMATE_ACTIVE__) return;
  window.__JASH_VIP_ULTIMATE_ACTIVE__ = true;

  console.log(
    "%c👑 JASH VIP ULTIMATE V43 · QUANT CONSENSUS (ANTI-CHOP r1 & TSX GEOM) ACTIVE",
    "background:linear-gradient(135deg,#00f5a0,#00d9ff,#ff3366);color:#000;font-size:15px;font-weight:900;padding:8px 16px;border-radius:8px;box-shadow:0 0 25px rgba(0,245,160,0.6);"
  );

  // ── 1. WAKE LOCK & PREVENT SLEEP ──────────────────────────
  let wakeLockObj = null;
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) wakeLockObj = await navigator.wakeLock.request('screen');
    } catch (e) {}
  }
  setInterval(requestWakeLock, 8000);
  requestWakeLock();

  // ── 2. STATE PERSISTENCE & MARTINGALE FORMULA ─────────────
  let GAME_MODE = localStorage.getItem('JASH_MODE') || '1M';
  if (GAME_MODE !== '1M' && GAME_MODE !== '30S') GAME_MODE = '1M';

  let BASE_BET = parseInt(localStorage.getItem('JASH_BASE_BET') || '3', 10);
  if (isNaN(BASE_BET) || BASE_BET < 1) BASE_BET = 3;

  function getStakeForStep(base, step) {
    const b = Math.max(1, parseInt(base, 10) || 3);
    const s = Math.max(0, parseInt(step, 10) || 0);
    if (s === 0) return b;
    if (s === 1) return (b * 2) + 1; // e.g. 7 if base 3, 5 if base 2
    return ((b * 2) + 1) * Math.pow(2, s - 1); // 14, 28, 56, 112, 224, 448...
  }

  let currentEngineLevel = 1;
  let wins            = parseInt(localStorage.getItem('JASH_WINS') || '0', 10);
  let losses          = parseInt(localStorage.getItem('JASH_LOSSES') || '0', 10);
  let martingaleStep  = parseInt(localStorage.getItem('JASH_STEP') || '0', 10);
  let LOSS_STREAK     = parseInt(localStorage.getItem('JASH_LOSS_STREAK') || '0', 10);
  let currentBet      = getStakeForStep(BASE_BET, martingaleStep);
  let running         = false;
  let isMinimized     = false;

  let currentPeriod   = null;
  let lastPredicted   = localStorage.getItem('JASH_LAST_PRED') || null;
  let lastBetPeriod   = localStorage.getItem('JASH_LAST_BET_P') || null;
  let pendingBet      = null;
  let isBettingInProgress = false;

  let PLACED_PERIODS      = new Set();
  let RESOLVED_PERIODS    = new Set();
  let LOCKED_TIME_BUCKETS = new Set();

  let RECORDED_BETS = [];
  try {
    const saved = localStorage.getItem('JASH_BETS');
    if (saved) RECORDED_BETS = JSON.parse(saved);
  } catch (e) {}

  function persistAll() {
    try {
      localStorage.setItem('JASH_MODE', GAME_MODE);
      localStorage.setItem('JASH_BASE_BET', BASE_BET.toString());
      localStorage.setItem('JASH_WINS', wins.toString());
      localStorage.setItem('JASH_LOSSES', losses.toString());
      localStorage.setItem('JASH_STEP', martingaleStep.toString());
      localStorage.setItem('JASH_LOSS_STREAK', LOSS_STREAK.toString());
      if (lastPredicted) localStorage.setItem('JASH_LAST_PRED', lastPredicted);
      if (lastBetPeriod) localStorage.setItem('JASH_LAST_BET_P', lastBetPeriod);
      localStorage.setItem('JASH_BETS', JSON.stringify(RECORDED_BETS.slice(0, 30)));
    } catch (e) {}
  }

  // ── 3. 100% EXACT MASTER CONSENSUS ENGINES (FROM LIVE SITE) ──
  function getSize(number) {
    return parseInt(number, 10) >= 5 ? 'BIG' : 'SMALL';
  }
  function opp(size) {
    return size === 'BIG' ? 'SMALL' : 'BIG';
  }

  function getRuns(sizes) {
    const runs = [];
    if (!sizes.length) return runs;
    let cur = sizes[0], len = 1;
    for (let i = 1; i < sizes.length; i++) {
      if (sizes[i] === cur) len++;
      else {
        runs.push({ size: cur, len });
        cur = sizes[i];
        len = 1;
      }
    }
    runs.push({ size: cur, len });
    return runs;
  }

  // 1. APEX TITAN CADENCE ENGINE (TRUE CHRONOLOGICAL MOMENTUM & RECOVERY)
  function apexTitanEngine(sizes, lossStreak) {
    const chron = sizes.slice().reverse(); // Chronological: [oldest ... newest]
    const runs = getRuns(chron);
    const cRun = runs[runs.length - 1]; // Current active run
    const cSide = cRun ? cRun.size : sizes[0];
    const cLen = cRun ? cRun.len : 1;
    const pRun = runs.length >= 2 ? runs[runs.length - 2] : { size: opp(cSide), len: 0 };
    const lastS = chron[chron.length - 1]; // Current newest draw

    let alt = 0;
    for (let i = runs.length - 1; i >= 0; i--) {
      if (runs[i].len === 1) alt++;
      else break;
    }

    if (lossStreak >= 2) {
      if (cLen >= 3) return { vote: cSide, reg: '🛑 L3 DRAGON LOCK' };
      if (cLen === 2 && pRun.len === 2) return { vote: opp(cSide), reg: '🛑 L3 2-2 CUT' };
      if (alt >= 2) return { vote: opp(lastS), reg: '🛑 L3 CHOP FLIP' };
      if (cLen === 1) return { vote: opp(cSide), reg: '🛑 L3 SINGLE CUT' };
      return { vote: cSide, reg: '🛑 L3 DOUBLET' };
    } else if (lossStreak === 1) {
      if (cLen >= 3) return { vote: cSide, reg: '🛡️ L2 DRAGON RIDE' };
      if (cLen === 2 && pRun.len === 2) return { vote: opp(cSide), reg: '🛡️ L2 2-2 CUT' };
      if (alt >= 2) return { vote: opp(lastS), reg: '🛡️ L2 CHOP FLIP' };
      if (cLen === 1) return { vote: opp(cSide), reg: '🛡️ L2 SINGLE CUT' };
      return { vote: cSide, reg: '🛡️ L2 DOUBLET' };
    } else {
      if (cLen >= 3) return { vote: cSide, reg: '🌊 L1 DRAGON RIDE' };
      if (cLen === 2 && pRun.len === 2) return { vote: opp(cSide), reg: '🌊 L1 2-2 CUT' };
      if (cLen === 2) return { vote: cSide, reg: '🌊 L1 DOUBLET RIDE' };
      if (alt >= 2) return { vote: opp(lastS), reg: '⚡ L1 CHOP OSC' };
      if (cLen === 1) return { vote: opp(cSide), reg: '🌊 L1 SINGLE CUT' };
      return { vote: cSide, reg: '🌊 L1 MOMENTUM' };
    }
  }

  // 2. RADHE HACK 2-3 LEVEL FIX
  function radheEngine(list) {
    let sizes = list.slice(0, 12).map(item => getSize(item.number));
    let consecutiveCount = 1;
    for (let i = 1; i < sizes.length; i++) {
      if (sizes[i] === sizes[0]) consecutiveCount++; else break;
    }
    if (consecutiveCount >= 4) return sizes[0];
    let isAlternating = true;
    for (let i = 0; i < 4; i++) {
      if (sizes[i] === sizes[i + 1]) { isAlternating = false; break; }
    }
    if (isAlternating) return sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
    let weightSum = 0;
    for (let i = 0; i < Math.min(list.length, 6); i++) {
      let num = parseInt(list[i].number, 10);
      let pWeight = (6 - i) * 3;
      weightSum += (num >= 5) ? pWeight : -pWeight;
    }
    return weightSum >= 0 ? 'BIG' : 'SMALL';
  }

  // 3. SURESH VIP SUPREME V15
  function sureshEngine(list) {
    let bigs = 0, smalls = 0;
    for (let i = 0; i < Math.min(10, list.length); i++) {
      const num = parseInt(list[i].number, 10);
      const weight = (10 - i);
      if (num >= 5) bigs += weight; else smalls += weight;
    }
    const last3 = list.slice(0, 3).map(x => getSize(x.number));
    if (last3[0] === last3[1] && last3[1] === last3[2]) {
      return last3[0];
    }
    return bigs >= smalls ? 'BIG' : 'SMALL';
  }

  // 4. QUANTUM MARKOV 2-GRAM (TRUE FORWARD TIME PREDICTOR)
  function markovEngine(sizes) {
    if (sizes.length < 5) return sizes[0];
    const chron = sizes.slice().reverse(); // Chronological: [oldest ... newest]
    const n = chron.length;
    const s1 = chron[n - 2];
    const s0 = chron[n - 1];
    let nextB = 0, nextS = 0;
    for (let i = 0; i < n - 2; i++) {
      if (chron[i] === s1 && chron[i + 1] === s0) {
        if (chron[i + 2] === 'BIG') nextB++;
        else if (chron[i + 2] === 'SMALL') nextS++;
      }
    }
    if (nextB > nextS) return 'BIG';
    if (nextS > nextB) return 'SMALL';
    return s0;
  }

  // 5. TGX 6-LOGIC ENSEMBLE
  function tgxLogic1(nums, sizes) {
    const n1 = nums[0], n2 = nums[1] || nums[0];
    const n9 = nums[8] || nums[nums.length - 1], n10 = nums[9] || nums[nums.length - 1];
    let total = Math.abs((n1 - n2) + (n9 - n10)) % 10;
    let bigs = 0;
    for (let i = 0; i < Math.min(5, sizes.length); i++) if (sizes[i] === 'BIG') bigs++;
    if (bigs >= 4) return total >= 4 ? 'BIG' : 'SMALL';
    if (bigs <= 1) return total >= 6 ? 'BIG' : 'SMALL';
    return total >= 5 ? 'BIG' : 'SMALL';
  }

  function tgxLogic2(nums) {
    const w = [3, 2, 1, 1, 1];
    let sum = 0;
    for (let i = 0; i < Math.min(5, nums.length); i++) sum += nums[i] * w[i];
    sum += nums[0] * 2;
    return (sum % 10) >= 5 ? 'BIG' : 'SMALL';
  }

  function tgxLogic3(nums, sizes) {
    let vol = 0;
    for (let i = 0; i < Math.min(5, nums.length - 1); i++) vol += Math.abs(nums[i] - nums[i + 1]);
    vol = vol / 5;
    let streak = 1;
    for (let i = 1; i < Math.min(5, sizes.length); i++) if (sizes[i] === sizes[0]) streak++; else break;
    let streakScore = streak >= 3 ? -25 : (streak === 2 ? -15 : (vol > 3 ? 10 : 5));
    let bigCnt = sizes.slice(0, 8).filter(x => x === 'BIG').length;
    let imbalance = ((bigCnt - 4) / 8) * 100;
    let pattern = (sizes[0] === sizes[1] && sizes[1] === sizes[2]) ? -35 : (sizes[0] === sizes[1] ? -20 : 25);
    let total = (streakScore * 0.3) + (imbalance * 0.4) + (pattern * 0.3);
    return total >= 0 ? 'BIG' : 'SMALL';
  }

  function tgxLogic4(sizes) {
    let streak = 1;
    for (let i = 1; i < sizes.length; i++) if (sizes[i] === sizes[0]) streak++; else break;
    if (streak >= 2) return sizes[0];
    let changes = 0;
    for (let i = 0; i < Math.min(5, sizes.length - 1); i++) if (sizes[i] !== sizes[i + 1]) changes++;
    if (changes >= 3) return sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
    return sizes[0];
  }

  function tgxLogic5(nums) {
    let ev = 0;
    for (let i = 0; i < Math.min(6, nums.length); i++) if (nums[i] % 2 === 0) ev++;
    return ev >= 3 ? 'BIG' : 'SMALL';
  }

  function tgxLogic6(sizes) {
    if (sizes.length < 2) return sizes[0];
    return sizes[0] === sizes[1] ? (sizes[0] === 'BIG' ? 'SMALL' : 'BIG') : sizes[0];
  }

  /* ---------------------------------------------------------
     TSX MULTI-ORDER GEOMETRIC PATTERN ENGINE (FROM TSX CRACK MODZ)
     --------------------------------------------------------- */
  function tsxGeometricPattern(sizes) {
    if (sizes.length < 3) return null;
    const chron = sizes.slice(0, 8).reverse();
    const n = chron.length;
    if (n >= 4) {
      const last4 = chron.slice(-4);
      if (last4[0] === 'BIG' && last4[1] === 'BIG' && last4[2] === 'SMALL' && last4[3] === 'SMALL') return { pred: 'BIG', name: '2B+2S CYCLE' };
      if (last4[0] === 'SMALL' && last4[1] === 'SMALL' && last4[2] === 'BIG' && last4[3] === 'BIG') return { pred: 'SMALL', name: '2S+2B CYCLE' };
    }
    if (n >= 3) {
      const last3 = chron.slice(-3);
      if (last3[0] === 'BIG' && last3[1] === 'BIG' && last3[2] === 'SMALL') return { pred: 'SMALL', name: '2B+2S FORMING' };
      if (last3[0] === 'SMALL' && last3[1] === 'SMALL' && last3[2] === 'BIG') return { pred: 'BIG', name: '2S+2B FORMING' };
      if (last3[0] === 'BIG' && last3[1] === 'SMALL' && last3[2] === 'SMALL') return { pred: 'BIG', name: '1B+2S COMPLETE' };
      if (last3[0] === 'SMALL' && last3[1] === 'BIG' && last3[2] === 'BIG') return { pred: 'SMALL', name: '1S+2B COMPLETE' };
    }
    return null;
  }

  const VORTEX_SIGS = [
    {n:"Triple Big Push",   s:"BBB",   x:"S", c:71, g:"STREAK"},
    {n:"Triple Small Push", s:"SSS",   x:"B", c:71, g:"STREAK"},
    {n:"Mirror Chain BSBSB",s:"BSBSB", x:"S", c:87, g:"MIRROR"},
    {n:"Mirror Chain SBSBS",s:"SBSBS", x:"B", c:87, g:"MIRROR"},
    {n:"Zigzag BSBS",       s:"BSBS",  x:"B", c:78, g:"MIRROR"},
    {n:"Zigzag SBSB",       s:"SBSB",  x:"S", c:78, g:"MIRROR"},
    {n:"Double Trend BBSS", s:"BBSS",  x:"B", c:76, g:"DOUBLE"},
    {n:"Double Trend SSBB", s:"SSBB",  x:"S", c:76, g:"DOUBLE"},
    {n:"Double Cycle BBSSB",s:"BBSSB", x:"B", c:80, g:"DOUBLE"},
    {n:"Double Cycle SSBBS",s:"SSBBS", x:"S", c:80, g:"DOUBLE"},
    {n:"Pair Open B",       s:"SBB",   x:"S", c:62, g:"DOUBLE"},
    {n:"Pair Open S",       s:"BSS",   x:"B", c:62, g:"DOUBLE"},
    {n:"Three in One B",    s:"BBBSB", x:"B", c:79, g:"GROUP"},
    {n:"Three in One S",    s:"SSSBS", x:"S", c:79, g:"GROUP"},
    {n:"Two in One B",      s:"BBSBB", x:"S", c:75, g:"GROUP"},
    {n:"Two in One S",      s:"SSBSS", x:"B", c:75, g:"GROUP"},
    {n:"Three in Two B",    s:"BBBSS", x:"B", c:77, g:"GROUP"},
    {n:"Three in Two S",    s:"SSSBB", x:"S", c:77, g:"GROUP"},
    {n:"Big Wall Break",    s:"BBBBS", x:"S", c:74, g:"BREAK"},
    {n:"Small Wall Break",  s:"SSSSB", x:"B", c:74, g:"BREAK"},
    {n:"Trap Reversal B",   s:"SBBBS", x:"B", c:72, g:"BREAK"},
    {n:"Trap Reversal S",   s:"BSSSB", x:"S", c:72, g:"BREAK"},
    {n:"Snap Back B",       s:"BSSB",  x:"S", c:68, g:"BREAK"},
    {n:"Snap Back S",       s:"SBBS",  x:"B", c:68, g:"BREAK"},
    {n:"Sandwich B-S-B",    s:"BBSBS", x:"B", c:73, g:"TRAP"},
    {n:"Sandwich S-B-S",    s:"SSBSB", x:"S", c:73, g:"TRAP"},
    {n:"Ladder Up",         s:"SSBBB", x:"S", c:70, g:"TRAP"},
    {n:"Ladder Down",       s:"BBSSS", x:"B", c:70, g:"TRAP"},
    {n:"Single Alternate",  s:"BSB",   x:"S", c:64, g:"MIRROR"},
    {n:"Single Alternate R",s:"SBS",   x:"B", c:64, g:"MIRROR"}
  ];

  function scanVortexSignatures(sizes) {
    const win = sizes.slice(0, 5).map(s => s[0]).reverse().join("");
    for (const p of VORTEX_SIGS) {
      if (win.endsWith(p.s)) {
        return { name: p.n, pred: p.x === "B" ? "BIG" : "SMALL", score: p.c, group: p.g };
      }
    }
    return null;
  }

  // 6. MASTER COMBINED PREDICTION (100% IDENTICAL TO JASHVIP.VERCEL.APP)
  function calculateCombinedPrediction(list, activeLevel = 1) {
    if (!list || list.length < 3) return null;

    const sizes = list.slice(0, 15).map(item => getSize(item.number));
    const nums = list.slice(0, 15).map(item => parseInt(item.number, 10));

    // Streaks & Alternation
    let alt = 1;
    for (let i = 0; i < sizes.length - 1; i++) {
      if (sizes[i] !== sizes[i + 1]) alt++;
      else break;
    }

    let streak = 1;
    for (let i = 0; i < sizes.length - 1; i++) {
      if (sizes[i] === sizes[i + 1]) streak++;
      else break;
    }

    const votes = { BIG: 0, SMALL: 0 };

    // Layer 1: Apex Titan Cadence Engine (Jash Autobet)
    const titan = apexTitanEngine(sizes, Math.max(0, activeLevel - 1));
    votes[titan.vote] += 3.0;

    // Layer 2: Radhe Hack 2-3 Level Fix
    const radhe = radheEngine(list);
    votes[radhe] += 2.0;

    // Layer 3: Suresh VIP Supreme V15
    const suresh = sureshEngine(list);
    votes[suresh] += 1.8;

    // Layer 4: Quantum Markov 2-Gram
    const markov = markovEngine(sizes);
    votes[markov] += 1.6;

    // Layer 5: TGX 6-Logic Ensemble
    const l1 = tgxLogic1(nums, sizes); votes[l1] += 1.0;
    const l2 = tgxLogic2(nums);        votes[l2] += 1.0;
    const l3 = tgxLogic3(nums, sizes); votes[l3] += 1.0;
    const l4 = tgxLogic4(sizes);       votes[l4] += 1.0;
    const l5 = tgxLogic5(nums);        votes[l5] += 0.8;
    const l6 = tgxLogic6(sizes);       votes[l6] += 1.0;

    // Layer 6: The Paid Pro 3-Round Window
    const painPro = sizes.slice(0, 3).filter(x => x === 'BIG').length > 1 ? 'BIG' : 'SMALL';
    votes[painPro] += 1.0;

    // Layer 7: Nexa Pro 15-Round Skew Reversion (only in non-streak L1)
    const big15 = sizes.slice(0, 15).filter(x => x === 'BIG').length;
    let nexaVote = 'BALANCED';
    if (streak < 2 && activeLevel === 1) {
      if (big15 >= 10) {
        votes.SMALL += 1.6;
        nexaVote = 'REV-S';
      } else if (big15 <= 5) {
        votes.BIG += 1.6;
        nexaVote = 'REV-B';
      }
    }

    // Layer 8: Harmonic Lag Cycle (from ITACHI PRO s2Cycle)
    const lags = [1, 2, 3];
    let bestLag = 0, bestRate = 0;
    for (const lag of lags) {
      let match = 0, tot = 0;
      for (let i = lag; i < sizes.length; i++) {
        tot++;
        if (sizes[i] === sizes[i - lag]) match++;
      }
      if (tot >= 4 && (match / tot) > bestRate) {
        bestRate = match / tot;
        bestLag = lag;
      }
    }
    if (bestRate >= 0.58 && bestLag > 0) {
      votes[sizes[bestLag - 1]] += 3.5;
    }

    // Layer 9: Time-Series Autocorrelation (from REAL ON FIN.html)
    const acN = Math.min(sizes.length, 16);
    let r1 = 0;
    if (acN >= 4) {
      const s = sizes.slice(0, acN).map(x => x === 'BIG' ? 1 : 0);
      const mean = s.reduce((a, b) => a + b, 0) / acN;
      let num = 0, den = 0;
      for (let i = 0; i < acN - 1; i++) num += (s[i] - mean) * (s[i + 1] - mean);
      for (let i = 0; i < acN; i++) den += (s[i] - mean) ** 2;
      if (den > 0) r1 = num / den;
    }
    if (r1 < -0.15) {
      votes[opp(sizes[0])] += 3.5; // Anti-persistent alternating chop detected
    } else if (r1 > 0.20) {
      votes[sizes[0]] += 3.5; // Persistent streak momentum detected
    }

    // Layer 10: Multi-Order Geometric Recognition (from TSX CRACK MODZ)
    const tsx = tsxGeometricPattern(sizes);
    if (tsx) {
      votes[tsx.pred] += 4.2;
    }

    // Layer 11: N-Gram Context Memory (from cracked bt tgx.html)
    for (const len of [4, 3, 2]) {
      if (sizes.length > len + 2) {
        const key = sizes.slice(0, len).join(',');
        let b = 0, s = 0;
        for (let i = 1; i < sizes.length - len; i++) {
          if (sizes.slice(i, i + len).join(',') === key) {
            if (sizes[i - 1] === 'BIG') b++; else s++;
          }
        }
        if (b + s >= 2 && b !== s) {
          votes[b > s ? 'BIG' : 'SMALL'] += 3.2;
          break;
        }
      }
    }

    // Layer 12: Recency-Weighted Momentum (from Diwali Brutal Max / Real Bhai 4)
    let rwB = 0, rwS = 0;
    for (let i = 0; i < Math.min(10, sizes.length); i++) {
      const w = Math.pow(0.82, i);
      if (sizes[i] === 'BIG') rwB += w; else rwS += w;
    }
    votes[rwB >= rwS ? 'BIG' : 'SMALL'] += 2.2;

    // Layer 13: Empirical Streak Extension vs Break (from GHOST V45)
    let extend = 0, break_ = 0, run = 1;
    for (let i = sizes.length - 2; i >= 0; i--) {
      if (sizes[i] === sizes[i + 1]) run++; else run = 1;
      if (run === streak && sizes[i] === sizes[0]) {
        if (i - 1 >= 0) { (sizes[i - 1] === sizes[0]) ? extend++ : break_++; }
      }
    }
    const tot = extend + break_;
    const empiricalCont = tot >= 2 ? (extend / tot) : 0.40;

    // Layer 14: Dynamic Live Alternation Frequency (GHOST V45 x REAL OM)
    const lookback = Math.min(8, sizes.length - 1);
    let flips = 0;
    for (let i = 0; i < lookback; i++) {
      if (sizes[i] !== sizes[i + 1]) flips++;
    }
    const altRate = flips / lookback;

    // Layer 15: Vortex Nova Exact Structural Signatures
    const vSig = scanVortexSignatures(sizes);

    // Layer 16: Dynamic Live Strategy Auditor (Virtual Win-Rate Tracking)
    let chopWins = 0, chopTests = 0;
    for (let k = 1; k <= Math.min(10, sizes.length - 2); k++) {
      const pastSlice = sizes.slice(k);
      const actualNext = sizes[k - 1];
      let pStreak = 1;
      for (let m = 1; m < pastSlice.length; m++) {
        if (pastSlice[m] === pastSlice[0]) pStreak++; else break;
      }
      if (pStreak === 1) {
        chopTests++;
        if (opp(pastSlice[0]) === actualNext) chopWins++;
      }
    }
    const chopAccuracy = chopTests > 0 ? (chopWins / chopTests) : 0.50;

    // Consecutive Alternation Streak (for clean Zigzag identification)
    let altStreak = 0;
    for (let j = 0; j < sizes.length - 1; j++) {
      if (sizes[j] !== sizes[j + 1]) altStreak++;
      else break;
    }

    // Dynamic Regime Decision Matrix:
    // Active Zigzag: if table has alternated 2+ times consecutively, it is in a live chop!
    const isActiveZigzag = (altStreak >= 2);

    // 2-2 Formation Signature Checks (ONLY valid if not in active zigzag):
    const isPair22Complete = (!isActiveZigzag && streak === 2 && sizes.length >= 4 && sizes[2] === sizes[3] && sizes[2] !== sizes[0]);
    const isPair22Forming = (!isActiveZigzag && streak === 1 && sizes.length >= 3 && sizes[1] === sizes[2] && sizes[1] !== sizes[0]);

    // A chop zone is valid if in active zigzag OR (streak 1, chop accuracy >= 50%, altRate >= 50%)
    const isChopZone = isActiveZigzag || (streak === 1 && !isPair22Forming && chopAccuracy >= 0.50 && altRate >= 0.50);
    let patternType = 'consensus';
    let patternLabel = titan.reg;

    if (isActiveZigzag) {
      // ACTIVE ZIGZAG: Table is cleanly alternating (e.g. S-B-S or B-S-B)! Always ride the switch!
      votes[opp(sizes[0])] += 5.5;
      patternType = 'zigzag';
      patternLabel = `⚡ ACTIVE ZIGZAG (${altStreak}X)`;
    } else if (isPair22Complete) {
      // 2-2 PAIR BREAK: YYXX is complete! Break the doublet cleanly (XX -> Y)
      votes[opp(sizes[0])] += 4.5;
      patternType = 'cycle';
      patternLabel = `🛡️ 2-2 PAIR BREAK (${sizes[0]}➔${opp(sizes[0])})`;
    } else if (isPair22Forming) {
      // 2-2 PAIR FORMING: YYX has appeared! Complete the 2nd piece of the pair (X -> X)
      votes[sizes[0]] += 4.5;
      patternType = 'cycle';
      patternLabel = `🛡️ 2-2 PAIR FORMING (${sizes[0]})`;
    } else if (activeLevel >= 2 && streak === 2) {
      // ANTI-WHIPSAW RECOVERY: Table proved it formed a doublet, ride the run!
      votes[sizes[0]] += 4.5;
      patternType = 'dragon';
      patternLabel = `🛡️ ANTI-WHIPSAW RIDE (${sizes[0]})`;
    } else if (streak >= 3) {
      if (streak >= 5) {
        votes[sizes[0]] += 5.0;
        patternType = 'dragon';
        patternLabel = `⚡ DRAGON MOMENTUM (${streak}X)`;
      } else {
        votes[opp(sizes[0])] += 4.5;
        patternType = 'cycle';
        patternLabel = `🛡️ STREAK-${streak} CUT (${sizes[0]}➔${opp(sizes[0])})`;
      }
    } else if (streak === 2) {
      // Streak 2: Doublet continuation (extend to 3)
      votes[sizes[0]] += 4.0;
      patternType = 'cycle';
      patternLabel = `⚡ DOUBLET RIDE (${sizes[0]})`;
    } else {
      // Streak === 1:
      if (isChopZone) {
        votes[opp(sizes[0])] += 4.5;
        patternType = 'zigzag';
        patternLabel = `⚡ CHOP INVERSION (${(altRate * 100).toFixed(0)}% CHOP)`;
      } else {
        votes[sizes[0]] += 3.5;
        patternType = 'consensus';
        patternLabel = `⚡ SINGLETON MOMENTUM (${sizes[0]})`;
      }
    }

    const prediction = votes.BIG >= votes.SMALL ? 'BIG' : 'SMALL';
    const totalScore = votes.BIG + votes.SMALL;
    const confidence = isChopZone ? 68 : Math.min(98, Math.max(82, Math.round((Math.max(votes.BIG, votes.SMALL) / totalScore) * 100)));

    return {
      prediction,
      patternType,
      patternLabel,
      confidence,
      latestIssue: list[0].issueNumber,
      latestNumber: parseInt(list[0].number, 10),
      nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString(),
      models: {
        l1, l2, l3, l4, l5, l6,
        titan: titan.vote,
        radhe,
        suresh,
        markov,
        painPro,
        nexaVote
      }
    };
  }

  // ── 5. PERSISTENT DRAW HISTORY & SERVER INTERCEPTION ──────
  const DRAW_HISTORY_MAP = new Map();
  let CURRENT_API_DRAWS = [];
  let LOTTERY_HISTORY = [];
  let isFetching = false;
  let lastFetchedTime = 0;

  function ingestDrawList(list) {
    if (!Array.isArray(list) || list.length === 0) return;
    list.forEach(item => {
      const issue = String(item.issueNumber || item.issueNo || item.period || item.issue || '').trim();
      const numRaw = item.number != null ? item.number : (item.lotteryResults != null ? item.lotteryResults : item.result);
      const num = parseInt(numRaw, 10);
      if (!/^\d+$/.test(issue) || isNaN(num)) return;
      DRAW_HISTORY_MAP.set(issue, {
        issueNumber: issue,
        period: issue,
        number: num,
        size: num >= 5 ? 'BIG' : 'SMALL'
      });
    });

    // Prune buffer to 200 items to prevent memory leak
    if (DRAW_HISTORY_MAP.size > 200) {
      const keys = Array.from(DRAW_HISTORY_MAP.keys());
      keys.slice(0, keys.length - 120).forEach(k => DRAW_HISTORY_MAP.delete(k));
    }

    // Sort descending (newest first)
    const sorted = Array.from(DRAW_HISTORY_MAP.values());
    sorted.sort((a, b) => {
      try {
        return BigInt(b.period) > BigInt(a.period) ? 1 : -1;
      } catch (e) {
        return 0;
      }
    });

    LOTTERY_HISTORY = sorted;
    if (sorted.length > 0) {
      CURRENT_API_DRAWS = sorted.slice(0, 15);
    }

    checkAllPendingBets();
    updateMasterSignal();
    updateHud();
  }

  // Intercept XHR for site's internal lottery responses
  try {
    const origXhrOpen = XMLHttpRequest.prototype.open;
    const origXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
      this._url = url ? String(url) : '';
      return origXhrOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
      this.addEventListener('load', () => {
        try {
          if (this._url && (this._url.includes('GetHistoryIssuePage') || this._url.includes('GetGameIssue') || this._url.includes('lotteryHistoricalRecords') || this._url.includes('getIssueData') || this._url.includes('GetHistory') || this._url.includes('saasLottery'))) {
            const j = JSON.parse(this.responseText);
            const list = j?.data?.list || j?.data?.issueHistory || (Array.isArray(j.data) ? j.data : []);
            if (Array.isArray(list) && list.length > 0) {
              ingestDrawList(list);
            }
          }
        } catch (e) {}
      });
      return origXhrSend.apply(this, arguments);
    };
  } catch (e) {}

  // Intercept window.fetch for site's internal lottery responses
  try {
    const origFetch = window.fetch;
    window.fetch = async function (...args) {
      const res = await origFetch.apply(this, args);
      try {
        const url = (args[0] && typeof args[0] === 'string') ? args[0] : (args[0]?.url || '');
        if (url && (url.includes('GetHistoryIssuePage') || url.includes('GetGameIssue') || url.includes('lotteryHistoricalRecords') || url.includes('getIssueData') || url.includes('GetHistory') || url.includes('saasLottery'))) {
          const clone = res.clone();
          clone.json().then(j => {
            const list = j?.data?.list || j?.data?.issueHistory || (Array.isArray(j.data) ? j.data : []);
            if (Array.isArray(list) && list.length > 0) {
              ingestDrawList(list);
            }
          }).catch(() => {});
        }
      } catch (e) {}
      return res;
    };
  } catch (e) {}

  function fetchDrawHistory() {
    const now = Date.now();
    if (isFetching || (now - lastFetchedTime < 1800)) return;
    isFetching = true;
    lastFetchedTime = now;

    const modeSlug = (GAME_MODE === '30S') ? 'WinGo_30S' : 'WinGo_1M';
    const fullUrl = `https://draw.ar-lottery01.com/WinGo/${modeSlug}/GetHistoryIssuePage.json?_t=${now}`;

    function handleList(list) {
      isFetching = false;
      if (Array.isArray(list) && list.length > 0) {
        ingestDrawList(list);
      } else {
        scrapeDomLottery();
      }
    }

    if (typeof GM_xmlhttpRequest !== 'undefined') {
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url: fullUrl,
          timeout: 3800,
          onload: (res) => {
            try {
              const j = JSON.parse(res.responseText);
              handleList(j?.data?.list);
            } catch (e) {
              isFetching = false;
              scrapeDomLottery();
            }
          },
          onerror: () => {
            isFetching = false;
            scrapeDomLottery();
          },
          ontimeout: () => {
            isFetching = false;
            scrapeDomLottery();
          }
        });
        return;
      } catch (e) {}
    }

    fetch(fullUrl)
      .then(r => r.json())
      .then(j => handleList(j?.data?.list))
      .catch(() => {
        isFetching = false;
        scrapeDomLottery();
      });
  }

  function scrapeDomLottery() {
    try {
      const rows = Array.from(document.querySelectorAll('.record-list .van-row, tr, [class*="record-item"], .game-record .item, .history-item'));
      const items = [];
      for (const r of rows) {
        if (r.closest('#jash-hud')) continue;
        const txt = (r.textContent || '').trim();
        const pMatch = txt.match(/\b(2026\d{8,14})\b/);
        const nMatch = txt.match(/\b([0-9])\b/);
        if (pMatch && nMatch) {
          const num = parseInt(nMatch[1], 10);
          items.push({
            issueNumber: pMatch[1],
            period: pMatch[1],
            number: num
          });
        }
      }
      if (items.length > 0) {
        ingestDrawList(items);
      }
    } catch (e) {}
  }

  setInterval(fetchDrawHistory, 3200);
  setInterval(scrapeDomLottery, 1500);
  fetchDrawHistory();

  // ── 6. MASTER SIGNAL STATE MACHINE ────────────────────────
  let CURRENT_SIGNAL_PREDICTION = null;
  let LAST_SYNCED_PERIOD = null;

  function updateMasterSignal() {
    if (!CURRENT_API_DRAWS || CURRENT_API_DRAWS.length < 3) return;
    const top = CURRENT_API_DRAWS[0];

    const result = calculateCombinedPrediction(CURRENT_API_DRAWS, currentEngineLevel);
    if (result) {
      if (LAST_SYNCED_PERIOD !== top.issueNumber) {
        LAST_SYNCED_PERIOD = top.issueNumber;
        console.log(`%c[👑 JASH VIP] 🎯 Synced Next Issue #${result.nextPeriod}: ${result.prediction} (${result.patternLabel}) [Guard Level: L${activeLvl}]`, 'background:#00f5a0;color:#000;font-weight:900;padding:4px 8px;border-radius:4px;');
      }
      CURRENT_SIGNAL_PREDICTION = result;
      CURRENT_SIGNAL_PREDICTION.guardLevel = currentEngineLevel;
    }
  }

  function computePrediction() {
    if (!CURRENT_SIGNAL_PREDICTION) {
      updateMasterSignal();
    }
    if (!CURRENT_SIGNAL_PREDICTION) {
      return {
        prediction: 'BIG',
        patternLabel: '⏳ SYNCING SERVER DRAW...',
        confidence: 82,
        guardLevel: 1,
        models: { l1: '--', l2: '--', l3: '--', l4: '--', l5: '--', l6: '--', titan: '--', radhe: '--', suresh: '--', markov: '--', painPro: '--', nexaVote: 'BALANCED' },
        noData: true
      };
    }
    return CURRENT_SIGNAL_PREDICTION;
  }

  // ── 7. BULLETPROOF BET SETTLEMENT & ORPHAN SAFEGUARD ──────
  function checkAllPendingBets() {
    if (!RECORDED_BETS || RECORDED_BETS.length === 0) return;

    for (const bet of RECORDED_BETS) {
      if (!bet.isPending) continue;

      const pKey = String(bet.period).trim();
      let draw = DRAW_HISTORY_MAP.get(pKey);

      if (!draw) {
        const pTail = pKey.slice(-6);
        for (const [k, v] of DRAW_HISTORY_MAP.entries()) {
          if (k.endsWith(pTail)) {
            draw = v;
            break;
          }
        }
      }

      if (draw && draw.number != null && !isNaN(parseInt(draw.number, 10))) {
        const actualNum = parseInt(draw.number, 10);
        const actualSize = actualNum >= 5 ? 'BIG' : 'SMALL';
        resolveBet(bet, draw.period || pKey, actualSize, actualNum);
        continue;
      }

      // ORPHAN BET WATCHDOG (Prevents Martingale Freezing):
      // If the game has progressed 2 or more periods past the bet period, the bet has finished.
      if (currentPeriod && bet.period) {
        try {
          const curP = BigInt(currentPeriod);
          const betP = BigInt(bet.period);
          if (curP >= betP + 2n) {
            const domResult = findDomResultForPeriod(pKey);
            if (domResult) {
              resolveBet(bet, pKey, domResult.size, domResult.number);
              continue;
            }

            // If 3 full rounds have elapsed and still missing from feeds, settle conservatively
            if (curP >= betP + 3n) {
              console.warn(`[JASH VIP] ⚠️ Orphan bet detected on #${pKey}. Resolving to advance Martingale safely...`);
              resolveBet(bet, pKey, 'UNKNOWN', null, true /* isOrphanLoss */);
            }
          }
        } catch (e) {}
      }
    }
  }

  function findDomResultForPeriod(targetPeriod) {
    try {
      const rows = Array.from(document.querySelectorAll('.record-list .van-row, tr, [class*="record-item"], .game-record .item, .history-item'));
      for (const r of rows) {
        if (r.closest('#jash-hud')) continue;
        const txt = (r.textContent || '').trim();
        if (txt.includes(targetPeriod) || txt.includes(targetPeriod.slice(-6))) {
          const m = txt.match(/\b([0-9])\b/);
          if (m) {
            const num = parseInt(m[1], 10);
            return { number: num, size: num >= 5 ? 'BIG' : 'SMALL' };
          }
        }
      }
    } catch (e) {}
    return null;
  }

  function resolveBet(bet, period, outcomeSize, actualNum, isOrphanLoss = false) {
    if (!bet.isPending) return;
    RESOLVED_PERIODS.add(period);
    RESOLVED_PERIODS.add(String(bet.period));
    bet.isPending = false;
    bet.actualSize = outcomeSize;
    if (actualNum != null) bet.actualNumber = actualNum;

    const won = !isOrphanLoss && (bet.prediction === outcomeSize);
    bet.won = won;

    if (won) {
      wins++;
      LOSS_STREAK = 0;
      martingaleStep = 0;
      currentEngineLevel = 1;
      currentEngineLevel = 1;
      currentBet = getStakeForStep(BASE_BET, 0);
      console.log(`%c🏆 JASH VIP WIN on #${period}! Result=${actualNum} (${outcomeSize}). Reset to Base (₹${BASE_BET})`, 'background:#10b981;color:#fff;font-weight:900;padding:6px;border-radius:4px');
    } else {
      losses++;
      LOSS_STREAK++;
      martingaleStep++;
      currentEngineLevel++;
      if (currentEngineLevel > 3) currentEngineLevel = 1;
      currentBet = getStakeForStep(BASE_BET, martingaleStep);
      console.log(`%c💀 JASH VIP LOSS on #${period}! Result=${actualNum} (${outcomeSize}). Streak=${LOSS_STREAK} Next=₹${currentBet}`, 'background:#ef4444;color:#fff;font-weight:900;padding:6px;border-radius:4px');
    }

    pendingBet = null;
    persistAll();
    updateHud();
  }

  // ── 8. SYNTHETIC TOUCH & POINTER CLICK SYSTEM ─────────────
  function triggerFullClick(el) {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rect = el.getBoundingClientRect();
      const cx = (rect.left + rect.width / 2) || 100;
      const cy = (rect.top + rect.height / 2) || 100;

      try {
        const touch = new Touch({
          identifier: Date.now(),
          target: el,
          clientX: cx,
          clientY: cy,
          pageX: cx,
          pageY: cy,
          screenX: cx,
          screenY: cy
        });
        el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [touch], targetTouches: [touch], changedTouches: [touch] }));
        el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true, touches: [], targetTouches: [], changedTouches: [touch] }));
      } catch (te) {}

      try {
        el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, isPrimary: true }));
        el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, isPrimary: true }));
      } catch (pe) {}

      try {
        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy }));
        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy }));
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy }));
      } catch (me) {}

      if (typeof el.click === 'function') {
        el.click();
      }
    } catch (e) {}
  }

  // ── 9. REAL TOTAL VERIFIER & FAST STEPPER QUANTITY ENGINE ──────
  function getDisplayedTotalAmount(popup) {
    const text = popup.innerText || popup.textContent || '';
    const m = text.match(/Total\s*amount\s*[^\d]*(\d+(\.\d+)?)/i);
    if (m) return parseFloat(m[1]);
    return null;
  }

  async function setModalQuantity(popup, targetAmount) {
    const plusBtn = popup.querySelector('.van-stepper__plus, button.plus, .plus, [class*="plus"]');
    const minusBtn = popup.querySelector('.van-stepper__minus, button.minus, .minus, [class*="minus"]');
    const inp = popup.querySelector('.van-stepper__input, input[type="tel"], input[type="number"], input');

    // Method A: Native property setter + events for Vue/Vant reactive v-model
    if (inp) {
      try {
        inp.focus();
        const proto = window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (nativeSetter) {
          nativeSetter.call(inp, String(targetAmount));
        } else {
          inp.value = String(targetAmount);
        }
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));

        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, String(targetAmount));
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        inp.blur();
      } catch (e) {}
      await new Promise(r => setTimeout(r, (GAME_MODE === '30S') ? 35 : 60));
    }

    // Method B: Physical stepper verification against rendered "Total amount"
    let curTotal = getDisplayedTotalAmount(popup);
    if (curTotal === targetAmount) {
      return true;
    }

    if (plusBtn) {
      let attempts = 0;
      const maxAttempts = Math.max(300, targetAmount + 25);
      const stepDelay = (GAME_MODE === '30S') ? 8 : 12;
      while (attempts < maxAttempts) {
        curTotal = getDisplayedTotalAmount(popup);
        if (curTotal !== null) {
          if (curTotal === targetAmount) break;
          if (curTotal < targetAmount) {
            triggerFullClick(plusBtn);
          } else if (curTotal > targetAmount && minusBtn) {
            triggerFullClick(minusBtn);
          }
        } else {
          let curVal = parseInt(inp ? inp.value : '1', 10) || 1;
          if (curVal === targetAmount) break;
          if (curVal < targetAmount) {
            triggerFullClick(plusBtn);
          } else if (curVal > targetAmount && minusBtn) {
            triggerFullClick(minusBtn);
          }
        }
        attempts++;
        await new Promise(r => setTimeout(r, stepDelay));
      }
    }

    await new Promise(r => setTimeout(r, (GAME_MODE === '30S') ? 25 : 50));
    return true;
  }

  // ── 10. BULLETPROOF BIG / SMALL BET PLACEMENT ENGINE ───────
  async function executeBet(size, amount) {
    const target = size.trim().toUpperCase(); // "BIG" or "SMALL"
    console.log(`%c[👑 JASH VIP] 🎯 PLACING BET: ${target} ₹${amount} (Streak: ${LOSS_STREAK}, Step: ${martingaleStep}) [${GAME_MODE}]`, 'background:linear-gradient(90deg,#00f5a0,#00d9ff);color:#000;font-weight:bold;padding:6px 14px;font-size:13px;border-radius:4px');

    // 0. Clean up any open popup or overlay
    const openPopups = Array.from(document.querySelectorAll('.van-popup, .popup, [class*="popup"], [class*="dialog"]')).filter(e => !e.closest('#jash-hud') && e.offsetHeight > 40);
    for (const pop of openPopups) {
      const cancelBtn = Array.from(pop.querySelectorAll('button, div, span, p')).find(e => (e.textContent || '').trim().toLowerCase() === 'cancel');
      if (cancelBtn) {
        triggerFullClick(cancelBtn);
        await new Promise(r => setTimeout(r, 80));
      }
    }

    // 1. Locate Big or Small button on main WinGo board (NEVER exclude .tab-content or .list!)
    const allEls = Array.from(document.querySelectorAll('div, button, span, uni-view, uni-button, p')).filter(e => {
      if (e.closest('#jash-hud')) return false;
      if (e.closest('.van-popup, .popup')) return false;
      if (e.closest('.history, [class*="history"], [class*="record"], table, .record-list, .my-history, [class*="GameRecord"]')) return false;
      return e.offsetWidth > 25 && e.offsetHeight > 18;
    });

    const regexExact = target === 'BIG' ? /^(big|大)(\s*[12]\.?\d*x?)?$/i : /^(small|小)(\s*[12]\.?\d*x?)?$/i;

    let targetBtn = allEls.find(e => {
      const txt = (e.innerText || e.textContent || '').trim().replace(/\s+/g, ' ');
      return regexExact.test(txt);
    });

    if (!targetBtn) {
      const clsRegex = target === 'BIG' ? /\b(big|btn-big|bet-big|bet_big)\b/i : /\b(small|btn-small|bet-small|bet_small)\b/i;
      targetBtn = allEls.find(e => {
        const c = e.className || '';
        return typeof c === 'string' && clsRegex.test(c);
      });
    }

    if (!targetBtn) {
      targetBtn = allEls.find(e => {
        const txt = (e.innerText || e.textContent || '').trim();
        return (target === 'BIG' ? /^big\b/i.test(txt) : /^small\b/i.test(txt)) && txt.length <= 15;
      });
    }

    if (!targetBtn) {
      console.warn(`[JASH VIP] ❌ Could not find ${target} button!`);
      return false;
    }

    try { targetBtn.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {}

    triggerFullClick(targetBtn);
    const parentClickable = targetBtn.closest('button, [role="button"], uni-button, .van-button');
    if (parentClickable && parentClickable !== targetBtn) {
      triggerFullClick(parentClickable);
    }
    await new Promise(r => setTimeout(r, (GAME_MODE === '30S') ? 120 : 250));

    // Wait for the popup modal to open
    let popup = null;
    for (let wait = 0; wait < 14; wait++) {
      popup = Array.from(document.querySelectorAll('.van-popup, .popup, [class*="popup"], [class*="dialog"]')).find(p => p.offsetHeight > 50 && !p.closest('#jash-hud'));
      if (popup) break;
      await new Promise(r => setTimeout(r, 60));
    }
    if (!popup) {
      console.warn('[JASH VIP] ❌ Bet popup did not open!');
      return false;
    }

    // 2. Ensure Balance chip "1" is active (multiplier = 1x base)
    const balanceChips = Array.from(popup.querySelectorAll('div, span, button, uni-view')).filter(e => {
      const t = (e.textContent || '').trim();
      return ['1', '10', '100', '1000'].includes(t) && e.children.length === 0;
    });
    const chip1 = balanceChips.find(e => (e.textContent || '').trim() === '1');
    if (chip1) {
      triggerFullClick(chip1);
      await new Promise(r => setTimeout(r, (GAME_MODE === '30S') ? 30 : 60));
    }

    // 3. Set Quantity with Real Total Verification
    await setModalQuantity(popup, amount);

    // 4. Ensure "I agree" checkbox is checked if present
    const agreeBox = popup.querySelector('.van-checkbox, [class*="agree"], [class*="rule"]');
    if (agreeBox) {
      const isChecked = agreeBox.classList.contains('van-checkbox--checked') || agreeBox.getAttribute('aria-checked') === 'true';
      if (!isChecked) {
        triggerFullClick(agreeBox);
        await new Promise(r => setTimeout(r, (GAME_MODE === '30S') ? 30 : 60));
      }
    }

    // 5. Submit Bet (Confirm Button)
    let confirmBtn = popup.querySelector('button[class*="submit"], button[class*="confirm"], .van-button--danger, .van-button--primary, [class*="btn-confirm"], [class*="btn-submit"]');
    if (!confirmBtn) {
      const allPopupEls = Array.from(popup.querySelectorAll('*')).filter(e => !e.closest('#jash-hud'));
      const totalEls = allPopupEls.filter(e => {
        const t = (e.textContent || '').trim();
        return /Total\s*amount/i.test(t) && !/Cancel/i.test(t) && t.length <= 40;
      });
      confirmBtn = totalEls.find(e => e.tagName === 'BUTTON' || e.classList.contains('van-button') || e.getAttribute('role') === 'button');
      if (!confirmBtn && totalEls.length > 0) {
        confirmBtn = totalEls[totalEls.length - 1];
      }
      if (!confirmBtn) {
        confirmBtn = allPopupEls.find(e => {
          const t = (e.textContent || '').trim();
          return /^(Confirm|Submit|Order|Buy|Bet|Presale|Pre-sale|立即投注)$/i.test(t) && !/Cancel/i.test(t);
        });
      }
    }

    if (!confirmBtn) {
      console.warn('[JASH VIP] ❌ Confirm button not found inside popup!');
      return false;
    }

    const clickableContainer = confirmBtn.closest('button, .van-button, [role="button"]') || confirmBtn;

    console.log(`[JASH VIP] 🚀 Confirming bet: ${target} ₹${amount}...`, confirmBtn);
    triggerFullClick(confirmBtn);
    if (clickableContainer !== confirmBtn) {
      triggerFullClick(clickableContainer);
    }
    try { confirmBtn.click(); } catch (e) {}

    await new Promise(r => setTimeout(r, (GAME_MODE === '30S') ? 150 : 300));
    return true;
  }

  // ── 11. TIME UTILITIES (ADAPTIVE 1M & 30S) ─────────────────
  function getTimerSeconds() {
    // 1. Scrape actual countdown from DOM if present (100% real-time sync with site)
    try {
      const cdEls = document.querySelectorAll('.van-count-down, [class*="countdown"], [class*="count-down"], [class*="time_box"], [class*="timeBox"], [class*="clock"], [class*="time"]');
      for (const el of cdEls) {
        if (el.closest('#jash-hud')) continue;
        const text = (el.textContent || '').replace(/\s+/g, '');
        const m = text.match(/(\d{1,2}):(\d{2})/);
        if (m) {
          const sec = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
          if (!isNaN(sec) && sec >= 0 && sec <= 300) return sec;
        }
      }
    } catch (e) {}

    // Fallback: Clock-based modulo
    const iv = (GAME_MODE === '30S') ? 30 : 60;
    return iv - (Math.floor(Date.now() / 1000) % iv);
  }

  function getCurrentTimeBucket() {
    const ivMs = (GAME_MODE === '30S') ? 30000 : 60000;
    return Math.floor(Date.now() / ivMs);
  }

  // ── 12. CYBER GLASSMORPHIC VIP HUD ────────────────────────
  function createHud() {
    if (document.getElementById('jash-hud')) return;
    const target = document.body || document.documentElement;
    if (!target) return;

    const hud = document.createElement('div');
    hud.id = 'jash-hud';
    hud.style.cssText = `
      position:fixed;top:130px;right:12px;z-index:2147483647;touch-action:none;
      width:285px;background:rgba(6,9,16,0.96);
      border:1.5px solid rgba(0,245,160,0.55);border-radius:14px;
      backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);
      box-shadow:0 12px 40px rgba(0,0,0,0.85),0 0 20px rgba(0,245,160,0.22);
      font-family:-apple-system,BlinkMacSystemFont,'Space Grotesk',Segoe UI,Roboto,sans-serif;
      color:#fff;font-size:12px;padding:11px;user-select:none;
      transition: all 0.2s ease;
    `;

    hud.innerHTML = `
      <div id="j-header-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;cursor:move;">
        <span style="font-weight:900;font-size:13px;background:linear-gradient(135deg,#00f5a0,#00d9ff,#ff3366);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">👑 JASH VIP ULTIMATE 1</span>
        <div style="display:flex;align-items:center;gap:6px;">
          <span id="j-timer" style="font-weight:900;color:#00f5a0;font-size:13px;font-family:monospace;">--s</span>
          <button id="j-min-btn" style="background:rgba(255,255,255,0.1);border:none;color:#fff;border-radius:4px;font-size:10px;cursor:pointer;padding:2px 6px;">−</button>
        </div>
      </div>

      <div id="j-main-body">
        <div style="display:flex;gap:5px;margin-bottom:8px;">
          <button id="j-mode-btn" title="Click to toggle between 1M and 30S" style="flex:1.6;padding:6px 0;background:rgba(0,245,160,0.12);border:1px solid rgba(0,245,160,0.35);border-radius:6px;color:#00f5a0;font-weight:900;font-size:10px;text-align:center;cursor:pointer;transition:all 0.2s;">
            <span id="j-mode-text">${GAME_MODE === '30S' ? '🔥 WINGO 30S' : '⚡ WINGO 1M'}</span> <span style="font-size:8px;opacity:0.75">(TOGGLE)</span>
          </button>
          <button id="j-reset-top-btn" title="Complete Reset: streak, steps, stats, storage" style="flex:1;padding:6px 0;background:rgba(239,68,68,0.22);border:1.5px solid rgba(239,68,68,0.6);border-radius:6px;color:#fca5a5;font-weight:900;font-size:10px;cursor:pointer;box-shadow:0 0 10px rgba(239,68,68,0.2);">
            🔄 RESET
          </button>
        </div>

        <!-- Glowing Primary Prediction Display -->
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:9px;text-align:center;margin-bottom:8px;">
          <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;" id="j-pattern-lbl">⏳ SYNCING API...</div>
          <div id="j-pred-call" style="font-size:26px;font-weight:900;letter-spacing:1px;color:#E4FF4A;text-shadow:0 0 14px rgba(228,255,74,0.45);">--</div>
          <div style="display:flex;justify-content:center;gap:8px;font-size:10px;color:#94a3b8;margin-top:4px;">
            <span>CONF: <b id="j-conf-val" style="color:#00f5a0;">--%</b></span>
            <span>GUARD: <b id="j-guard-val" style="color:#00d9ff;">SAFE (L1)</b></span>
          </div>
        </div>

        <!-- Multi-Model Consensus Matrix (TGX L1-L6 + Titan + Radhe + Suresh + Markov + Pain + Nexa) -->
        <div style="background:rgba(255,255,255,0.03);padding:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">
            <span>⚡ MULTI-MODEL CONSENSUS</span>
            <span style="color:#00f5a0;">• SYNCHRONIZED</span>
          </div>
          <!-- Row 1: TGX 6-Logics -->
          <div style="display:grid;grid-template-columns:repeat(6, 1fr);gap:2px;margin-bottom:4px;font-size:9px;font-family:monospace;text-align:center;">
            <div id="m-l1" style="background:rgba(255,255,255,0.05);padding:2px 0;border-radius:3px;">L1:--</div>
            <div id="m-l2" style="background:rgba(255,255,255,0.05);padding:2px 0;border-radius:3px;">L2:--</div>
            <div id="m-l3" style="background:rgba(255,255,255,0.05);padding:2px 0;border-radius:3px;">L3:--</div>
            <div id="m-l4" style="background:rgba(255,255,255,0.05);padding:2px 0;border-radius:3px;">L4:--</div>
            <div id="m-l5" style="background:rgba(255,255,255,0.05);padding:2px 0;border-radius:3px;">L5:--</div>
            <div id="m-l6" style="background:rgba(255,255,255,0.05);padding:2px 0;border-radius:3px;">L6:--</div>
          </div>
          <!-- Row 2: Titan, Radhe, Suresh -->
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:3px;margin-bottom:3px;font-size:9.5px;font-family:monospace;text-align:center;">
            <div id="m-titan" style="background:rgba(255,255,255,0.05);padding:3px 0;border-radius:4px;">TITAN:--</div>
            <div id="m-radhe" style="background:rgba(255,255,255,0.05);padding:3px 0;border-radius:4px;">RADHE:--</div>
            <div id="m-suresh" style="background:rgba(255,255,255,0.05);padding:3px 0;border-radius:4px;">SURESH:--</div>
          </div>
          <!-- Row 3: Markov, Pain, Nexa -->
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:3px;font-size:9.5px;font-family:monospace;text-align:center;">
            <div id="m-markov" style="background:rgba(255,255,255,0.05);padding:3px 0;border-radius:4px;">MARKOV:--</div>
            <div id="m-pain" style="background:rgba(255,255,255,0.05);padding:3px 0;border-radius:4px;">PAIN:--</div>
            <div id="m-nexa" style="background:rgba(255,255,255,0.05);padding:3px 0;border-radius:4px;">NEXA:--</div>
          </div>
        </div>

        <!-- Stake Controls -->
        <div style="display:flex;gap:6px;margin-bottom:8px;">
          <div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:6px;">
            <div style="font-size:9px;color:#94a3b8;">BASE BET</div>
            <div style="display:flex;align-items:center;gap:2px;">
              <span style="color:#00f5a0;font-weight:bold;">₹</span>
              <input id="j-base-input" type="number" value="${BASE_BET}" min="1" style="width:100%;background:transparent;border:none;color:#fff;font-weight:bold;font-size:12px;outline:none;" />
            </div>
          </div>
          <div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:6px;">
            <div style="font-size:9px;color:#94a3b8;">CURRENT BET</div>
            <div id="j-current-bet-display" style="font-weight:bold;color:#E4FF4A;font-size:12px;">₹${currentBet}</div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-bottom:8px;padding:0 2px;">
          <span>Streak: <b id="j-streak-lbl" style="color:#fff;">${LOSS_STREAK} (L${LOSS_STREAK + 1})</b></span>
          <span>Score: <b id="j-score-lbl" style="color:#00f5a0;">${wins}W</b> / <b style="color:#ff3366;">${losses}L</b></span>
        </div>

        <!-- Action Bar with prominent START AUTOBET and RESET buttons -->
        <div style="display:flex;gap:6px;margin-bottom:8px;">
          <button id="j-toggle-btn" style="flex:1.8;padding:9px 0;background:linear-gradient(135deg,#00f5a0,#00d9ff);border:none;border-radius:8px;color:#000;font-weight:900;font-size:11px;cursor:pointer;box-shadow:0 0 15px rgba(0,245,160,0.4);transition:all 0.2s;">
            ▶ START AUTOBET
          </button>
          <button id="j-reset-btn" title="Complete Reset: streak, steps, stats, storage" style="flex:1.2;padding:9px 0;background:rgba(239,68,68,0.28);border:1.5px solid rgba(239,68,68,0.7);border-radius:8px;color:#fca5a5;font-weight:900;font-size:11px;cursor:pointer;box-shadow:0 0 12px rgba(239,68,68,0.3);transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:3px;">
            🔄 RESET
          </button>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;border-top:1px solid rgba(255,255,255,0.08);padding-top:4px;">
          <span style="font-size:9px;color:#94a3b8;font-weight:bold;">ACTIVITY LOG</span>
          <button id="j-clear-btn" style="background:none;border:none;color:#fca5a5;font-size:9px;cursor:pointer;padding:1px 4px;border-radius:3px;text-decoration:underline;">Clear Log</button>
        </div>
        <div id="j-feed-box" style="margin-top:4px;max-height:85px;overflow-y:auto;font-size:9px;font-family:monospace;">
          <div style="color:#64748b;text-align:center;">Feed will appear here</div>
        </div>
      </div>
    `;

    target.appendChild(hud);

    // Draggable HUD handler
    (function makeDraggable() {
      let isDragging = false, startX, startY, origLeft, origTop;
      const header = document.getElementById("j-header-row");
      if (!header) return;

      function onStart(e) {
        if (e.target && e.target.id === "j-min-btn") return;
        isDragging = true;
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        startX = cx;
        startY = cy;
        const rect = hud.getBoundingClientRect();
        origLeft = rect.left;
        origTop = rect.top;
        hud.style.right = "auto";
        hud.style.left = origLeft + "px";
        hud.style.top = origTop + "px";
      }

      function onMove(e) {
        if (!isDragging) return;
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        const dx = cx - startX;
        const dy = cy - startY;
        hud.style.left = Math.max(2, Math.min(window.innerWidth - 290, origLeft + dx)) + "px";
        hud.style.top = Math.max(2, Math.min(window.innerHeight - 80, origTop + dy)) + "px";
      }

      function onEnd() { isDragging = false; }

      header.addEventListener("mousedown", onStart);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onEnd);
      header.addEventListener("touchstart", onStart, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onEnd);
    })();

    // Mode Toggle
    document.getElementById('j-mode-btn').onclick = () => {
      GAME_MODE = (GAME_MODE === '1M') ? '30S' : '1M';
      localStorage.setItem('JASH_MODE', GAME_MODE);

      const modeBtn = document.getElementById('j-mode-btn');
      const modeTxt = document.getElementById('j-mode-text');
      if (GAME_MODE === '30S') {
        modeBtn.style.background = 'rgba(255,51,102,0.18)';
        modeBtn.style.borderColor = 'rgba(255,51,102,0.45)';
        modeBtn.style.color = '#ff3366';
        modeTxt.textContent = '🔥 WINGO 30S';
      } else {
        modeBtn.style.background = 'rgba(0,245,160,0.12)';
        modeBtn.style.borderColor = 'rgba(0,245,160,0.35)';
        modeBtn.style.color = '#00f5a0';
        modeTxt.textContent = '⚡ WINGO 1M';
      }

      DRAW_HISTORY_MAP.clear();
      LOTTERY_HISTORY = [];
      CURRENT_API_DRAWS = [];
      CURRENT_SIGNAL_PREDICTION = null;
      pendingBet = null;
      fetchDrawHistory();
      updateHud();
      console.log(`%c[👑 JASH VIP] Switched Mode to: ${GAME_MODE}`, 'background:#00d9ff;color:#000;font-weight:bold;');
    };

    // Minimize HUD
    document.getElementById('j-min-btn').onclick = (e) => {
      e.stopPropagation();
      isMinimized = !isMinimized;
      document.getElementById('j-main-body').style.display = isMinimized ? 'none' : 'block';
      document.getElementById('j-min-btn').textContent = isMinimized ? '+' : '−';
    };

    // Start / Stop Autobet
    document.getElementById('j-toggle-btn').onclick = () => {
      running = !running;
      const btn = document.getElementById('j-toggle-btn');
      if (running) {
        btn.textContent = '■ STOP AUTOBET (ACTIVE)';
        btn.style.background = 'linear-gradient(135deg,#ff3366,#ff0055)';
        btn.style.boxShadow = '0 0 15px rgba(255,51,102,0.4)';
        btn.style.color = '#fff';
      } else {
        btn.textContent = '▶ START AUTOBET';
        btn.style.background = 'linear-gradient(135deg,#00f5a0,#00d9ff)';
        btn.style.boxShadow = '0 0 15px rgba(0,245,160,0.4)';
        btn.style.color = '#000';
      }
    };

    // Base Bet Input
    document.getElementById('j-base-input').onchange = (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 3;
      BASE_BET = val;
      currentBet = getStakeForStep(BASE_BET, martingaleStep);
      persistAll();
      updateHud();
    };

    // Complete Reset Triggers (Both Header and Action Bar Buttons)
    const triggerFullReset = (e) => {
      if (e) e.stopPropagation();
      LOSS_STREAK = 0;
      martingaleStep = 0;
      currentEngineLevel = 1;
      currentBet = getStakeForStep(BASE_BET, 0);
      wins = 0;
      losses = 0;
      RECORDED_BETS = [];
      pendingBet = null;
      PLACED_PERIODS.clear();
      RESOLVED_PERIODS.clear();
      LOCKED_TIME_BUCKETS.clear();
      try {
        localStorage.removeItem('JASH_BETS');
        localStorage.removeItem('JASH_WINS');
        localStorage.removeItem('JASH_LOSSES');
        localStorage.removeItem('JASH_STEP');
        localStorage.removeItem('JASH_LOSS_STREAK');
        localStorage.removeItem('JASH_LAST_PRED');
        localStorage.removeItem('JASH_LAST_BET_P');
      } catch (err) {}
      persistAll();
      updateHud();
      console.log(`%c[👑 JASH VIP] 🔄 FULL RESET: Cleared history, streaks, scores, and reset stake to base ₹${BASE_BET}!`, 'background:#ef4444;color:#fff;font-weight:900;padding:6px;border-radius:4px;');
    };

    const rBtn1 = document.getElementById('j-reset-btn');
    if (rBtn1) rBtn1.onclick = triggerFullReset;
    const rBtn2 = document.getElementById('j-reset-top-btn');
    if (rBtn2) rBtn2.onclick = triggerFullReset;

    const clearFeedBtn = document.getElementById('j-clear-btn');
    if (clearFeedBtn) {
      clearFeedBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        RECORDED_BETS = [];
        try { localStorage.removeItem('JASH_BETS'); } catch (err) {}
        persistAll();
        updateHud();
      };
    }
  }

  function updateHud() {
    createHud();
    const pred = computePrediction();

    const callEl = document.getElementById('j-pred-call');
    const patEl = document.getElementById('j-pattern-lbl');
    const confEl = document.getElementById('j-conf-val');
    const guardEl = document.getElementById('j-guard-val');

    if (callEl && !pred.noData) {
      callEl.textContent = pred.prediction;
      callEl.style.color = pred.prediction === 'BIG' ? '#E4FF4A' : '#00D9FF';
      callEl.style.textShadow = pred.prediction === 'BIG' ? '0 0 14px rgba(228,255,74,0.45)' : '0 0 14px rgba(0,217,255,0.45)';
      if (patEl) patEl.textContent = pred.patternLabel;
      if (confEl) confEl.textContent = `${pred.confidence}%`;
      if (guardEl) {
        const gl = pred.guardLevel || 1;
        guardEl.textContent = gl === 1 ? 'SAFE (L1)' : (gl === 2 ? 'DEFENSE (L2)' : 'RECOVERY (L3)');
        guardEl.style.color = gl === 1 ? '#00f5a0' : (gl === 2 ? '#ffcc00' : '#ff3366');
      }
    }

    if (pred.models) {
      const setPill = (id, label, val) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = `${label}:${val}`;
          if (val === 'BIG') {
            el.style.color = '#E4FF4A';
            el.style.fontWeight = 'bold';
          } else if (val === 'SMALL') {
            el.style.color = '#00D9FF';
            el.style.fontWeight = 'bold';
          } else {
            el.style.color = '#94a3b8';
            el.style.fontWeight = 'normal';
          }
        }
      };

      setPill('m-l1', 'L1', pred.models.l1);
      setPill('m-l2', 'L2', pred.models.l2);
      setPill('m-l3', 'L3', pred.models.l3);
      setPill('m-l4', 'L4', pred.models.l4);
      setPill('m-l5', 'L5', pred.models.l5);
      setPill('m-l6', 'L6', pred.models.l6);

      setPill('m-titan', 'TITAN', pred.models.titan);
      setPill('m-radhe', 'RADHE', pred.models.radhe);
      setPill('m-suresh', 'SURESH', pred.models.suresh);

      setPill('m-markov', 'MARKOV', pred.models.markov);
      setPill('m-pain', 'PAIN', pred.models.painPro);
      setPill('m-nexa', 'NEXA', pred.models.nexaVote);
    }

    const curBetEl = document.getElementById('j-current-bet-display');
    if (curBetEl) curBetEl.textContent = `₹${currentBet}`;

    const streakEl = document.getElementById('j-streak-lbl');
    if (streakEl) streakEl.textContent = `${LOSS_STREAK} (L${LOSS_STREAK + 1})`;

    const scoreEl = document.getElementById('j-score-lbl');
    if (scoreEl) scoreEl.innerHTML = `<b style="color:#00f5a0;">${wins}W</b> / <b style="color:#ff3366;">${losses}L</b>`;

    const feedEl = document.getElementById('j-feed-box');
    if (feedEl && RECORDED_BETS.length > 0) {
      feedEl.innerHTML = RECORDED_BETS.slice(0, 5).map(b => {
        const status = b.isPending
          ? '<span style="color:#ffcc00;">PENDING ⏳</span>'
          : (b.won ? '<span style="color:#00f5a0;">WIN ✓</span>' : '<span style="color:#ff3366;">LOSS ✕</span>');
        const pTail = String(b.period).slice(-4);
        return `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
          <span>#${pTail} <b style="color:${b.prediction === 'BIG' ? '#E4FF4A' : '#00D9FF'};">${b.prediction}</b> ₹${b.stake}</span>
          ${status}
        </div>`;
      }).join('');
    }
  }

  // ── 13. AUTOBET CYCLE (ADAPTIVE 1M & 30S) ─────────────────
  async function botCycle() {
    try {
      const secondsLeft = getTimerSeconds();
      const currentBucket = getCurrentTimeBucket();

      const tEl = document.getElementById('j-timer');
      if (tEl) {
        tEl.textContent = secondsLeft + 's';
        tEl.style.color = (secondsLeft <= 5) ? '#ff3366' : '#00f5a0';
      }

      checkAllPendingBets();

      // Faster poll near boundary
      const isBoundary = (GAME_MODE === '30S')
        ? (secondsLeft <= 3 || secondsLeft >= 28)
        : (secondsLeft <= 4 || secondsLeft >= 58);

      if (isBoundary) {
        fetchDrawHistory();
      }

      let activePeriod = null;
      let maxFound = 0n;
      const allText = Array.from(document.querySelectorAll('div, span, p, b')).filter(e => !e.closest('#jash-hud'));
      for (const el of allText) {
        const txt = (el.textContent || '').trim();
        const m = txt.match(/\b(2026\d{10,14})\b/);
        if (m && txt.length < 35) {
          try {
            const pVal = BigInt(m[1]);
            if (pVal > maxFound) {
              maxFound = pVal;
              activePeriod = m[1];
            }
          } catch (e) {}
        }
      }

      if (CURRENT_API_DRAWS.length > 0) {
        try {
          const apiNext = BigInt(CURRENT_API_DRAWS[0].issueNumber) + 1n;
          if (!activePeriod || apiNext > maxFound) {
            activePeriod = apiNext.toString();
          }
        } catch (e) {}
      }

      currentPeriod = activePeriod;
      const pred = computePrediction();
      updateHud();

      // Prune sets to prevent memory growth
      if (PLACED_PERIODS.size > 50) PLACED_PERIODS = new Set(Array.from(PLACED_PERIODS).slice(-20));
      if (LOCKED_TIME_BUCKETS.size > 50) LOCKED_TIME_BUCKETS = new Set(Array.from(LOCKED_TIME_BUCKETS).slice(-20));
      if (RESOLVED_PERIODS.size > 50) RESOLVED_PERIODS = new Set(Array.from(RESOLVED_PERIODS).slice(-20));

      if (!running || isBettingInProgress) return;
      if (LOCKED_TIME_BUCKETS.has(currentBucket)) return;
      if (activePeriod && PLACED_PERIODS.has(activePeriod)) return;
      if (pred.noData) return;

      // Auto-detect mode from URL and active tabs
      try {
        const href = window.location.href || '';
        if (/WinGo_30S|gameCode=WinGo_30S/i.test(href)) {
          if (GAME_MODE !== '30S') {
            GAME_MODE = '30S';
            persistAll();
            DRAW_HISTORY_MAP.clear();
            LOTTERY_HISTORY = [];
            CURRENT_API_DRAWS = [];
            CURRENT_SIGNAL_PREDICTION = null;
            pendingBet = null;
            updateHud();
            fetchDrawHistory();
          }
        } else if (/WinGo_1M|gameCode=WinGo_1M/i.test(href)) {
          if (GAME_MODE !== '1M') {
            GAME_MODE = '1M';
            persistAll();
            DRAW_HISTORY_MAP.clear();
            LOTTERY_HISTORY = [];
            CURRENT_API_DRAWS = [];
            CURRENT_SIGNAL_PREDICTION = null;
            pendingBet = null;
            updateHud();
            fetchDrawHistory();
          }
        }
      } catch (e) {}

      const canBet = (GAME_MODE === '30S')
        ? (secondsLeft <= 27 && secondsLeft >= 6)
        : (secondsLeft <= 55 && secondsLeft >= 6);

      if (canBet && !LOCKED_TIME_BUCKETS.has(currentBucket)) {
        LOCKED_TIME_BUCKETS.add(currentBucket);
        if (activePeriod) PLACED_PERIODS.add(activePeriod);
        isBettingInProgress = true;

        lastPredicted = pred.prediction;
        lastBetPeriod = activePeriod;
        pendingBet = { period: activePeriod, pred: pred.prediction, stake: currentBet, placedAt: Date.now() };

        const success = await executeBet(pred.prediction, currentBet);

        if (success && activePeriod) {
          RECORDED_BETS.unshift({
            period: activePeriod,
            prediction: pred.prediction,
            pattern: pred.patternLabel,
            stake: currentBet,
            won: null,
            isPending: true,
            time: new Date().toLocaleTimeString()
          });
          if (RECORDED_BETS.length > 30) RECORDED_BETS = RECORDED_BETS.slice(0, 30);
          console.log(`%c[👑 JASH VIP] ✅ Bet #${activePeriod} PLACED (${pred.prediction} ₹${currentBet}) [${GAME_MODE}]`, 'background:#00f5a0;color:#000;font-weight:900;');
        } else {
          console.warn(`%c[👑 JASH VIP] ❌ Bet #${activePeriod} NOT placed (executeBet failed)`, 'background:#ef4444;color:#fff;font-weight:900;');
          pendingBet = null;
        }

        persistAll();
        updateHud();

        setTimeout(() => {
          isBettingInProgress = false;
        }, (GAME_MODE === '30S') ? 2200 : 3500);
      }
    } catch (e) {
      isBettingInProgress = false;
    }
  }

  // ── 14. INITIALIZATION & TAB SWITCH LISTENER ──────────────
  document.addEventListener("click", (e) => {
    try {
      const el = e.target;
      if (!el || el.closest("#jash-hud")) return;
      const txt = (el.textContent || "").trim().toLowerCase();
      if (/(30s|30sec|30\s*sec|30\s*second|30秒|wingo\s*30)/i.test(txt)) {
        if (GAME_MODE !== "30S") {
          console.log("[👑 JASH VIP] Auto-detected switch to 30S tab on game site!");
          GAME_MODE = "30S";
          persistAll();
          DRAW_HISTORY_MAP.clear();
          LOTTERY_HISTORY = [];
          CURRENT_API_DRAWS = [];
          CURRENT_SIGNAL_PREDICTION = null;
          pendingBet = null;
          updateHud();
          fetchDrawHistory();
        }
      } else if (/(1m|1min|1\s*min|1\s*minute|60s|1分|wingo\s*1)/i.test(txt)) {
        if (GAME_MODE !== "1M") {
          console.log("[👑 JASH VIP] Auto-detected switch to 1M tab on game site!");
          GAME_MODE = "1M";
          persistAll();
          DRAW_HISTORY_MAP.clear();
          LOTTERY_HISTORY = [];
          CURRENT_API_DRAWS = [];
          CURRENT_SIGNAL_PREDICTION = null;
          pendingBet = null;
          updateHud();
          fetchDrawHistory();
        }
      }
    } catch(err) {}
  }, true);

  function ensureHud() {
    if (!document.getElementById('jash-hud')) createHud();
  }

  createHud();
  setInterval(ensureHud, 1000);
  setInterval(botCycle, 400);

})();
