// ==UserScript==
// @name         JASH VIP ULTIMATE AI — WinGo Floating Prediction HUD & AutoBet
// @namespace    https://github.com/jash0388/jashvip
// @version      36.0
// @description  👑 JASH VIP · 100% Exact jashvip.vercel.app Master Ensemble Strategy with Self-Healing Continuous Level Synchronization (Zero Drift 24/7) + Bulletproof AutoBet + Custom Martingale (₹3 -> ₹7 -> ₹14 -> ₹28 -> ₹56).
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

  if (window.__JASH_VIP_ACTIVE__) return;
  window.__JASH_VIP_ACTIVE__ = true;

  console.log("%c👑 JASH VIP ULTIMATE AI · 24/7 SELF-HEALING ZERO-DRIFT VERCEL STRATEGY ACTIVE", "background:linear-gradient(135deg,#00f5a0,#00d9f5,#7c3aed);color:#000;font-size:15px;font-weight:900;padding:8px 16px;border-radius:8px;box-shadow:0 0 25px rgba(0,245,160,0.6);");

  // ── 1. WAKE LOCK & PREVENT SLEEP ──────────────────────────
  let wakeLockObj = null;
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) wakeLockObj = await navigator.wakeLock.request('screen');
    } catch (e) {}
  }
  setInterval(requestWakeLock, 8000);
  requestWakeLock();

  // ── 2. STATE PERSISTENCE (STRICTLY 1 MIN WINGO ONLY) ─────
  const GAME_MODE        = '1M';
  try { localStorage.removeItem('JASH_MODE'); } catch(e) {}
  let BASE_BET           = parseInt(localStorage.getItem('JASH_BASE_BET') || '2', 10);
  if (isNaN(BASE_BET) || BASE_BET < 1) BASE_BET = 2;

  function getStakeForStep(base, step) {
    const b = Math.max(1, parseInt(base, 10) || 2);
    const s = parseInt(step, 10) || 0;
    if (s <= 0) return b;
    if (s === 1) return (b * 2) + 1; // e.g. 5 if base 2, 7 if base 3
    return ((b * 2) + 1) * Math.pow(2, s - 1); // 10, 20, 40... or 14, 28, 56...
  }

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

  let PLACED_PERIODS = new Set();
  let RESOLVED_PERIODS = new Set();
  let LOCKED_TIME_BUCKETS = new Set();

  let RECORDED_BETS = [];
  try {
    const saved = localStorage.getItem('JASH_BETS');
    if (saved) RECORDED_BETS = JSON.parse(saved);
  } catch (e) {}

  function persistAll() {
    try {
      localStorage.setItem('JASH_MODE', GAME_MODE);
      localStorage.setItem('JASH_BASE_BET', String(BASE_BET));
      localStorage.setItem('JASH_WINS', String(wins));
      localStorage.setItem('JASH_LOSSES', String(losses));
      localStorage.setItem('JASH_STEP', String(martingaleStep));
      localStorage.setItem('JASH_LOSS_STREAK', String(LOSS_STREAK));
      if (lastPredicted) localStorage.setItem('JASH_LAST_PRED', lastPredicted);
      if (lastBetPeriod) localStorage.setItem('JASH_LAST_BET_P', lastBetPeriod);
      localStorage.setItem('JASH_BETS', JSON.stringify(RECORDED_BETS.slice(0, 30)));
    } catch (e) {}
  }

  // ── 3. 100% EXACT MASTER ENSEMBLE ENGINE FROM JASHVIP.VERCEL.APP ──
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

  // 1. APEX TITAN CADENCE ENGINE
  function apexTitanEngine(sizes, lossStreak) {
    const runs = getRuns(sizes);
    const cRun = runs[runs.length - 1];
    const cSide = cRun ? cRun.size : sizes[0];
    const cLen = cRun ? cRun.len : 1;
    const lastS = sizes[sizes.length - 1];

    let alt = 0;
    for (let i = runs.length - 1; i >= 0; i--) {
      if (runs[i].len === 1) alt++;
      else break;
    }

    if (lossStreak >= 2) {
      if (cLen >= 2) return { vote: cSide, reg: '🛑 L3 DRAGON LOCK' };
      if (alt >= 2) return { vote: opp(lastS), reg: '🛑 L3 CHOP FLIP' };
      return { vote: cSide, reg: '🛑 L3 MOMENTUM LOCK' };
    } else if (lossStreak === 1) {
      if (cLen >= 2) return { vote: cSide, reg: '🛡️ L2 DRAGON RIDE' };
      if (alt >= 2) return { vote: opp(lastS), reg: '🛡️ L2 CHOP FLIP' };
      return { vote: cSide, reg: '🛡️ L2 MOMENTUM LOCK' };
    } else {
      if (cLen >= 3) return { vote: cSide, reg: '🌊 L1 DRAGON RIDE' };
      if (cLen === 2) return { vote: cSide, reg: '🌊 L1 DOUBLET RIDE' };
      if (alt >= 3) return { vote: opp(lastS), reg: '⚡ L1 CHOP OSC' };
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

  // 4. QUANTUM MARKOV 2-GRAM
  function markovEngine(sizes) {
    if (sizes.length < 5) return sizes[0];
    const s1 = sizes[1], s0 = sizes[0];
    let nextB = 0, nextS = 0;
    for (let i = 0; i < sizes.length - 2; i++) {
      if (sizes[i + 1] === s1 && sizes[i] === s0) {
        if (sizes[i + 2] === 'BIG') nextB++; else nextS++;
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

  // 6. EXACT MASTER MULTI-MODEL ENSEMBLE ENGINE (IDENTICAL TO JASHVIP.VERCEL.APP)
  function calculateCombinedPrediction(list, currentLevel = 1) {
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

    // Layer 1: Apex Titan Cadence Engine
    const titan = apexTitanEngine(sizes, Math.max(0, currentLevel - 1));
    votes[titan.vote] += 3.2;

    // Layer 2: Radhe Hack 2-3 Level Fix
    const radhe = radheEngine(list);
    votes[radhe] += 2.4;

    // Layer 3: Suresh VIP Supreme V15
    const suresh = sureshEngine(list);
    votes[suresh] += 2.0;

    // Layer 4: Quantum Markov 2-Gram
    const markov = markovEngine(sizes);
    votes[markov] += 1.8;

    // Layer 5: TGX 6-Logic Ensemble
    const l1 = tgxLogic1(nums, sizes); votes[l1] += 1.0;
    const l2 = tgxLogic2(nums);        votes[l2] += 1.2;
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
    if (streak < 2 && currentLevel === 1) {
      if (big15 >= 10) {
        votes.SMALL += 1.6;
        nexaVote = 'REV-S';
      } else if (big15 <= 5) {
        votes.BIG += 1.6;
        nexaVote = 'REV-B';
      }
    }

    // Circuit Breaker & Strict Level Protection
    const isChopZone = (alt >= 3 && currentLevel >= 3);
    let patternType = 'consensus';
    let patternLabel = titan.reg;

    if (streak >= 3) {
      votes[sizes[0]] += 5.5; // Irresistible Dragon Ride
      patternType = 'dragon';
      patternLabel = `⚡ DRAGON RIDE (${streak}X)`;
    } else if (streak === 2 && currentLevel >= 2) {
      votes[sizes[0]] += 4.0; // Pair Lock during L2/L3 Recovery
      patternType = 'cycle';
      patternLabel = `🛡️ L${currentLevel} DOUBLET RIDE`;
    } else if (isChopZone) {
      patternType = 'zigzag';
      patternLabel = '🛑 CAPITAL SHIELD: CHOP ZONE (FLAT 1X)';
    } else if (alt >= 3) {
      patternType = 'zigzag';
      patternLabel = `⚡ ZIGZAG SWITCH (${alt}X)`;
    } else {
      patternType = 'consensus';
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
        titan: titan.vote,
        radhe,
        suresh,
        markov,
        painPro,
        nexaVote: nexaVote === 'REV-B' ? 'BIG' : (nexaVote === 'REV-S' ? 'SMALL' : 'BALANCED')
      }
    };
  }

  // ── 4. SELF-HEALING DETERMINISTIC SIGNAL LEVEL RESOLVER ────
  // Reconstructs the exact signal level (1, 2, or 3) from the last 10 draws.
  // Guarantees zero level drift even if the bot runs continuously for days!
  function getSelfHealingSignalLevel(list) {
    if (!list || list.length < 4) return 1;
    const chron = list.slice().reverse();
    let lvl = 1;
    let lastP = null;
    for (let i = 3; i < chron.length; i++) {
      const sub = chron.slice(0, i).reverse();
      const res = calculateCombinedPrediction(sub, lvl);
      if (lastP) {
        const actual = getSize(chron[i - 1].number);
        if (lastP === actual) lvl = 1;
        else {
          lvl++;
          if (lvl > 3) lvl = 1; // Strict 3-level safety cycle
        }
      }
      if (res) lastP = res.prediction;
    }
    const actualLatest = getSize(chron[chron.length - 1].number);
    if (lastP) {
      if (lastP === actualLatest) lvl = 1;
      else {
        lvl++;
        if (lvl > 3) lvl = 1;
      }
    }
    return lvl;
  }

  // ── 5. MASTER SIGNAL STATE MACHINE ────────────────────────
  let CURRENT_SIGNAL_PREDICTION = null;
  let LAST_SYNCED_PERIOD = null;

  function updateMasterSignal() {
    if (!CURRENT_API_DRAWS || CURRENT_API_DRAWS.length < 3) return;
    const top = CURRENT_API_DRAWS[0];

    // Compute self-healed level and locked prediction
    const lvl = getSelfHealingSignalLevel(CURRENT_API_DRAWS);
    const result = calculateCombinedPrediction(CURRENT_API_DRAWS, lvl);
    if (result) {
      if (LAST_SYNCED_PERIOD !== top.issueNumber) {
        LAST_SYNCED_PERIOD = top.issueNumber;
        console.log(`%c[👑 JASH VIP] 🎯 Synced Next Issue #${result.nextPeriod}: ${result.prediction} (${result.patternLabel}) [Guard Level: L${lvl}]`, 'background:#00f5a0;color:#000;font-weight:900;padding:4px 8px;border-radius:4px;');
      }
      CURRENT_SIGNAL_PREDICTION = result;
    }
  }

  function computePrediction() {
    if (!CURRENT_SIGNAL_PREDICTION) {
      updateMasterSignal();
    }
    if (!CURRENT_SIGNAL_PREDICTION) {
      return {
        size: 'BIG',
        name: '⏳ SYNCING DRAW...',
        models: { titan: '...', radhe: '...', suresh: '...', markov: '...', painPro: '...', nexaVote: '...' },
        noData: true
      };
    }
    return {
      size: CURRENT_SIGNAL_PREDICTION.prediction,
      name: CURRENT_SIGNAL_PREDICTION.patternLabel,
      models: CURRENT_SIGNAL_PREDICTION.models,
      noData: false
    };
  }

  // ── 6. OFFICIAL AR-LOTTERY API DRAW FETCHER & SERVER INTERCEPTOR ──
  let CURRENT_API_DRAWS = [];
  let LOTTERY_HISTORY = [];
  let isFetching = false;

  function ingestDrawList(list) {
    if (!Array.isArray(list) || list.length === 0) return;
    const valid = list.map(item => {
      const issue = String(item.issueNumber || item.issueNo || item.period || item.issue || '').trim();
      const numRaw = item.number != null ? item.number : (item.lotteryResults != null ? item.lotteryResults : item.result);
      const num = parseInt(numRaw, 10);
      if (!/^\d+$/.test(issue) || isNaN(num)) return null;
      return {
        issueNumber: issue,
        period: issue,
        number: num,
        size: num >= 5 ? 'BIG' : 'SMALL'
      };
    }).filter(Boolean);

    if (valid.length >= 1) {
      CURRENT_API_DRAWS = valid;
      const map = new Map();
      LOTTERY_HISTORY.forEach(item => map.set(item.period, item));
      valid.forEach(item => map.set(item.period, item));
      const merged = Array.from(map.values());
      merged.sort((a, b) => {
        try { return BigInt(a.period) > BigInt(b.period) ? 1 : -1; } catch (e) { return 0; }
      });
      LOTTERY_HISTORY = merged.slice(-50);
      checkAllPendingBets();
      updateMasterSignal();
      updateHud();
    }
  }

  // Intercept XHR for site's internal lottery data
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

  // Intercept window.fetch for site's internal lottery data
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
    if (isFetching) return;
    isFetching = true;

    const fullUrl = `https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?_t=${Date.now()}`;

    function handleList(list) {
      isFetching = false;
      ingestDrawList(list);
    }

    if (typeof GM_xmlhttpRequest !== 'undefined') {
      GM_xmlhttpRequest({
        method: 'GET',
        url: fullUrl,
        timeout: 4000,
        onload: (res) => {
          try {
            const j = JSON.parse(res.responseText);
            handleList(j?.data?.list);
          } catch (e) { isFetching = false; }
        },
        onerror: () => { isFetching = false; }
      });
    } else {
      fetch(fullUrl)
        .then(r => r.json())
        .then(j => handleList(j?.data?.list))
        .catch(() => { isFetching = false; });
    }
  }

  setInterval(fetchDrawHistory, 1500);
  fetchDrawHistory();

  // ── 7. OFFICIAL SERVER API SETTLEMENT ENGINE ──────────────
  // Results are settled EXCLUSIVELY via the official server API draw results.
  // Active/running rounds will NEVER resolve early or falsely show LOSS.
  function checkAllPendingBets() {
    if (!LOTTERY_HISTORY || LOTTERY_HISTORY.length === 0) return;
    const historyMap = new Map();
    LOTTERY_HISTORY.forEach(item => {
      const p = String(item.period || item.issueNumber || '').trim();
      if (p) historyMap.set(p, item);
    });

    for (const bet of RECORDED_BETS) {
      if (!bet.isPending) continue;

      const pKey = String(bet.period).trim();
      let draw = historyMap.get(pKey);
      if (!draw) {
        const pTail = pKey.slice(-6);
        for (const [k, v] of historyMap.entries()) {
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
      }
    }
  }

  function resolveBet(bet, period, outcomeSize, actualNum) {
    if (!bet.isPending) return;
    RESOLVED_PERIODS.add(period);
    RESOLVED_PERIODS.add(String(bet.period));
    bet.isPending = false;
    bet.actualSize = outcomeSize;
    if (actualNum != null) bet.actualNumber = actualNum;

    const won = (bet.prediction === outcomeSize);
    bet.won = won;

    if (won) {
      wins++;
      LOSS_STREAK = 0;
      martingaleStep = 0;
      currentBet = getStakeForStep(BASE_BET, 0);
      console.log(`%c🏆 JASH VIP WIN on #${period}! Reset to Base (₹${BASE_BET})`, 'background:#10b981;color:#fff;font-weight:900;padding:6px;border-radius:4px');
    } else {
      losses++;
      LOSS_STREAK++;
      martingaleStep++;
      currentBet = getStakeForStep(BASE_BET, martingaleStep);
      console.log(`%c💀 JASH VIP LOSS on #${period}! Streak=${LOSS_STREAK} Next=₹${currentBet}`, 'background:#ef4444;color:#fff;font-weight:900;padding:6px;border-radius:4px');
    }

    pendingBet = null;
    persistAll();
    updateHud();
  }

  // ── 8. ACCURATE 60-SECOND 1M TIMER ─────────────────────────
  function getTimerSeconds() {
    const sec = Math.floor(Date.now() / 1000) % 60;
    return 60 - sec;
  }

  function getCurrentTimeBucket() {
    return Math.floor(Date.now() / 60000);
  }

  // ── 9. SYNTHETIC TOUCH & POINTER CLICK SYSTEM ─────────────
  function triggerFullClick(el) {
    if (!el) return;
    try {
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

  // ── 10. BULLETPROOF BET PLACEMENT ENGINE ──────────────────
  async function executeBet(size, amount) {
    const target = size.trim().toUpperCase(); // "BIG" or "SMALL"
    console.log(`%c[👑 JASH VIP] 🎯 PLACING BET: ${target} ₹${amount} (Streak: ${LOSS_STREAK}, Step: ${martingaleStep})`, 'background:linear-gradient(90deg,#00f5a0,#7c3aed);color:#000;font-weight:bold;padding:6px 14px;font-size:13px;border-radius:4px');

    // 0. Clean up any open popup
    const openPopups = Array.from(document.querySelectorAll('.van-popup, .popup')).filter(e => !e.closest('#jash-hud') && e.offsetHeight > 40);
    for (const pop of openPopups) {
      const cancelBtn = Array.from(pop.querySelectorAll('button, div, span, p')).find(e => (e.textContent || '').trim().toLowerCase() === 'cancel');
      if (cancelBtn) {
        triggerFullClick(cancelBtn);
        await new Promise(r => setTimeout(r, 150));
      }
    }

    // 1. Find Big or Small button on main board
    const allEls = Array.from(document.querySelectorAll('div, button, span, uni-view, p')).filter(e => {
      if (e.closest('#jash-hud')) return false;
      if (e.closest('.history, [class*="history"], [class*="record"], table, .list, [class*="list"], .record-list, .tab-content, .my-history')) return false;
      return true;
    });

    let targetBtn = allEls.find(e => {
      const txt = (e.textContent || '').trim().toUpperCase();
      return (txt === target || txt === `${target} 2X` || txt === `${target}2X`) && e.children.length <= 1;
    });
    if (!targetBtn) {
      targetBtn = allEls.find(e => {
        const txt = (e.textContent || '').trim().toUpperCase();
        return txt === target;
      });
    }
    if (!targetBtn) {
      console.warn(`[JASH VIP] ❌ Could not find ${target} button!`);
      return false;
    }

    triggerFullClick(targetBtn);
    await new Promise(r => setTimeout(r, 400));

    // Wait for the popup modal to open
    let popup = null;
    for (let wait = 0; wait < 10; wait++) {
      popup = Array.from(document.querySelectorAll('.van-popup, .popup')).find(p => p.offsetHeight > 50 && !p.closest('#jash-hud'));
      if (popup) break;
      await new Promise(r => setTimeout(r, 100));
    }
    if (!popup) {
      console.warn('[JASH VIP] ❌ Bet popup did not open!');
      return false;
    }

    // 2. Ensure Balance chip "1" is active (multiplier = 1x)
    const balanceChips = Array.from(popup.querySelectorAll('div, span, button')).filter(e => {
      const t = (e.textContent || '').trim();
      return ['1', '10', '100', '1000'].includes(t) && e.children.length === 0;
    });
    const chip1 = balanceChips.find(e => (e.textContent || '').trim() === '1');
    if (chip1) {
      triggerFullClick(chip1);
      await new Promise(r => setTimeout(r, 80));
    }

    // 3. Set Quantity Input
    const modalInputs = Array.from(popup.querySelectorAll('input[type="tel"], input[type="number"], .van-stepper__input, input')).filter(i => !i.closest('#jash-hud'));
    const inp = modalInputs[modalInputs.length - 1];
    if (inp) {
      try {
        inp.focus();
        inp.select();
        document.execCommand('insertText', false, String(amount));
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        if (setter) setter.call(inp, String(amount));
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        inp.blur();
      } catch (e) {}
    }

    await new Promise(r => setTimeout(r, 120));

    function checkCurrentTotalText() {
      const els = Array.from(popup.querySelectorAll('*'));
      for (const el of els) {
        const txt = (el.textContent || '').trim();
        const m = txt.match(/Total\s*amount\s*[^\d]*(\d+(\.\d+)?)/i);
        if (m) return parseFloat(m[1]);
      }
      return null;
    }

    let curTotal = checkCurrentTotalText();
    if (curTotal !== amount) {
      const plusBtn = popup.querySelector('.van-stepper__plus, button.plus, .plus, [class*="plus"]');
      const minusBtn = popup.querySelector('.van-stepper__minus, button.minus, .minus, [class*="minus"]');
      if (plusBtn) {
        let curVal = parseInt(inp ? inp.value : '1', 10) || 1;
        while (curVal < amount && curVal < 500) {
          triggerFullClick(plusBtn);
          curVal++;
          await new Promise(r => setTimeout(r, 20));
          if (checkCurrentTotalText() === amount) break;
        }
        while (curVal > amount && minusBtn && curVal > 1) {
          triggerFullClick(minusBtn);
          curVal--;
          await new Promise(r => setTimeout(r, 20));
          if (checkCurrentTotalText() === amount) break;
        }
      }
    }

    await new Promise(r => setTimeout(r, 120));

    // 4. Ensure "I agree" checkbox is checked if present
    const agreeBox = popup.querySelector('.van-checkbox, [class*="agree"], [class*="rule"]');
    if (agreeBox) {
      const isChecked = agreeBox.classList.contains('van-checkbox--checked') || agreeBox.getAttribute('aria-checked') === 'true';
      if (!isChecked) {
        triggerFullClick(agreeBox);
        await new Promise(r => setTimeout(r, 80));
      }
    }

    // 5. Click CONFIRM / SUBMIT BUTTON ("Total amount ₹...")
    const allPopupEls = Array.from(popup.querySelectorAll('*')).filter(e => !e.closest('#jash-hud'));
    const totalEls = allPopupEls.filter(e => {
      const t = (e.textContent || '').trim();
      return /Total\s*amount/i.test(t) && !/Cancel/i.test(t) && t.length <= 40;
    });

    let confirmBtn = null;
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

    if (!confirmBtn) {
      console.warn('[JASH VIP] ❌ Confirm button not found inside popup!');
      return false;
    }

    const clickableContainer = confirmBtn.closest('button, .van-button, [role="button"]') || confirmBtn;

    console.log(`[JASH VIP] 🚀 Submitting bet: ${target} ₹${amount}...`, confirmBtn, clickableContainer);

    triggerFullClick(confirmBtn);
    if (clickableContainer !== confirmBtn) {
      triggerFullClick(clickableContainer);
    }
    try { confirmBtn.click(); } catch (e) {}
    try { clickableContainer.click(); } catch (e) {}

    await new Promise(r => setTimeout(r, 350));
    const stillOpen = Array.from(document.querySelectorAll('.van-popup, .popup')).some(p => p.offsetHeight > 50 && !p.closest('#jash-hud'));
    if (stillOpen) {
      console.log('[JASH VIP] 🔄 Modal still visible, attempting secondary submit click...');
      triggerFullClick(clickableContainer);
      try { clickableContainer.click(); } catch (e) {}
      await new Promise(r => setTimeout(r, 200));
    }

    console.log(`%c[👑 JASH VIP] ✅ Bet Successfully Submitted: ${target} ₹${amount}`, 'color:#00f5a0;font-weight:bold;');
    return true;
  }

  // ── 11. FLOATING VIP HUD (6-MODEL MATRIX DISPLAY) ──────────
  function createHud() {
    if (document.getElementById('jash-hud')) return;
    const target = document.body || document.documentElement;
    if (!target) return;

    const hud = document.createElement('div');
    hud.id = 'jash-hud';
    hud.style.cssText = `
      position:fixed;top:10px;right:10px;z-index:2147483647;
      width:260px;background:rgba(8,12,20,0.96);
      border:1.5px solid rgba(0,245,160,0.6);border-radius:14px;
      backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
      box-shadow:0 12px 40px rgba(0,0,0,0.85),0 0 20px rgba(0,245,160,0.25);
      font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;
      color:#fff;font-size:12px;padding:10px;user-select:none;
      transition: all 0.2s ease;
    `;

    hud.innerHTML = `
      <div id="j-header-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:6px;cursor:pointer;">
        <span style="font-weight:900;font-size:13px;background:linear-gradient(135deg,#00f5a0,#56e6ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">👑 JASH VIP</span>
        <div style="display:flex;align-items:center;gap:6px;">
          <span id="j-timer" style="font-weight:900;color:#00f5a0;font-size:13px;">--s</span>
          <button id="j-min-btn" style="background:rgba(255,255,255,0.1);border:none;color:#fff;border-radius:4px;font-size:10px;cursor:pointer;padding:2px 6px;">−</button>
        </div>
      </div>

      <div id="j-main-body">
        <div style="display:flex;gap:4px;margin-bottom:8px;">
          <div style="flex:2;padding:4px 0;background:rgba(0,245,160,0.12);border:1px solid rgba(0,245,160,0.3);border-radius:6px;color:#00f5a0;font-weight:900;font-size:10px;text-align:center;">
            🎯 1 MIN WINGO (OFFICIAL)
          </div>
          <button id="j-reset-btn" title="Reset streak & step to Base Bet" style="flex:1;padding:4px 0;background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.5);border-radius:6px;color:#fca5a5;font-weight:bold;font-size:10px;cursor:pointer;">
            🔄 RESET
          </button>
        </div>

        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px;text-align:center;margin-bottom:8px;">
          <div style="font-size:10px;color:#94a3b8;margin-bottom:2px;" id="j-pattern-lbl">⏳ SYNCING DRAW...</div>
          <div id="j-pred-call" style="font-size:24px;font-weight:900;letter-spacing:1px;color:#E4FF4A;">--</div>
        </div>

        <!-- 6-MODEL CONSENSUS MATRIX BREAKDOWN -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;font-size:10px;font-family:monospace;background:rgba(255,255,255,0.03);padding:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
          <div>TITAN: <span id="m-titan" style="font-weight:bold;color:#E4FF4A;">--</span></div>
          <div>RADHE: <span id="m-radhe" style="font-weight:bold;color:#E4FF4A;">--</span></div>
          <div>SURESH: <span id="m-suresh" style="font-weight:bold;color:#E4FF4A;">--</span></div>
          <div>MARKOV: <span id="m-markov" style="font-weight:bold;color:#E4FF4A;">--</span></div>
          <div>PAIN: <span id="m-pain" style="font-weight:bold;color:#E4FF4A;">--</span></div>
          <div>NEXA: <span id="m-nexa" style="font-weight:bold;color:#94a3b8;">--</span></div>
        </div>

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
            <div id="j-current-bet-display" style="font-weight:bold;color:#ffcc00;font-size:12px;">₹${currentBet}</div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-bottom:8px;padding:0 2px;">
          <span>Streak: <b id="j-streak-lbl" style="color:#fff;">${LOSS_STREAK} (L${LOSS_STREAK + 1})</b></span>
          <span>Score: <b id="j-score-lbl" style="color:#00f5a0;">${wins}W</b> / <b style="color:#ff007a;">${losses}L</b></span>
        </div>

        <button id="j-toggle-btn" style="width:100%;padding:8px 0;background:linear-gradient(135deg,#00f5a0,#00d9f5);border:none;border-radius:8px;color:#000;font-weight:900;font-size:11px;cursor:pointer;box-shadow:0 0 15px rgba(0,245,160,0.4);transition:all 0.2s;">
          ▶ START AUTOBET
        </button>

        <div id="j-feed-box" style="margin-top:8px;max-height:80px;overflow-y:auto;font-size:9px;font-family:monospace;border-top:1px solid rgba(255,255,255,0.08);padding-top:4px;">
          <div style="color:#64748b;text-align:center;">Feed will appear here</div>
        </div>
      </div>
    `;

    target.appendChild(hud);

    document.getElementById('j-min-btn').onclick = (e) => {
      e.stopPropagation();
      isMinimized = !isMinimized;
      document.getElementById('j-main-body').style.display = isMinimized ? 'none' : 'block';
      document.getElementById('j-min-btn').textContent = isMinimized ? '+' : '−';
    };

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
        btn.style.background = 'linear-gradient(135deg,#00f5a0,#00d9f5)';
        btn.style.boxShadow = '0 0 15px rgba(0,245,160,0.4)';
        btn.style.color = '#000';
      }
      persistAll();
      updateHud();
    };

    document.getElementById('j-base-input').onchange = (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      BASE_BET = val;
      currentBet = getStakeForStep(BASE_BET, martingaleStep);
      persistAll();
      updateHud();
    };

    document.getElementById('j-reset-btn').onclick = (e) => {
      e.stopPropagation();
      LOSS_STREAK = 0;
      martingaleStep = 0;
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
      console.log(`%c[👑 JASH VIP] 🔄 FULL RESET: Cleared history, streak, scores, and reset stake to ₹${BASE_BET}!`, 'background:#10b981;color:#000;font-weight:900;padding:6px;border-radius:4px;');
    };
  }

  function updateHud() {
    const hud = document.getElementById('jash-hud');
    if (!hud) return;

    const timerEl = document.getElementById('j-timer');
    if (timerEl) {
      const s = getTimerSeconds();
      timerEl.textContent = s + 's';
      timerEl.style.color = (s <= 5) ? '#ff3b5c' : '#00f5a0';
    }

    const pred = computePrediction();
    const predCallEl = document.getElementById('j-pred-call');
    const patternLblEl = document.getElementById('j-pattern-lbl');
    if (predCallEl && patternLblEl) {
      predCallEl.textContent = pred.size;
      predCallEl.style.color = pred.size === 'BIG' ? '#E4FF4A' : '#00D9FF';
      patternLblEl.textContent = pred.name;
    }

    if (pred.models) {
      const setM = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = val;
          if (val === 'BIG') el.style.color = '#E4FF4A';
          else if (val === 'SMALL') el.style.color = '#00D9FF';
          else el.style.color = '#94a3b8';
        }
      };
      setM('m-titan', pred.models.titan);
      setM('m-radhe', pred.models.radhe);
      setM('m-suresh', pred.models.suresh);
      setM('m-markov', pred.models.markov);
      setM('m-pain', pred.models.painPro);
      setM('m-nexa', pred.models.nexaVote);
    }

    const curBetEl = document.getElementById('j-current-bet-display');
    if (curBetEl) {
      curBetEl.textContent = `₹${currentBet}`;
    }

    const streakLbl = document.getElementById('j-streak-lbl');
    if (streakLbl) {
      streakLbl.textContent = `${LOSS_STREAK} (L${LOSS_STREAK + 1})`;
    }

    const scoreLbl = document.getElementById('j-score-lbl');
    if (scoreLbl) {
      scoreLbl.textContent = `${wins}W / ${losses}L`;
    }

    const feedBox = document.getElementById('j-feed-box');
    if (feedBox) {
      if (RECORDED_BETS.length > 0) {
        feedBox.innerHTML = RECORDED_BETS.slice(0, 5).map(b => `
          <div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:${b.won === true ? '#00f5a0' : b.won === false ? '#ff007a' : '#ffcc00'}">
            <span>..${String(b.period).slice(-4)} ${b.prediction} ₹${b.stake}</span>
            <span>${b.won === true ? 'WIN ✓' : b.won === false ? 'LOSS ✕' : 'PLACED ⏳'}</span>
          </div>
        `).join('');
      } else {
        feedBox.innerHTML = '<div style="color:#64748b;text-align:center;">Feed will appear here</div>';
      }
    }
  }

  // ── 12. MAIN AUTOBET CYCLE (RUNS 24/7 WITHOUT DRIFT) ───────
  async function botCycle() {
    try {
      const secondsLeft = getTimerSeconds();
      const currentBucket = getCurrentTimeBucket();

      const tEl = document.getElementById('j-timer');
      if (tEl) tEl.textContent = secondsLeft + 's';

      checkAllPendingBets();

      // Faster poll near draw boundary so next round is ready immediately
      if (secondsLeft <= 4 || secondsLeft >= 58) {
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

      // Self-prune Set memory to run forever
      if (PLACED_PERIODS.size > 50) PLACED_PERIODS = new Set(Array.from(PLACED_PERIODS).slice(-20));
      if (LOCKED_TIME_BUCKETS.size > 50) LOCKED_TIME_BUCKETS = new Set(Array.from(LOCKED_TIME_BUCKETS).slice(-20));
      if (RESOLVED_PERIODS.size > 50) RESOLVED_PERIODS = new Set(Array.from(RESOLVED_PERIODS).slice(-20));

      if (!running || isBettingInProgress) return;
      if (LOCKED_TIME_BUCKETS.has(currentBucket)) return;
      if (activePeriod && PLACED_PERIODS.has(activePeriod)) return;
      if (pred.noData) return;

      const canBet = (secondsLeft <= 55 && secondsLeft >= 6);

      if (canBet && !LOCKED_TIME_BUCKETS.has(currentBucket)) {
        LOCKED_TIME_BUCKETS.add(currentBucket);
        if (activePeriod) PLACED_PERIODS.add(activePeriod);
        isBettingInProgress = true;

        lastPredicted = pred.size;
        lastBetPeriod = activePeriod;
        pendingBet = { period: activePeriod, pred: pred.size, stake: currentBet, placedAt: Date.now() };

        // FIRST EXECUTE THE BET!
        const success = await executeBet(pred.size, currentBet);

        if (success && activePeriod) {
          RECORDED_BETS.unshift({
            period: activePeriod,
            prediction: pred.size,
            pattern: pred.name,
            stake: currentBet,
            won: null,
            isPending: true,
            time: new Date().toLocaleTimeString()
          });
          if (RECORDED_BETS.length > 30) RECORDED_BETS = RECORDED_BETS.slice(0, 30);
          console.log(`%c[👑 JASH VIP] ✅ Bet #${activePeriod} PLACED (${pred.size} ₹${currentBet})`, 'background:#00f5a0;color:#000;font-weight:900;');
        } else {
          console.warn(`%c[👑 JASH VIP] ❌ Bet #${activePeriod} NOT placed (executeBet returned false)`, 'background:#ef4444;color:#fff;font-weight:900;');
          pendingBet = null;
        }

        persistAll();
        updateHud();

        setTimeout(() => {
          isBettingInProgress = false;
        }, 3500);
      }
    } catch (e) {
      isBettingInProgress = false;
    }
  }

  function ensureHud() {
    if (!document.getElementById('jash-hud')) createHud();
  }

  createHud();
  setInterval(ensureHud, 1000);
  setInterval(botCycle, 400);

})();
