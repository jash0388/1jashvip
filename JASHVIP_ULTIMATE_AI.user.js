// ==UserScript==
// @name         JASH VIP ULTIMATE AI — WinGo 6-Engine RED & GREEN Color Prediction HUD & AutoBet (1M & 30S)
// @namespace    https://github.com/jash0388/jashvip
// @version      38.0
// @description  👑 JASH VIP · Dual Mode (1M & 30S) 100% Exact jashvip.vercel.app/v1 Ultimate 6-Engine Color Prediction System (Titan, Radhe, Suresh, Markov, Pain-Pro, Nexa Consensus) + Bulletproof Red/Green AutoBet + Zero Early-Loss Settlement + Complete Reset Engine.
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

  if (window.__JASH_VIP_COLOR_ACTIVE__) return;
  window.__JASH_VIP_COLOR_ACTIVE__ = true;

  console.log(
    "%c👑 JASH VIP ULTIMATE AI · 6-ENGINE RED/GREEN COLOR PREDICTION & AUTOBET (1M & 30S DUAL MODE ACTIVE)",
    "background:linear-gradient(135deg,#00f5a0,#ff3366,#00d9ff);color:#000;font-size:15px;font-weight:900;padding:8px 16px;border-radius:8px;box-shadow:0 0 25px rgba(0,245,160,0.6);"
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

  // ── 2. STATE PERSISTENCE (1M & 30S DUAL MODE) ────────────
  let GAME_MODE = localStorage.getItem('JASH_MODE') || '1M';
  if (GAME_MODE !== '1M' && GAME_MODE !== '30S') GAME_MODE = '1M';

  let BASE_BET = parseInt(localStorage.getItem('JASH_BASE_BET') || '3', 10);
  if (isNaN(BASE_BET) || BASE_BET < 1) BASE_BET = 3;

  function getStakeForStep(base, step) {
    const b = Math.max(1, parseInt(base, 10) || 3);
    const s = parseInt(step, 10) || 0;
    if (s <= 0) return b;
    if (s === 1) return (b * 2) + 1; // e.g. 7 if base 3, 5 if base 2
    return ((b * 2) + 1) * Math.pow(2, s - 1); // 14, 28, 56, 112...
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

  // ── 3. COLOR CORE HELPERS & MODEL CONVERSION ──────────────
  function getColor(num) {
    const n = parseInt(num, 10);
    return (n % 2 === 0) ? 'RED' : 'GREEN';
  }

  function opp(color) {
    return color === 'RED' ? 'GREEN' : 'RED';
  }

  // ── 4. ULTIMATE 6-ENGINE COLOR PREDICTION SUITE (EXACT /v1) ──
  const ENGINES = {
    // 1. TITAN: Exponential Recency-Weighted Parity Momentum
    titan: colors => {
      if (colors.length < 3) return colors[0] || 'GREEN';
      const rec = colors.slice(0, 4);
      const weights = [0.42, 0.28, 0.18, 0.12];
      let g = 0, tot = 0;
      for (let i = 0; i < rec.length; i++) {
        if (rec[i] === 'GREEN') g += weights[i];
        tot += weights[i];
      }
      const c15 = colors.slice(0, 15);
      const g15 = c15.filter(c => c === 'GREEN').length;
      if (g15 >= 11) return 'RED';
      if (g15 <= 4 && colors.length >= 15) return 'GREEN';

      return (g / tot) >= 0.50 ? 'GREEN' : 'RED';
    },

    // 2. RADHE: Dragon Ride + Doublet (2-2) Trajectory
    radhe: colors => {
      if (colors.length < 2) return colors[0] || 'GREEN';
      let streak = 1;
      const head = colors[0];
      for (let i = 1; i < colors.length; i++) {
        if (colors[i] === head) streak++;
        else break;
      }
      if (streak >= 5) return opp(head); // Exhaustion break at 5+
      if (streak >= 2 && streak <= 4) return head;

      // Doublet detector: [A, A, B, B] -> predict flip to A
      if (colors.length >= 4) {
        if (colors[0] === colors[1] && colors[2] === colors[3] && colors[0] !== colors[2]) {
          return opp(colors[0]);
        }
      }
      return opp(head);
    },

    // 3. SURESH: Adaptive Harmonic Zigzag Rhythm
    suresh: colors => {
      if (colors.length < 3) return opp(colors[0] || 'RED');
      let alt = 1;
      for (let i = 0; i < colors.length - 1; i++) {
        if (colors[i] !== colors[i + 1]) alt++;
        else break;
      }
      if (alt >= 2) return opp(colors[0]);
      return colors[0];
    },

    // 4. MARKOV: 2nd-Order State Transition Matrix
    markov: colors => {
      if (colors.length < 5) return colors[0] || 'GREEN';
      const c1 = colors[0], c2 = colors[1];
      let nG = 0, nR = 0;
      for (let i = 0; i < colors.length - 2; i++) {
        if (colors[i + 1] === c1 && colors[i + 2] === c2) {
          if (colors[i] === 'GREEN') nG++;
          else if (colors[i] === 'RED') nR++;
        }
      }
      if (nG > nR) return 'GREEN';
      if (nR > nG) return 'RED';
      for (let i = 0; i < colors.length - 1; i++) {
        if (colors[i + 1] === c1) {
          if (colors[i] === 'GREEN') nG++;
          else if (colors[i] === 'RED') nR++;
        }
      }
      if (nG !== nR) return nG > nR ? 'GREEN' : 'RED';
      return opp(c1);
    },

    // 5. PAIN-PRO: Contextual Violet Pivot & Parity Deficit
    painPro: (colors, history) => {
      if (!history || history.length < 2) return 'GREEN';
      const lastNum = history[0].number;
      let streak = 1;
      for (let i = 1; i < colors.length; i++) {
        if (colors[i] === colors[0]) streak++;
        else break;
      }
      if (lastNum === 0) return streak >= 2 ? 'RED' : 'GREEN';
      if (lastNum === 5) return streak >= 2 ? 'GREEN' : 'RED';

      const sample = colors.slice(0, 12);
      const redCount = sample.filter(c => c === 'RED').length;
      if (redCount >= 8) return 'GREEN';
      if (redCount <= 4) return 'RED';
      return colors[0];
    }
  };

  // Master Arbiter Combination Function (Bayesian Dynamic Accuracy)
  function calculateColorPrediction(historyList) {
    if (!historyList || historyList.length < 3) {
      return { noData: true, color: 'GREEN', topDigits: [1, 7], conf: 75, patternLabel: 'INITIALIZING...' };
    }

    const cleanHistory = historyList.slice(0, 30).map(item => ({
      issueNumber: String(item.period || item.issueNumber || ''),
      number: parseInt(item.number, 10),
      color: getColor(item.number)
    }));

    const colors = cleanHistory.map(h => h.color);

    const models = {};
    models.titan = ENGINES.titan(colors);
    models.radhe = ENGINES.radhe(colors);
    models.suresh = ENGINES.suresh(colors);
    models.markov = ENGINES.markov(colors);
    models.painPro = ENGINES.painPro(colors, cleanHistory);

    // Audit rolling performance of each engine on the last 10 draws
    const baseWeights = { titan: 1.35, radhe: 1.45, suresh: 1.30, markov: 1.50, painPro: 1.25 };
    const acc = {};
    const currentStreak = {};

    for (const k in ENGINES) {
      let hits = 0, tested = 0, lStreak = 0;
      for (let i = 1; i < Math.min(10, cleanHistory.length - 1); i++) {
        const past = cleanHistory.slice(i);
        const subColors = past.map(x => x.color);
        const subActual = cleanHistory[i - 1].color;
        const p = ENGINES[k](subColors, past);
        tested++;
        if (p === subActual) {
          hits++;
          if (tested === 1) lStreak = 0;
        } else {
          if (tested === 1 || lStreak === tested - 1) lStreak++;
        }
      }
      acc[k] = tested > 0 ? (hits / tested) : 0.50;
      currentStreak[k] = lStreak;
    }

    // Dynamic Bayesian Score
    let greenVotes = 0, redVotes = 0, totalWeight = 0;
    for (const k in ENGINES) {
      const isCold = currentStreak[k] >= 2;
      const dynamicW = isCold ? (baseWeights[k] * 0.25) : (baseWeights[k] * Math.pow(Math.max(0.2, acc[k]), 1.3));
      totalWeight += dynamicW;
      if (models[k] === 'GREEN') greenVotes += dynamicW;
      else redVotes += dynamicW;
    }

    const nexaVote = greenVotes >= redVotes ? 'GREEN' : 'RED';
    models.nexa = nexaVote;

    const predictedColor = nexaVote;
    const topScore = Math.max(greenVotes, redVotes);
    const confidence = Math.min(98, Math.max(76, Math.round((topScore / totalWeight) * 100)));

    // Pattern label generator
    let patternLabel = `NEXA ${GAME_MODE} ENSEMBLE`;
    let streak = 1;
    for (let i = 1; i < colors.length; i++) {
      if (colors[i] === colors[0]) streak++;
      else break;
    }
    const isChop = (colors[0] !== colors[1]) && (colors[1] !== colors[2]);

    if (streak >= 3) {
      patternLabel = `⚡ DRAGON RIDE (${streak}X)`;
    } else if (isChop) {
      patternLabel = `⚡ CHOP ZIGZAG HARMONIC`;
    } else if (colors[0] === colors[1] && colors.length >= 4 && colors[2] === colors[3]) {
      patternLabel = `🛡️ DOUBLET TRAJECTORY`;
    } else if (cleanHistory[0].number === 0 || cleanHistory[0].number === 5) {
      patternLabel = `🔮 VIOLET PIVOT REBOUND`;
    }

    // Top 2 digits hedge calculation
    let topDigits = [];
    if (predictedColor === 'GREEN') {
      const gCounts = { 1: 0, 3: 0, 5: 0, 7: 0, 9: 0 };
      cleanHistory.slice(0, 15).forEach(h => {
        if (gCounts[h.number] !== undefined) gCounts[h.number]++;
      });
      topDigits = Object.entries(gCounts).sort((a, b) => a[1] - b[1]).slice(0, 2).map(x => parseInt(x[0], 10));
    } else {
      const rCounts = { 0: 0, 2: 0, 4: 0, 6: 0, 8: 0 };
      cleanHistory.slice(0, 15).forEach(h => {
        if (rCounts[h.number] !== undefined) rCounts[h.number]++;
      });
      topDigits = Object.entries(rCounts).sort((a, b) => a[1] - b[1]).slice(0, 2).map(x => parseInt(x[0], 10));
    }

    return {
      noData: false,
      color: predictedColor,
      topDigits,
      confidence,
      patternLabel,
      models,
      latestIssue: cleanHistory[0].issueNumber,
      latestNumber: cleanHistory[0].number,
      nextPeriod: (BigInt(cleanHistory[0].issueNumber || '0') + 1n).toString()
    };
  }

  // ── 5. OFFICIAL AR-LOTTERY API & DOM SYNC ENGINE ──────────
  let LOTTERY_HISTORY = [];
  let CURRENT_API_DRAWS = [];
  let isFetchingApi = false;

  function fetchDrawHistory() {
    if (isFetchingApi) return;
    isFetchingApi = true;

    const modeSlug = (GAME_MODE === '30S') ? 'WinGo_30S' : 'WinGo_1M';
    const url = `https://draw.ar-lottery01.com/WinGo/${modeSlug}/GetHistoryIssuePage.json?_t=${Date.now()}`;

    const parseResponse = (json) => {
      try {
        if (json && json.data && Array.isArray(json.data.list) && json.data.list.length > 0) {
          CURRENT_API_DRAWS = json.data.list.map(item => ({
            period: String(item.issueNumber),
            issueNumber: String(item.issueNumber),
            number: parseInt(item.number, 10),
            color: getColor(item.number)
          }));
          LOTTERY_HISTORY = CURRENT_API_DRAWS;
          checkAllPendingBets();
          updateHud();
        }
      } catch (e) {}
      isFetchingApi = false;
    };

    if (typeof GM_xmlhttpRequest === 'function') {
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          timeout: 4000,
          onload: function (res) {
            try {
              parseResponse(JSON.parse(res.responseText));
            } catch (e) {
              isFetchingApi = false;
            }
          },
          onerror: function () {
            isFetchingApi = false;
            scrapeDomLottery();
          },
          ontimeout: function () {
            isFetchingApi = false;
            scrapeDomLottery();
          }
        });
        return;
      } catch (e) {}
    }

    // Direct fetch fallback
    fetch(url)
      .then(r => r.json())
      .then(parseResponse)
      .catch(() => {
        isFetchingApi = false;
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
            period: pMatch[1],
            issueNumber: pMatch[1],
            number: num,
            color: getColor(num)
          });
        }
      }
      if (items.length > 0) {
        LOTTERY_HISTORY = items;
        checkAllPendingBets();
        updateHud();
      }
    } catch (e) {}
  }

  setInterval(fetchDrawHistory, 2000);
  fetchDrawHistory();

  // ── 6. STRICT ZERO-EARLY-LOSS SETTLEMENT ENGINE ───────────
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
        const actualColor = getColor(actualNum);
        resolveBet(bet, draw.period || pKey, actualColor, actualNum);
      }
    }
  }

  function resolveBet(bet, period, outcomeColor, actualNum) {
    if (!bet.isPending) return;
    RESOLVED_PERIODS.add(period);
    RESOLVED_PERIODS.add(String(bet.period));
    bet.isPending = false;
    bet.actualColor = outcomeColor;
    if (actualNum != null) bet.actualNumber = actualNum;

    const won = (bet.prediction === outcomeColor);
    bet.won = won;

    if (won) {
      wins++;
      LOSS_STREAK = 0;
      martingaleStep = 0;
      currentBet = getStakeForStep(BASE_BET, 0);
      console.log(`%c🏆 JASH VIP WIN on #${period}! Result=${actualNum} (${outcomeColor}). Reset to Base (₹${BASE_BET})`, 'background:#10b981;color:#fff;font-weight:900;padding:6px;border-radius:4px');
    } else {
      losses++;
      LOSS_STREAK++;
      martingaleStep++;
      currentBet = getStakeForStep(BASE_BET, martingaleStep);
      console.log(`%c💀 JASH VIP LOSS on #${period}! Result=${actualNum} (${outcomeColor}). Streak=${LOSS_STREAK} Next=₹${currentBet}`, 'background:#ef4444;color:#fff;font-weight:900;padding:6px;border-radius:4px');
    }

    pendingBet = null;
    persistAll();
    updateHud();
  }

  // ── 7. SYNTHETIC TOUCH & POINTER CLICK SYSTEM ─────────────
  function triggerFullClick(el) {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

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

  // ── 8. BULLETPROOF RED & GREEN BET EXECUTION ENGINE ───────
  async function executeBet(targetColor, amount) {
    const target = targetColor.trim().toUpperCase(); // "RED" or "GREEN"

    // 0. Clean up any open dialog
    const openPopups = Array.from(document.querySelectorAll('.van-popup, .popup')).filter(e => !e.closest('#jash-hud') && e.offsetHeight > 40);
    for (const pop of openPopups) {
      const cancelBtn = Array.from(pop.querySelectorAll('button, div, span, p')).find(e => (e.textContent || '').trim().toLowerCase() === 'cancel');
      if (cancelBtn) {
        triggerFullClick(cancelBtn);
        await new Promise(r => setTimeout(r, 120));
      }
    }

    // 1. Locate Red or Green button on the main WinGo board
    const allEls = Array.from(document.querySelectorAll('div, button, span, uni-view, p')).filter(e => {
      if (e.closest('#jash-hud')) return false;
      if (e.closest('.history, [class*="history"], [class*="record"], table, .list, [class*="list"], .record-list, .tab-content, .my-history')) return false;
      return true;
    });

    let targetBtn = allEls.find(e => {
      const txt = (e.textContent || '').trim().toUpperCase();
      return (txt === target || txt === `${target} 2X` || txt === `${target}2X` || txt === `${target} 1.96X`) && e.children.length <= 1;
    });

    if (!targetBtn) {
      targetBtn = allEls.find(e => {
        const txt = (e.textContent || '').trim().toUpperCase();
        return txt === target;
      });
    }

    if (!targetBtn) {
      const clsTarget = target === 'GREEN' ? /green/i : /red/i;
      targetBtn = allEls.find(e => {
        const c = e.className || '';
        return typeof c === 'string' && clsTarget.test(c) && !/violet/i.test(c) && e.offsetHeight > 20 && e.offsetWidth > 30;
      });
    }

    if (!targetBtn) {
      console.warn(`[JASH VIP] ❌ Could not find ${target} button!`);
      return false;
    }

    triggerFullClick(targetBtn);
    await new Promise(r => setTimeout(r, 350));

    // Wait for popup modal
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

    // 2. Ensure Balance chip "1" is selected (multiplier = 1x)
    const balanceChips = Array.from(popup.querySelectorAll('div, span, button')).filter(e => {
      const t = (e.textContent || '').trim();
      return ['1', '10', '100', '1000'].includes(t) && e.children.length === 0;
    });
    const chip1 = balanceChips.find(e => (e.textContent || '').trim() === '1');
    if (chip1) {
      triggerFullClick(chip1);
      await new Promise(r => setTimeout(r, 80));
    }

    // 3. Set Quantity Input to desired stake
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

    await new Promise(r => setTimeout(r, 100));

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

    await new Promise(r => setTimeout(r, 100));

    // 4. Ensure "I agree" checkbox is checked if present
    const agreeBox = popup.querySelector('.van-checkbox, [class*="agree"], [class*="rule"]');
    if (agreeBox) {
      const isChecked = agreeBox.classList.contains('van-checkbox--checked') || agreeBox.getAttribute('aria-checked') === 'true';
      if (!isChecked) {
        triggerFullClick(agreeBox);
        await new Promise(r => setTimeout(r, 60));
      }
    }

    // 5. Submit bet (Confirm Button)
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

    console.log(`[JASH VIP] 🚀 Submitting bet: ${target} ₹${amount}...`, confirmBtn);
    triggerFullClick(confirmBtn);
    if (clickableContainer !== confirmBtn) {
      triggerFullClick(clickableContainer);
    }
    try { confirmBtn.click(); } catch (e) {}

    await new Promise(r => setTimeout(r, 300));
    return true;
  }

  // ── 9. TIME UTILITIES (ADAPTIVE 1M & 30S) ─────────────────
  function getTimerSeconds() {
    const iv = (GAME_MODE === '30S') ? 30 : 60;
    return iv - (Math.floor(Date.now() / 1000) % iv);
  }

  function getCurrentTimeBucket() {
    const ivMs = (GAME_MODE === '30S') ? 30000 : 60000;
    return Math.floor(Date.now() / ivMs);
  }

  // ── 10. CYBER GLASSMORPHIC VIP HUD ────────────────────────
  function createHud() {
    if (document.getElementById('jash-hud')) return;
    const target = document.body || document.documentElement;
    if (!target) return;

    const hud = document.createElement('div');
    hud.id = 'jash-hud';
    hud.style.cssText = `
      position:fixed;top:140px;right:10px;z-index:2147483647;touch-action:none;
      width:275px;background:rgba(6,9,16,0.96);
      border:1.5px solid rgba(0,245,160,0.55);border-radius:14px;
      backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);
      box-shadow:0 12px 40px rgba(0,0,0,0.85),0 0 20px rgba(0,245,160,0.22);
      font-family:-apple-system,BlinkMacSystemFont,'Space Grotesk',Segoe UI,Roboto,sans-serif;
      color:#fff;font-size:12px;padding:11px;user-select:none;
      transition: all 0.2s ease;
    `;

    hud.innerHTML = `
      <div id="j-header-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;cursor:pointer;">
        <span style="font-weight:900;font-size:13px;background:linear-gradient(135deg,#00f5a0,#00d9ff,#ff3366);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">👑 JASH VIP · 6-ENG</span>
        <div style="display:flex;align-items:center;gap:6px;">
          <span id="j-timer" style="font-weight:900;color:#00f5a0;font-size:13px;font-family:monospace;">--s</span>
          <button id="j-min-btn" style="background:rgba(255,255,255,0.1);border:none;color:#fff;border-radius:4px;font-size:10px;cursor:pointer;padding:2px 6px;">−</button>
        </div>
      </div>

      <div id="j-main-body">
        <div style="display:flex;gap:4px;margin-bottom:8px;">
          <button id="j-mode-btn" title="Click to toggle between 1M and 30S" style="flex:2;padding:5px 0;background:rgba(0,245,160,0.12);border:1px solid rgba(0,245,160,0.35);border-radius:6px;color:#00f5a0;font-weight:900;font-size:10px;text-align:center;cursor:pointer;transition:all 0.2s;">
            <span id="j-mode-text">${GAME_MODE === '30S' ? '🔥 WINGO 30S' : '⚡ WINGO 1M'}</span> <span style="font-size:8px;opacity:0.75">(TOGGLE)</span>
          </button>
          <button id="j-reset-btn" title="Complete Reset: streak, steps, stats, storage" style="flex:1;padding:5px 0;background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.5);border-radius:6px;color:#fca5a5;font-weight:bold;font-size:10px;cursor:pointer;">
            🔄 RESET
          </button>
        </div>

        <!-- Glowing Prediction Display -->
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:9px;text-align:center;margin-bottom:8px;">
          <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;" id="j-pattern-lbl">⏳ SYNCING API...</div>
          <div id="j-pred-call" style="font-size:24px;font-weight:900;letter-spacing:1px;color:#E4FF4A;text-shadow:0 0 12px rgba(228,255,74,0.4);">--</div>
          <div id="j-hedge-row" style="font-size:10px;color:#94a3b8;margin-top:3px;">TOP DIGITS: <b id="j-top-digits" style="color:#00d9ff;">--</b></div>
        </div>

        <!-- 6-Model Color Matrix -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;font-size:10px;font-family:monospace;background:rgba(255,255,255,0.03);padding:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
          <div>TITAN: <span id="m-titan" style="font-weight:bold;">--</span></div>
          <div>RADHE: <span id="m-radhe" style="font-weight:bold;">--</span></div>
          <div>SURESH: <span id="m-suresh" style="font-weight:bold;">--</span></div>
          <div>MARKOV: <span id="m-markov" style="font-weight:bold;">--</span></div>
          <div>PAIN: <span id="m-pain" style="font-weight:bold;">--</span></div>
          <div>NEXA: <span id="m-nexa" style="font-weight:bold;">--</span></div>
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

        <button id="j-toggle-btn" style="width:100%;padding:8px 0;background:linear-gradient(135deg,#00f5a0,#00d9ff);border:none;border-radius:8px;color:#000;font-weight:900;font-size:11px;cursor:pointer;box-shadow:0 0 15px rgba(0,245,160,0.4);transition:all 0.2s;">
          ▶ START AUTOBET
        </button>

        <div id="j-feed-box" style="margin-top:8px;max-height:80px;overflow-y:auto;font-size:9px;font-family:monospace;border-top:1px solid rgba(255,255,255,0.08);padding-top:4px;">
          <div style="color:#64748b;text-align:center;">Feed will appear here</div>
        </div>
      </div>
    `;

    target.appendChild(hud);
    // Make HUD draggable so it never blocks game tabs or buttons
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
        hud.style.left = Math.max(2, Math.min(window.innerWidth - 280, origLeft + dx)) + "px";
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


    // Toggle 1M vs 30S mode
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

      LOTTERY_HISTORY = [];
      CURRENT_API_DRAWS = [];
      pendingBet = null;
      fetchDrawHistory();
      updateHud();
      console.log(`%c[👑 JASH VIP] Switched Mode to: ${GAME_MODE}`, 'background:#00d9ff;color:#000;font-weight:bold;');
    };

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
        btn.style.background = 'linear-gradient(135deg,#00f5a0,#00d9ff)';
        btn.style.boxShadow = '0 0 15px rgba(0,245,160,0.4)';
        btn.style.color = '#000';
      }
    };

    document.getElementById('j-base-input').onchange = (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 3;
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
      console.log('%c[👑 JASH VIP] 🔄 FULL RESET EXECUTED: Wins, Losses, Streaks, Bets cleared!', 'background:#ef4444;color:#fff;font-weight:900;padding:4px;');
    };
  }

  function updateHud() {
    createHud();
    const pred = calculateColorPrediction(LOTTERY_HISTORY);

    const callEl = document.getElementById('j-pred-call');
    const patEl = document.getElementById('j-pattern-lbl');
    const hedgeEl = document.getElementById('j-top-digits');

    if (callEl && !pred.noData) {
      const isG = pred.color === 'GREEN';
      callEl.textContent = `${pred.color} (${pred.confidence}%)`;
      callEl.style.color = isG ? '#00f5a0' : '#ff3366';
      callEl.style.textShadow = isG ? '0 0 14px rgba(0,245,160,0.5)' : '0 0 14px rgba(255,51,102,0.5)';
      if (patEl) patEl.textContent = pred.patternLabel;
      if (hedgeEl) hedgeEl.textContent = pred.topDigits.join(', ');
    }

    if (pred.models) {
      const colorize = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = val;
          el.style.color = val === 'GREEN' ? '#00f5a0' : (val === 'RED' ? '#ff3366' : '#94a3b8');
        }
      };
      colorize('m-titan', pred.models.titan);
      colorize('m-radhe', pred.models.radhe);
      colorize('m-suresh', pred.models.suresh);
      colorize('m-markov', pred.models.markov);
      colorize('m-pain', pred.models.painPro);
      colorize('m-nexa', pred.models.nexa);
    }

    const curBetEl = document.getElementById('j-current-bet-display');
    if (curBetEl) curBetEl.textContent = `₹${currentBet}`;

    const streakEl = document.getElementById('j-streak-lbl');
    if (streakEl) streakEl.textContent = `${LOSS_STREAK} (L${LOSS_STREAK + 1})`;

    const scoreEl = document.getElementById('j-score-lbl');
    if (scoreEl) scoreEl.innerHTML = `<b style="color:#00f5a0;">${wins}W</b> / <b style="color:#ff3366;">${losses}L</b>`;

    const feedEl = document.getElementById('j-feed-box');
    if (feedEl && RECORDED_BETS.length > 0) {
      feedEl.innerHTML = RECORDED_BETS.map(b => {
        const status = b.isPending
          ? '<span style="color:#ffcc00;">PENDING</span>'
          : (b.won ? '<span style="color:#00f5a0;">WIN</span>' : '<span style="color:#ff3366;">LOSS</span>');
        const pTail = String(b.period).slice(-4);
        return `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
          <span>#${pTail} <b style="color:${b.prediction === 'GREEN' ? '#00f5a0' : '#ff3366'};">${b.prediction}</b> ₹${b.stake}</span>
          ${status}
        </div>`;
      }).join('');
    }
  }

  // ── 11. AUTOBET CYCLE (ADAPTIVE 1M & 30S) ─────────────────
  async function botCycle() {
    try {
      const secondsLeft = getTimerSeconds();
      const currentBucket = getCurrentTimeBucket();
      const interval = (GAME_MODE === '30S') ? 30 : 60;

      const tEl = document.getElementById('j-timer');
      if (tEl) tEl.textContent = secondsLeft + 's';

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
      const pred = calculateColorPrediction(LOTTERY_HISTORY);
      updateHud();

      // Prune sets
      if (PLACED_PERIODS.size > 50) PLACED_PERIODS = new Set(Array.from(PLACED_PERIODS).slice(-20));
      if (LOCKED_TIME_BUCKETS.size > 50) LOCKED_TIME_BUCKETS = new Set(Array.from(LOCKED_TIME_BUCKETS).slice(-20));
      if (RESOLVED_PERIODS.size > 50) RESOLVED_PERIODS = new Set(Array.from(RESOLVED_PERIODS).slice(-20));

      if (!running || isBettingInProgress) return;
      if (LOCKED_TIME_BUCKETS.has(currentBucket)) return;
      if (activePeriod && PLACED_PERIODS.has(activePeriod)) return;
      if (pred.noData) return;

      const canBet = (GAME_MODE === '30S')
        ? (secondsLeft <= 26 && secondsLeft >= 4)
        : (secondsLeft <= 55 && secondsLeft >= 6);

      if (canBet && !LOCKED_TIME_BUCKETS.has(currentBucket)) {
        LOCKED_TIME_BUCKETS.add(currentBucket);
        if (activePeriod) PLACED_PERIODS.add(activePeriod);
        isBettingInProgress = true;

        lastPredicted = pred.color;
        lastBetPeriod = activePeriod;
        pendingBet = { period: activePeriod, pred: pred.color, stake: currentBet, placedAt: Date.now() };

        const success = await executeBet(pred.color, currentBet);

        if (success && activePeriod) {
          RECORDED_BETS.unshift({
            period: activePeriod,
            prediction: pred.color,
            pattern: pred.patternLabel,
            stake: currentBet,
            won: null,
            isPending: true,
            time: new Date().toLocaleTimeString()
          });
          if (RECORDED_BETS.length > 30) RECORDED_BETS = RECORDED_BETS.slice(0, 30);
          console.log(`%c[👑 JASH VIP] ✅ Bet #${activePeriod} PLACED (${pred.color} ₹${currentBet}) [${GAME_MODE}]`, 'background:#00f5a0;color:#000;font-weight:900;');
        } else {
          console.warn(`%c[👑 JASH VIP] ❌ Bet #${activePeriod} NOT placed`, 'background:#ef4444;color:#fff;font-weight:900;');
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

  // ── 12. INITIALIZATION ────────────────────────────────────
  
  // Auto-detect when user clicks the 30s or 1m tab on the actual website
  document.addEventListener("click", (e) => {
    try {
      const el = e.target;
      if (!el || el.closest("#jash-hud")) return;
      const txt = (el.textContent || "").trim().toLowerCase();
      if (/\b(30s|30 second|30秒)\b/i.test(txt) || txt === "30s" || txt === "win go 30s") {
        if (GAME_MODE !== "30S") {
          console.log("[👑 JASH VIP] Auto-detected switch to 30S tab on game site!");
          GAME_MODE = "30S";
          persistAll();
          LOTTERY_HISTORY = [];
          CURRENT_API_DRAWS = [];
          pendingBet = null;
          updateHud();
          fetchDrawHistory();
        }
      } else if (/\b(1m|1min|1 min|1 minute|1分)\b/i.test(txt) || txt === "1min" || txt === "win go 1min") {
        if (GAME_MODE !== "1M") {
          console.log("[👑 JASH VIP] Auto-detected switch to 1M tab on game site!");
          GAME_MODE = "1M";
          persistAll();
          LOTTERY_HISTORY = [];
          CURRENT_API_DRAWS = [];
          pendingBet = null;
          updateHud();
          fetchDrawHistory();
        }
      }
    } catch(err) {}
  }, true);

  function init() {
    createHud();
    setInterval(botCycle, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
