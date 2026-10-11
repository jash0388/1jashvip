// ==UserScript==
// @name         JASH VIP ULTIMATE AI — WinGo Floating Prediction HUD & AutoBet
// @namespace    https://github.com/jash0388/jashvip
// @version      33.0
// @description  👑 JASH VIP · Exact jashvip.vercel.app Multi-Model Consensus Engine (Apex Titan, Radhe, Suresh, Markov, TGX 1-6, Paid Pro, Nexa Skew) + Dual Settlement (Instant DOM & GM_xmlhttpRequest) + Custom Martingale (3 -> 7 -> 14 -> 28).
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

  console.log("%c👑 JASH VIP ULTIMATE AI · 100% EXACT VERCEL CONSENSUS ENGINE ACTIVE", "background:linear-gradient(135deg,#00f5a0,#00d9f5,#7c3aed);color:#000;font-size:15px;font-weight:900;padding:8px 16px;border-radius:8px;box-shadow:0 0 25px rgba(0,245,160,0.6);");

  // ── 1. WAKE LOCK & PREVENT SLEEP ──────────────────────────
  let wakeLockObj = null;
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) wakeLockObj = await navigator.wakeLock.request('screen');
    } catch (e) {}
  }
  setInterval(requestWakeLock, 8000);
  requestWakeLock();

  // ── 2. STATE PERSISTENCE ──────────────────────────────────
  let GAME_MODE          = localStorage.getItem('JASH_MODE') || '1M';
  let BASE_BET           = parseInt(localStorage.getItem('JASH_BASE_BET') || '3', 10);
  if (isNaN(BASE_BET) || BASE_BET < 1) BASE_BET = 3;

  // Custom Martingale:
  // Step 0: Base (₹3)
  // Step 1: (Base * 2) + 1 = ₹7
  // Step 2: ((Base * 2) + 1) * 2 = ₹14
  // Step 3: ₹28...
  // Resets to Base on Win!
  function getStakeForStep(base, step) {
    const b = Math.max(1, parseInt(base, 10) || 3);
    const s = parseInt(step, 10) || 0;
    if (s <= 0) return b;
    if (s === 1) return (b * 2) + 1; // 7
    return ((b * 2) + 1) * Math.pow(2, s - 1); // 14, 28, 56...
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

  const PLACED_PERIODS = new Set();
  const RESOLVED_PERIODS = new Set();
  const LOCKED_TIME_BUCKETS = new Set();

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

  // ── 3. EXACT PREDICTION STRATEGY FROM JASHVIP.VERCEL.APP ──
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

  // 5. TGX 6-LOGIC ENGINE LAYER
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

  // 6. EXACT MASTER ENSEMBLE ENGINE (EXACT JASHVIP.VERCEL.APP IMPLEMENTATION)
  function calculateCombinedPrediction(list) {
    if (!list || list.length < 3) return null;

    const sizes = list.slice(0, 15).map(item => getSize(item.number));
    const nums = list.slice(0, 15).map(item => parseInt(item.number, 10));

    // Current recovery level (1, 2, or 3)
    const currentLevel = Math.min(3, Math.max(1, LOSS_STREAK + 1));

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
    let patternLabel = titan.reg;

    if (streak >= 3) {
      votes[sizes[0]] += 5.5; // Irresistible Dragon Ride
      patternLabel = `⚡ DRAGON RIDE (${streak}X)`;
    } else if (streak === 2 && currentLevel >= 2) {
      votes[sizes[0]] += 4.0; // Pair Lock during L2/L3 Recovery
      patternLabel = `🛡️ L${currentLevel} DOUBLET RIDE`;
    } else if (isChopZone) {
      patternLabel = '🛑 CAPITAL SHIELD: CHOP ZONE (FLAT 1X)';
    } else if (alt >= 3) {
      patternLabel = `⚡ ZIGZAG SWITCH (${alt}X)`;
    }

    const prediction = votes.BIG >= votes.SMALL ? 'BIG' : 'SMALL';
    return {
      prediction,
      patternLabel,
      latestIssue: list[0].issueNumber,
      latestNumber: parseInt(list[0].number, 10),
      nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString()
    };
  }

  function computePrediction() {
    if (!LOTTERY_HISTORY || LOTTERY_HISTORY.length < 3) {
      return { size: 'BIG', name: '⏳ SYNCING DRAW...', noData: true };
    }
    const list = LOTTERY_HISTORY.slice().reverse().map(item => ({
      issueNumber: item.period,
      number: String(item.number)
    }));
    const res = calculateCombinedPrediction(list);
    if (!res) return { size: 'BIG', name: 'AI CONSENSUS', noData: true };
    return { size: res.prediction, name: res.patternLabel, noData: false };
  }

  // ── 4. DRAW HISTORY FROM OFFICIAL AR-LOTTERY API ──────────
  let LOTTERY_HISTORY = [];

  function fetchDrawHistory() {
    const url = (GAME_MODE === '1M')
      ? 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json'
      : 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json';

    const fullUrl = `${url}?_t=${Date.now()}`;

    function handleList(list) {
      if (!Array.isArray(list) || list.length === 0) return;
      const parsed = list.map(item => {
        const p = String(item.issueNumber || item.period || '').trim();
        const n = parseInt(item.number, 10);
        return { period: p, number: n, size: getSize(n) };
      }).filter(x => /^\d+$/.test(x.period) && Number.isInteger(x.number));

      if (parsed.length >= 3) {
        const map = new Map();
        LOTTERY_HISTORY.forEach(item => map.set(item.period, item));
        parsed.forEach(item => map.set(item.period, item));
        const merged = Array.from(map.values());
        merged.sort((a, b) => {
          try { return BigInt(a.period) > BigInt(b.period) ? 1 : -1; } catch (e) { return 0; }
        });
        LOTTERY_HISTORY = merged.slice(-100);
        checkAllPendingBets();
        updateHud();
      }
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
          } catch (e) {}
        }
      });
    } else {
      fetch(fullUrl)
        .then(r => r.json())
        .then(j => handleList(j?.data?.list))
        .catch(() => {});
    }
  }
  setInterval(fetchDrawHistory, 1000);
  fetchDrawHistory();

  // ── 5. DUAL SETTLEMENT ENGINE (INSTANT DOM + API) ─────────
  // A. Check against API LOTTERY_HISTORY
  function checkAllPendingBets() {
    if (!LOTTERY_HISTORY || LOTTERY_HISTORY.length === 0) return;
    const historyMap = new Map();
    LOTTERY_HISTORY.forEach(item => historyMap.set(item.period, item));

    for (const bet of RECORDED_BETS) {
      if (!bet.isPending) continue;

      let draw = historyMap.get(bet.period);
      if (!draw) {
        const betTail = String(bet.period).slice(-5);
        for (const [p, item] of historyMap.entries()) {
          if (p.endsWith(betTail)) { draw = item; break; }
        }
      }

      if (draw && draw.period) {
        resolveBet(bet, draw.period, draw.size, draw.number);
      }
    }
  }

  // B. Instant DOM History Synchronizer (Reads "My history" on dmfirst directly!)
  function syncFromDOMHistory() {
    const textEls = Array.from(document.querySelectorAll('div, tr, li, p, span')).filter(e => !e.closest('#jash-hud'));
    for (const el of textEls) {
      const text = (el.textContent || '').trim();
      const m = text.match(/\b(2026\d{10,14})\b/);
      if (!m) continue;
      const period = m[1];

      const container = el.closest('div, tr, li') || el;
      const cText = (container.textContent || '').trim();

      const isLose = /Lose|Loss|未中奖/i.test(cText);
      const isWin = /Win|中奖/i.test(cText);

      if (isLose || isWin) {
        const bet = RECORDED_BETS.find(b => (b.period === period || period.endsWith(String(b.period).slice(-5))) && b.isPending);
        if (bet) {
          const outcomeSize = isWin ? bet.prediction : (bet.prediction === 'BIG' ? 'SMALL' : 'BIG');
          resolveBet(bet, period, outcomeSize, null);
        }
      }
    }
  }

  function resolveBet(bet, period, outcomeSize, actualNum) {
    if (!bet.isPending) return;
    RESOLVED_PERIODS.add(period);
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

  // ── 6. ACCURATE TIMER ─────────────────────────────────────
  function getTimerSeconds() {
    const cycle = (GAME_MODE === '1M') ? 60 : 30;
    const sec = Math.floor(Date.now() / 1000) % cycle;
    return cycle - sec;
  }

  function getCurrentTimeBucket() {
    const period = (GAME_MODE === '1M') ? 60 : 30;
    return Math.floor(Date.now() / (period * 1000));
  }

  // ── 7. DOM CLICK HELPERS ──────────────────────────────────
  function fireClick(el) {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
        el.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
      });
      if (typeof el.click === 'function') el.click();
    } catch (e) {}
  }

  // ── 8. BULLETPROOF BET EXECUTION ──────────────────────────
  async function executeBet(size, amount) {
    const target = size.trim().toUpperCase(); // "BIG" or "SMALL"
    console.log(`%c[👑 JASH VIP] 🎯 PLACING BET: ${target} ₹${amount} (Level ${LOSS_STREAK + 1}, Step ${martingaleStep})`, 'background:linear-gradient(90deg,#00f5a0,#7c3aed);color:#000;font-weight:bold;padding:6px 14px;font-size:13px;border-radius:4px');

    // 0. Clean up any open popup so game buttons are never blocked
    const openPopups = Array.from(document.querySelectorAll('.van-popup, .popup, .van-popup--bottom')).filter(e => !e.closest('#jash-hud'));
    for (const pop of openPopups) {
      if (pop.offsetHeight > 40) {
        const cancelBtn = Array.from(pop.querySelectorAll('button, div, span, p')).find(e => (e.textContent || '').trim().toLowerCase() === 'cancel');
        if (cancelBtn) {
          fireClick(cancelBtn);
          await new Promise(r => setTimeout(r, 180));
        }
      }
    }

    // 1. Filter out history, tables, record lists, HUD
    const allEls = Array.from(document.querySelectorAll('div, button, span, uni-view, p')).filter(e => {
      if (e.closest('#jash-hud')) return false;
      if (e.closest('.history, [class*="history"], [class*="record"], table, .list, [class*="list"], .record-list, .tab-content, .my-history')) return false;
      return true;
    });

    // Match exact text 'Big' or 'Small'
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

    fireClick(targetBtn);
    await new Promise(r => setTimeout(r, 350));

    // 2. Set amount input
    const modalInputs = Array.from(document.querySelectorAll('.van-popup input, .popup input, input[type="tel"], input[type="number"], input')).filter(i => !i.closest('#jash-hud'));
    if (modalInputs.length > 0) {
      const inp = modalInputs[modalInputs.length - 1];
      try {
        inp.focus();
        inp.value = String(amount);
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        if (setter) setter.call(inp, String(amount));
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {}
    }

    // 3. Increment stepper if amount > 1 to guarantee Vue reactive data update
    if (amount > 1) {
      const plusBtns = Array.from(document.querySelectorAll('.van-stepper__plus, button.plus, .plus, [class*="plus"]')).filter(b => !b.closest('#jash-hud'));
      if (plusBtns.length > 0) {
        const plusBtn = plusBtns[plusBtns.length - 1];
        for (let i = 1; i < amount; i++) {
          fireClick(plusBtn);
          await new Promise(r => setTimeout(r, 35));
        }
      }
    }

    await new Promise(r => setTimeout(r, 150));

    // 4. Click confirm button ("Total amount ₹...")
    const allPopupEls = Array.from(document.querySelectorAll('*')).filter(e => !e.closest('#jash-hud'));
    let confirmBtn = allPopupEls.filter(b => {
      const t = (b.textContent || '').trim();
      return (t.startsWith('Total amount') || t.includes('Total amount')) && !t.includes('Cancel') && t.length <= 40;
    })[0];

    if (!confirmBtn) {
      confirmBtn = allPopupEls.find(b => {
        const t = (b.textContent || '').trim();
        return /^(Confirm|Submit|Order|Buy|Bet|立即投注)$/i.test(t) && !t.includes('Cancel') && t.length <= 25;
      });
    }

    // Safety check: ensure Total amount is NOT ₹0 or ₹0.00
    if (confirmBtn) {
      const confirmText = (confirmBtn.textContent || '').trim();
      if (/₹\s*0(\.00)?/i.test(confirmText)) {
        console.warn('[JASH VIP] ⚠️ Total amount is ₹0.00, re-stepping plus button...');
        const plusBtns = Array.from(document.querySelectorAll('.van-stepper__plus, button.plus, .plus, [class*="plus"]')).filter(b => !b.closest('#jash-hud'));
        if (plusBtns.length > 0) {
          for (let i = 0; i < amount; i++) {
            fireClick(plusBtns[plusBtns.length - 1]);
            await new Promise(r => setTimeout(r, 35));
          }
        }
      }

      try { confirmBtn.click(); } catch (e) {}
      fireClick(confirmBtn);
      console.log(`%c[👑 JASH VIP] ✅ Bet Successfully Submitted: ${target} ₹${amount}`, 'color:#00f5a0;font-weight:bold;');
      return true;
    }
    return false;
  }

  // ── 9. FLOATING VIP HUD (CLEAN, COMPACT & 1-CLICK RESTORE) ─
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
          <button id="j-mode-btn" style="flex:1;padding:4px 0;background:rgba(124,58,237,0.3);border:1px solid #7c3aed;border-radius:6px;color:#c4b5fd;font-weight:bold;font-size:10px;cursor:pointer;">
            🎯 ${GAME_MODE === '30S' ? '30 SEC (FAST)' : '1 MIN'}
          </button>
        </div>

        <!-- DIRECTION CALLOUT -->
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px;margin-bottom:8px;text-align:center;">
          <div id="j-pattern-lbl" style="font-size:9px;font-weight:800;color:#8A97AA;text-transform:uppercase;margin-bottom:2px;">AI CONSENSUS</div>
          <div id="j-pred-call" style="font-size:24px;font-weight:900;line-height:1.1;color:#56e6ff;text-shadow:0 0 16px currentColor;">CALIBRATING...</div>
        </div>

        <!-- BASE BET & CURRENT STAKE -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:6px;">
            <div style="font-size:8px;font-weight:800;color:#888;text-transform:uppercase;">BASE BET</div>
            <div style="display:flex;align-items:center;gap:3px;margin-top:2px;">
              <span style="color:#00f5a0;font-weight:bold;font-size:12px;">₹</span>
              <input type="number" id="j-base-input" value="${BASE_BET}" min="1" style="width:100%;background:transparent;border:none;outline:none;color:#fff;font-size:13px;font-weight:900;font-family:monospace;">
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:6px;">
            <div style="font-size:8px;font-weight:800;color:#888;text-transform:uppercase;">CURRENT BET</div>
            <div id="j-current-bet-display" style="color:#ffcc00;font-size:13px;font-weight:900;font-family:monospace;margin-top:2px;">₹${currentBet}</div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:8px;color:#aaa;">
          <span>Streak: <b id="j-streak-lbl" style="color:#fff;">0 (L1)</b></span>
          <span>Score: <b id="j-score-lbl" style="color:#00f5a0;">${wins}W / ${losses}L</b></span>
        </div>

        <!-- AUTOBET TOGGLE BUTTON -->
        <button id="j-toggle-btn" style="width:100%;padding:9px 0;background:linear-gradient(135deg,#00f5a0,#00d9f5);border:none;border-radius:8px;color:#000;font-weight:900;font-size:11px;cursor:pointer;box-shadow:0 0 15px rgba(0,245,160,0.4);letter-spacing:0.05em;margin-bottom:6px;">
          ▶ START AUTOBET
        </button>

        <div id="j-feed-box" style="max-height:55px;overflow-y:auto;background:rgba(0,0,0,0.4);border-radius:6px;padding:4px 6px;font-size:9.5px;font-family:monospace;">
          <div style="color:#888;text-align:center;">Monitoring draw feed...</div>
        </div>
      </div>
    `;

    target.appendChild(hud);

    // Minimize / Expand logic: clicking ANYWHERE on minimized HUD expands it!
    function setMinimized(min) {
      isMinimized = min;
      const body = document.getElementById('j-main-body');
      const minBtn = document.getElementById('j-min-btn');
      if (isMinimized) {
        body.style.display = 'none';
        hud.style.width = 'auto';
        hud.style.minWidth = '220px';
        hud.style.cursor = 'pointer';
        if (minBtn) minBtn.textContent = '□';
      } else {
        body.style.display = 'block';
        hud.style.width = '260px';
        hud.style.cursor = 'default';
        if (minBtn) minBtn.textContent = '−';
      }
    }

    hud.addEventListener('click', (e) => {
      if (isMinimized) {
        setMinimized(false);
      }
    });

    document.getElementById('j-min-btn').onclick = (e) => {
      e.stopPropagation();
      setMinimized(!isMinimized);
    };

    document.getElementById('j-toggle-btn').onclick = (e) => {
      e.stopPropagation();
      running = !running;
      const btn = document.getElementById('j-toggle-btn');
      if (running) {
        btn.textContent = '⏹ STOP AUTOBET (ACTIVE)';
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

    document.getElementById('j-mode-btn').onclick = (e) => {
      e.stopPropagation();
      GAME_MODE = (GAME_MODE === '30S') ? '1M' : '30S';
      document.getElementById('j-mode-btn').textContent = `🎯 ${GAME_MODE === '30S' ? '30 SEC (FAST)' : '1 MIN'}`;
      LOTTERY_HISTORY = [];
      persistAll();
      fetchDrawHistory();
      updateHud();
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
    if (feedBox && RECORDED_BETS.length > 0) {
      feedBox.innerHTML = RECORDED_BETS.slice(0, 5).map(b => `
        <div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:${b.won === true ? '#00f5a0' : b.won === false ? '#ff007a' : '#ffcc00'}">
          <span>..${String(b.period).slice(-4)} ${b.prediction} ₹${b.stake}</span>
          <span>${b.won === true ? 'WIN ✓' : b.won === false ? 'LOSS ✕' : 'PLACED'}</span>
        </div>
      `).join('');
    }
  }

  // ── 10. MAIN AUTOBET CYCLE ────────────────────────────────
  async function botCycle() {
    try {
      const secondsLeft = getTimerSeconds();
      const currentBucket = getCurrentTimeBucket();

      const tEl = document.getElementById('j-timer');
      if (tEl) tEl.textContent = secondsLeft + 's';

      // 1. Instant sync outcomes from both DOM ("My history") and API
      syncFromDOMHistory();
      checkAllPendingBets();

      // 2. Detect active draw issue number
      let activePeriod = null;
      const allText = Array.from(document.querySelectorAll('div, span, p, b')).filter(e => !e.closest('#jash-hud') && !e.closest('table'));
      for (const el of allText) {
        const txt = (el.textContent || '').trim();
        const m = txt.match(/\b(2026\d{10,14})\b/);
        if (m && txt.length < 30) { activePeriod = m[1]; break; }
      }
      if (!activePeriod && LOTTERY_HISTORY.length > 0) {
        try { activePeriod = (BigInt(LOTTERY_HISTORY[LOTTERY_HISTORY.length - 1].period) + 1n).toString(); } catch (e) {}
      }

      if (activePeriod && currentPeriod && activePeriod !== currentPeriod) {
        pendingBet = null;
      }
      currentPeriod = activePeriod;

      const pred = computePrediction();
      updateHud();

      if (!running || isBettingInProgress) return;
      if (LOCKED_TIME_BUCKETS.has(currentBucket)) return;
      if (activePeriod && PLACED_PERIODS.has(activePeriod)) return;
      if (pred.noData) return;

      // 3. Bet Window: 1M: between 55s and 6s | 30S: between 25s and 4s
      const canBet = (GAME_MODE === '30S')
        ? (secondsLeft <= 25 && secondsLeft >= 4)
        : (secondsLeft <= 55 && secondsLeft >= 6);

      if (canBet && !LOCKED_TIME_BUCKETS.has(currentBucket)) {
        LOCKED_TIME_BUCKETS.add(currentBucket);
        if (activePeriod) PLACED_PERIODS.add(activePeriod);
        isBettingInProgress = true;

        lastPredicted = pred.size;
        lastBetPeriod = activePeriod;
        pendingBet = { period: activePeriod, pred: pred.size, stake: currentBet, placedAt: Date.now() };

        if (activePeriod) {
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
        }

        persistAll();
        updateHud();

        await executeBet(pred.size, currentBet);

        setTimeout(() => {
          isBettingInProgress = false;
          pendingBet = null;
        }, (GAME_MODE === '30S' ? 2500 : 4000));
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
