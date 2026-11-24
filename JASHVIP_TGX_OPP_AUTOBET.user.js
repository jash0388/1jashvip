// ==UserScript==
// @name         JASH VIP TGX OWNER — WinGo Big/Small + 2 Opposite Numbers AutoBet & Martingale HUD
// @namespace    https://github.com/jash0388/jashvip
// @version      41.0
// @description  ⚡ 100% TGX Owner 2-Level Fix Engine with Dual Hedge AutoBet (Big/Small + 2 Opposite Numbers) + Martingale Multiplier + Live Popup HUD for 30S & 1M WinGo.
// @match        *://*.dmfirst7.com/*
// @match        *://*.dmfirst0.com/*
// @match        *://*.dmfirst*.com/*
// @match        *://*.in999vv.com/*
// @match        *://*.in999*.com/*
// @match        *://*.us3b7o.com/*
// @match        *://*.daman*.com/*
// @match        *://*.tiranga*.com/*
// @match        *://*.bdg*.com/*
// @match        *://*.91club*.com/*
// @match        *://*.jalwa*.com/*
// @match        *://*.bigmumbai*.com/*
// @match        *://*.diuwin*.com/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      draw.ar-lottery01.com
// @connect      dmfirst.com
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  if (window.__JASH_TGX_AUTOBET_ACTIVE__) return;
  window.__JASH_TGX_AUTOBET_ACTIVE__ = true;

  console.log(
    "%c⚡ JASH VIP TGX OWNER 2-LVL FIX · DUAL HEDGE AUTOBET (BIG/SMALL + 2 OPP NUMBERS)",
    "background:linear-gradient(135deg,#00ffff,#8a2be2,#ccff00);color:#000;font-size:15px;font-weight:900;padding:8px 16px;border-radius:8px;box-shadow:0 0 25px rgba(0,255,255,0.6);"
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

  // ── 2. STATE PERSISTENCE ─────────────────────────────────
  let GAME_MODE = localStorage.getItem('TGX_MODE') || '30S';
  if (GAME_MODE !== '30S' && GAME_MODE !== '1M') GAME_MODE = '30S';

  let BASE_MAIN_BET = parseInt(localStorage.getItem('TGX_BASE_MAIN') || '10', 10);
  if (isNaN(BASE_MAIN_BET) || BASE_MAIN_BET < 1) BASE_MAIN_BET = 10;

  let BASE_OPP_BET = parseInt(localStorage.getItem('TGX_BASE_OPP') || '2', 10);
  if (isNaN(BASE_OPP_BET) || BASE_OPP_BET < 1) BASE_OPP_BET = 2;

  let MAX_MARTINGALE_LVL = parseInt(localStorage.getItem('TGX_MAX_LVL') || '2', 10); // Default 2 LVL FIX
  let HEDGE_MULTIPLIES = localStorage.getItem('TGX_HEDGE_MULT') !== 'false'; // Default true

  let currentLevel = 1; // 1-indexed (Level 1, Level 2, Level 3, Level 4)
  const MULTIPLIERS = [1, 3, 9, 27];

  function getMultiplier(lvl) {
    const idx = Math.max(0, Math.min(lvl - 1, MULTIPLIERS.length - 1));
    return MULTIPLIERS[idx];
  }

  let running = localStorage.getItem('TGX_AUTOBET_RUNNING') === 'true';
  let winsDirect = parseInt(localStorage.getItem('TGX_WINS_DIRECT') || '0', 10);
  let winsHedge  = parseInt(localStorage.getItem('TGX_WINS_HEDGE') || '0', 10);
  let totalLosses= parseInt(localStorage.getItem('TGX_LOSSES') || '0', 10);

  let currentPeriod = null;
  let lastPredictedSize = null;
  let lastTargetNums = [];
  let isBettingInProgress = false;

  let PLACED_PERIODS = new Set();
  let RESOLVED_PERIODS = new Set();
  let LOCKED_TIME_BUCKETS = new Set();
  let PENDING_ROUND = null; // { period, predSize, targetNums, mainStake, oppStake, placedAt }
  let RECORDED_LOGS = [];

  function persistConfig() {
    localStorage.setItem('TGX_MODE', GAME_MODE);
    localStorage.setItem('TGX_BASE_MAIN', String(BASE_MAIN_BET));
    localStorage.setItem('TGX_BASE_OPP', String(BASE_OPP_BET));
    localStorage.setItem('TGX_MAX_LVL', String(MAX_MARTINGALE_LVL));
    localStorage.setItem('TGX_HEDGE_MULT', String(HEDGE_MULTIPLIES));
    localStorage.setItem('TGX_AUTOBET_RUNNING', String(running));
    localStorage.setItem('TGX_WINS_DIRECT', String(winsDirect));
    localStorage.setItem('TGX_WINS_HEDGE', String(winsHedge));
    localStorage.setItem('TGX_LOSSES', String(totalLosses));
  }

  // ── 3. DRAW HISTORY & TGX PREDICTION ENGINE ──────────────
  let LOTTERY_HISTORY = [];

  const API_CONFIG = {
    '30S': {
      cycle: 30,
      primaryApi: "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json",
      fallbackApi: "https://dmfirst.com/v1/sites/dm-first/results?typeId=30"
    },
    '1M': {
      cycle: 60,
      primaryApi: "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json",
      fallbackApi: "https://dmfirst.com/v1/sites/dm-first/results?typeId=1"
    }
  };

  function fetchDrawHistory() {
    const cfg = API_CONFIG[GAME_MODE];
    const fetchUrl = `${cfg.primaryApi}?t=${Date.now()}`;

    if (typeof GM_xmlhttpRequest === 'function') {
      GM_xmlhttpRequest({
        method: 'GET',
        url: fetchUrl,
        timeout: 4000,
        onload: function (res) {
          try {
            const data = JSON.parse(res.responseText);
            if (data?.data?.list?.length) {
              LOTTERY_HISTORY = data.data.list.map(x => ({
                issueNumber: String(x.issueNumber),
                number: String(x.number)
              }));
              checkPendingSettlement();
            }
          } catch (e) {
            scrapeDomLottery();
          }
        },
        onerror: scrapeDomLottery
      });
    } else {
      fetch(fetchUrl, { cache: 'no-store' })
        .then(r => r.json())
        .then(data => {
          if (data?.data?.list?.length) {
            LOTTERY_HISTORY = data.data.list.map(x => ({
              issueNumber: String(x.issueNumber),
              number: String(x.number)
            }));
            checkPendingSettlement();
          }
        })
        .catch(scrapeDomLottery);
    }
  }

  function scrapeDomLottery() {
    try {
      const rows = Array.from(document.querySelectorAll('.van-row, tr, [class*="record"], [class*="item"]')).filter(r => !r.closest('#jash-hud'));
      const parsed = [];
      for (const r of rows) {
        const text = r.textContent || '';
        const mPeriod = text.match(/\b(2026\d{10,14})\b/);
        const mNum = text.match(/\b([0-9])\b/);
        if (mPeriod && mNum) {
          parsed.push({ issueNumber: mPeriod[1], number: mNum[1] });
        }
      }
      if (parsed.length >= 3) {
        LOTTERY_HISTORY = parsed;
        checkPendingSettlement();
      }
    } catch (e) {}
  }

  // ── 4. EXACT TGX OWNER 2-LEVEL FIX PREDICTION FORMULA ─────
  function calculateTgxPrediction() {
    if (!LOTTERY_HISTORY || LOTTERY_HISTORY.length < 5) {
      return { ready: false };
    }

    const last5 = LOTTERY_HISTORY.slice(0, 5).map(x => parseInt(x.number, 10) >= 5 ? "BIG" : "SMALL");
    const lastNums = LOTTERY_HISTORY.slice(0, 5).map(x => parseInt(x.number, 10));

    let nextP, modeLabel;
    if (last5[0] === last5[1] && last5[1] === last5[2]) {
      nextP = last5[0];
      modeLabel = "DRAGON PULSE";
    } else {
      nextP = (last5[0] === "BIG") ? "SMALL" : "BIG";
      modeLabel = "NEURAL REVERSE";
    }

    // EXACT 2 OPPOSITE NUMBERS LOGIC
    const sum = lastNums.reduce((a, b) => a + b, 0);
    let targetNums;
    if (nextP === "BIG") {
      targetNums = (sum > 20) ? [0, 2] : [1, 3];
    } else {
      targetNums = (sum < 25) ? [7, 9] : [6, 8];
    }

    return {
      ready: true,
      pred: nextP,
      oppNums: targetNums,
      mode: modeLabel
    };
  }

  // ── 5. SETTLEMENT & MARTINGALE PROGRESSION ─────────────────
  function checkPendingSettlement() {
    if (!PENDING_ROUND || !LOTTERY_HISTORY.length) return;

    const roundPeriod = String(PENDING_ROUND.period).trim();
    if (RESOLVED_PERIODS.has(roundPeriod)) return;

    const match = LOTTERY_HISTORY.find(x => String(x.issueNumber).trim() === roundPeriod);
    if (!match) return;

    RESOLVED_PERIODS.add(roundPeriod);
    const actualNum = parseInt(match.number, 10);
    const actualSize = actualNum >= 5 ? "BIG" : "SMALL";

    const directMatch = (PENDING_ROUND.predSize === actualSize);
    const hedgeMatch  = PENDING_ROUND.targetNums.includes(actualNum);
    const won = directMatch || hedgeMatch;

    let statusText = 'LOSS ❌';
    let winType = 'loss';

    if (directMatch) {
      statusText = 'DIRECT WIN 🏆';
      winType = 'direct';
      winsDirect++;
      currentLevel = 1; // Reset Martingale on Win
    } else if (hedgeMatch) {
      statusText = `HEDGE WIN 🛡️ (${actualNum})`;
      winType = 'hedge';
      winsHedge++;
      currentLevel = 1; // Reset Martingale on Win
    } else {
      totalLosses++;
      currentLevel++;
      if (currentLevel > MAX_MARTINGALE_LVL) {
        currentLevel = 1; // Reset if exceeded configured max level (e.g. 2 LVL FIX)
      }
    }

    persistConfig();

    RECORDED_LOGS.unshift({
      period: roundPeriod.slice(-4),
      pred: PENDING_ROUND.predSize,
      opp: `[${PENDING_ROUND.targetNums.join(',')}]`,
      result: `${actualSize}(${actualNum})`,
      status: statusText,
      winType: winType
    });
    if (RECORDED_LOGS.length > 25) RECORDED_LOGS = RECORDED_LOGS.slice(0, 25);

    console.log(`%c[TGX OWNER SETTLED] #${roundPeriod} Result: ${actualSize}(${actualNum}) -> ${statusText} (Next Lvl: ${currentLevel})`,
      won ? 'color:#00ff6a;font-weight:bold' : 'color:#ff3b3b;font-weight:bold');

    PENDING_ROUND = null;
    updateHud();
  }

  // ── 6. NATIVE CLICK & INPUT DISPATCHERS ────────────────────
  function triggerFullClick(el) {
    if (!el) return;
    try {
      const opts = { bubbles: true, cancelable: true, view: window };
      el.dispatchEvent(new PointerEvent('pointerdown', opts));
      el.dispatchEvent(new MouseEvent('mousedown', opts));
      el.dispatchEvent(new PointerEvent('pointerup', opts));
      el.dispatchEvent(new MouseEvent('mouseup', opts));
      el.dispatchEvent(new MouseEvent('click', opts));
      if (typeof el.click === 'function') el.click();
    } catch (e) {
      try { el.click(); } catch (err) {}
    }
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // ── 7. DOM ELEMENT LOCATORS (BIG/SMALL & NUMBERS 0-9) ─────
  function findSizeButton(targetSize) {
    const target = targetSize.trim().toUpperCase();
    const regexExact = target === 'BIG'
      ? /^(big|大)(\s*[12]\.?\d*x?)?$/i
      : /^(small|小)(\s*[12]\.?\d*x?)?$/i;

    const candidates = Array.from(document.querySelectorAll('div, button, span, uni-view, uni-button, p')).filter(e => {
      if (e.closest('#jash-hud') || e.closest('.van-popup, .popup')) return false;
      if (e.closest('.history, [class*="history"], [class*="record"], table, .record-list, .my-history, [class*="GameRecord"]')) return false;
      return e.offsetWidth > 25 && e.offsetHeight > 18;
    });

    let btn = candidates.find(e => regexExact.test((e.innerText || e.textContent || '').trim().replace(/\s+/g, ' ')));
    if (!btn) {
      const clsRegex = target === 'BIG' ? /\b(big|btn-big|bet-big|bet_big)\b/i : /\b(small|btn-small|bet-small|bet_small)\b/i;
      btn = candidates.find(e => typeof e.className === 'string' && clsRegex.test(e.className));
    }
    if (!btn) {
      btn = candidates.find(e => {
        const txt = (e.innerText || e.textContent || '').trim();
        return (target === 'BIG' ? /^big\b/i.test(txt) : /^small\b/i.test(txt)) && txt.length <= 15;
      });
    }
    return btn;
  }

  function findNumberButton(targetNum) {
    const numStr = String(targetNum).trim();
    const regexNum = new RegExp(`^${numStr}(\\s*[1-9]\\.?\\d*x?)?$`, 'i');

    const candidates = Array.from(document.querySelectorAll('div, button, span, uni-view, uni-button, p')).filter(e => {
      if (e.closest('#jash-hud') || e.closest('.van-popup, .popup')) return false;
      if (e.closest('.history, [class*="history"], [class*="record"], table, .record-list, .my-history, [class*="GameRecord"]')) return false;
      return e.offsetWidth > 15 && e.offsetHeight > 15;
    });

    // 1. Exact text match "0", "1", ... "9"
    let btn = candidates.find(e => regexNum.test((e.innerText || e.textContent || '').trim().replace(/\s+/g, ' ')) && e.children.length <= 2);

    // 2. Class/attribute match
    if (!btn) {
      btn = candidates.find(e => {
        const c = typeof e.className === 'string' ? e.className : '';
        return (c.includes(`num-${numStr}`) || c.includes(`ball-${numStr}`) || c.includes(`number-${numStr}`));
      });
    }

    // 3. Fallback text
    if (!btn) {
      btn = candidates.find(e => (e.innerText || e.textContent || '').trim() === numStr);
    }
    return btn;
  }

  async function setModalQuantity(popup, targetAmount) {
    const inp = popup.querySelector('.van-stepper__input, input[type="tel"], input[type="number"], input');
    if (inp) {
      try {
        inp.focus();
        const proto = window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (nativeSetter) nativeSetter.call(inp, String(targetAmount));
        else inp.value = String(targetAmount);

        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));

        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, String(targetAmount));
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        inp.blur();
      } catch (e) {}
    }
    await sleep(40);
  }

  // ── 8. BULLETPROOF BET EXECUTION ENGINE ────────────────────
  async function executeBet(type, targetVal, amount) {
    if (!amount || amount < 1) return false;

    // 0. Clean up any open popup
    const openPopups = Array.from(document.querySelectorAll('.van-popup, .popup, [class*="popup"], [class*="dialog"]')).filter(e => !e.closest('#jash-hud') && e.offsetHeight > 40);
    for (const pop of openPopups) {
      const cancelBtn = Array.from(pop.querySelectorAll('button, div, span, p')).find(e => (e.textContent || '').trim().toLowerCase() === 'cancel');
      if (cancelBtn) {
        triggerFullClick(cancelBtn);
        await sleep(80);
      }
    }

    // 1. Locate Target Button on the Board
    let targetBtn = (type === 'SIZE') ? findSizeButton(targetVal) : findNumberButton(targetVal);

    if (!targetBtn) {
      console.warn(`[TGX AUTOBET] ❌ Could not find ${type} button for [${targetVal}]!`);
      return false;
    }

    try { targetBtn.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {}

    triggerFullClick(targetBtn);
    const parentClickable = targetBtn.closest('button, [role="button"], uni-button, .van-button');
    if (parentClickable && parentClickable !== targetBtn) {
      triggerFullClick(parentClickable);
    }
    await sleep(GAME_MODE === '30S' ? 120 : 220);

    // 2. Wait for Modal Dialog
    let popup = null;
    for (let i = 0; i < 12; i++) {
      popup = Array.from(document.querySelectorAll('.van-popup, .popup, [class*="popup"], [class*="dialog"]')).find(p => p.offsetHeight > 50 && !p.closest('#jash-hud'));
      if (popup) break;
      await sleep(50);
    }

    if (!popup) {
      console.warn(`[TGX AUTOBET] ❌ Bet popup did not open for [${targetVal}]!`);
      return false;
    }

    // 3. Ensure 1X Balance Chip is selected
    const balanceChips = Array.from(popup.querySelectorAll('div, span, button, uni-view')).filter(e => {
      const t = (e.textContent || '').trim();
      return ['1', '10', '100', '1000'].includes(t) && e.children.length === 0;
    });
    const chip1 = balanceChips.find(e => (e.textContent || '').trim() === '1');
    if (chip1) {
      triggerFullClick(chip1);
      await sleep(30);
    }

    // 4. Set Quantity Amount
    await setModalQuantity(popup, amount);

    // 5. Check Agree box if present
    const agreeBox = popup.querySelector('.van-checkbox, [class*="agree"], [class*="rule"]');
    if (agreeBox && !agreeBox.classList.contains('van-checkbox--checked')) {
      triggerFullClick(agreeBox);
      await sleep(30);
    }

    // 6. Confirm Bet
    let confirmBtn = popup.querySelector('button[class*="submit"], button[class*="confirm"], .van-button--danger, .van-button--primary, [class*="btn-confirm"], [class*="btn-submit"]');
    if (!confirmBtn) {
      const allEls = Array.from(popup.querySelectorAll('*')).filter(e => !e.closest('#jash-hud'));
      confirmBtn = allEls.find(e => /^(Confirm|Submit|Order|Buy|Bet|Presale|Pre-sale|立即投注)$/i.test((e.textContent || '').trim()) && !/Cancel/i.test(e.textContent));
    }

    if (!confirmBtn) {
      console.warn(`[TGX AUTOBET] ❌ Confirm button not found for [${targetVal}]!`);
      return false;
    }

    console.log(`%c[TGX BET PLACED] ${type} [${targetVal}] -> ₹${amount}`, 'color:#00ffff;font-weight:bold;');
    triggerFullClick(confirmBtn);
    await sleep(GAME_MODE === '30S' ? 120 : 200);
    return true;
  }

  // ── 9. TIMING & MAIN BOT LOOP ─────────────────────────────
  function getTimerSeconds() {
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

    const iv = (GAME_MODE === '30S') ? 30 : 60;
    return iv - (Math.floor(Date.now() / 1000) % iv);
  }

  function getCurrentTimeBucket() {
    const ivMs = (GAME_MODE === '30S') ? 30000 : 60000;
    return Math.floor(Date.now() / ivMs);
  }

  async function botCycle() {
    try {
      const secLeft = getTimerSeconds();
      const currentBucket = getCurrentTimeBucket();

      const tEl = document.getElementById('tgx-timer');
      if (tEl) {
        tEl.textContent = secLeft + 's';
        tEl.style.color = secLeft <= 5 ? '#ff3b3b' : '#ccff00';
      }

      // Check results settlement
      checkPendingSettlement();

      // Poll history near boundary
      const isBoundary = (GAME_MODE === '30S')
        ? (secLeft <= 3 || secLeft >= 28)
        : (secLeft <= 4 || secLeft >= 58);
      if (isBoundary) fetchDrawHistory();

      // Detect active period
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

      if (LOTTERY_HISTORY.length > 0) {
        try {
          const apiNext = (BigInt(LOTTERY_HISTORY[0].issueNumber) + 1n).toString();
          if (!activePeriod || BigInt(apiNext) > maxFound) activePeriod = apiNext;
        } catch (e) {}
      }

      currentPeriod = activePeriod;
      const predObj = calculateTgxPrediction();

      if (predObj.ready) {
        lastPredictedSize = predObj.pred;
        lastTargetNums = predObj.oppNums;
      }
      updateHud();

      // Prune sets
      if (PLACED_PERIODS.size > 50) PLACED_PERIODS = new Set(Array.from(PLACED_PERIODS).slice(-20));
      if (LOCKED_TIME_BUCKETS.size > 50) LOCKED_TIME_BUCKETS = new Set(Array.from(LOCKED_TIME_BUCKETS).slice(-20));

      // Guard conditions
      if (!running || isBettingInProgress) return;
      if (LOCKED_TIME_BUCKETS.has(currentBucket)) return;
      if (activePeriod && PLACED_PERIODS.has(activePeriod)) return;
      if (!predObj.ready) return;

      // Betting Window: Safe timing before 5-second lock
      const canBet = (GAME_MODE === '30S')
        ? (secLeft <= 25 && secLeft >= 7)
        : (secLeft <= 54 && secLeft >= 8);

      if (canBet) {
        LOCKED_TIME_BUCKETS.add(currentBucket);
        if (activePeriod) PLACED_PERIODS.add(activePeriod);
        isBettingInProgress = true;

        const mult = getMultiplier(currentLevel);
        const mainStake = BASE_MAIN_BET * mult;
        const oppStake = HEDGE_MULTIPLIES ? (BASE_OPP_BET * mult) : BASE_OPP_BET;

        console.log(`%c[TGX TRIGGER] #${activePeriod} | Level ${currentLevel} (${mult}X) | Bet: ${predObj.pred} ₹${mainStake} + Opp [${predObj.oppNums.join(',')}] ₹${oppStake} each`,
          'background:#0b0c1e;color:#00ffff;font-size:13px;font-weight:bold;padding:4px 8px;border:1px solid #00ffff');

        PENDING_ROUND = {
          period: activePeriod,
          predSize: predObj.pred,
          targetNums: [...predObj.oppNums],
          mainStake: mainStake,
          oppStake: oppStake,
          placedAt: Date.now()
        };

        // 1. Place Main Bet on Big/Small
        await executeBet('SIZE', predObj.pred, mainStake);
        await sleep(100);

        // 2. Place Bet on Opposite Number 1
        await executeBet('NUMBER', predObj.oppNums[0], oppStake);
        await sleep(100);

        // 3. Place Bet on Opposite Number 2
        await executeBet('NUMBER', predObj.oppNums[1], oppStake);

        isBettingInProgress = false;
        updateHud();
      }
    } catch (e) {
      isBettingInProgress = false;
    }
  }

  // ── 10. INTERACTIVE FLOATING POPUP HUD ─────────────────────
  function createHud() {
    if (document.getElementById('jash-hud')) return;
    const container = document.body || document.documentElement;
    if (!container) return;

    const hud = document.createElement('div');
    hud.id = 'jash-hud';
    hud.style.cssText = `
      position:fixed;top:120px;right:10px;z-index:2147483647;touch-action:none;
      width:290px;background:rgba(11,12,30,0.95);
      border:1.5px solid rgba(0,255,255,0.45);border-radius:16px;
      backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
      box-shadow:0 12px 40px rgba(0,0,0,0.9),0 0 25px rgba(0,255,255,0.25);
      font-family:'Space Grotesk',Segoe UI,Roboto,sans-serif;
      color:#e0f0ff;font-size:12px;padding:12px;user-select:none;
    `;

    hud.innerHTML = `
      <!-- Header -->
      <div id="tgx-hdr" style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(0,255,255,0.2);padding-bottom:8px;margin-bottom:8px;cursor:move;">
        <span style="font-weight:900;font-size:13px;letter-spacing:1px;background:linear-gradient(135deg,#00ffff,#ccff00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">⚡ TGX 2-LVL FIX</span>
        <div style="display:flex;align-items:center;gap:6px;">
          <span id="tgx-timer" style="font-weight:900;color:#ccff00;font-family:monospace;font-size:13px;">--s</span>
          <button id="tgx-min-btn" style="background:rgba(255,255,255,0.12);border:none;color:#fff;border-radius:4px;font-size:10px;cursor:pointer;padding:2px 6px;">−</button>
        </div>
      </div>

      <!-- Main Body -->
      <div id="tgx-body">
        <!-- Mode & Status Row -->
        <div style="display:flex;gap:6px;margin-bottom:8px;">
          <button id="tgx-mode-btn" style="flex:1;padding:6px 0;background:rgba(0,255,255,0.12);border:1px solid rgba(0,255,255,0.4);border-radius:8px;color:#00ffff;font-weight:800;font-size:11px;cursor:pointer;">
            ${GAME_MODE === '30S' ? '⚡ WINGO 30S' : '🎯 WINGO 1M'}
          </button>
          <button id="tgx-start-btn" style="flex:1;padding:6px 0;background:${running ? 'linear-gradient(90deg,#00b040,#00ff6a)' : 'linear-gradient(90deg,#b31217,#ff3b3b)'};border:none;border-radius:8px;color:#fff;font-weight:900;font-size:11px;cursor:pointer;box-shadow:0 0 12px ${running ? 'rgba(0,255,106,0.4)' : 'rgba(255,59,59,0.4)'};">
            ${running ? '🟢 RUNNING' : '🔴 START'}
          </button>
        </div>

        <!-- Live Prediction Display -->
        <div style="background:rgba(0,0,0,0.5);border:1px solid rgba(0,255,255,0.25);border-radius:12px;padding:10px;text-align:center;margin-bottom:8px;">
          <div id="tgx-period-lbl" style="font-size:10px;color:#8b9bb4;font-family:monospace;">PERIOD: ---</div>
          <div id="tgx-pred-call" style="font-size:26px;font-weight:900;letter-spacing:2px;color:#ccff00;text-shadow:0 0 15px rgba(204,255,0,0.5);">INIT</div>
          
          <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin:6px 0;">
            <span style="font-size:10px;color:#00ffff;font-weight:700;">OPP NUMS:</span>
            <span id="tgx-opp-nums" style="font-size:14px;font-weight:900;color:#ccff00;font-family:monospace;background:rgba(204,255,0,0.15);padding:2px 8px;border-radius:6px;border:1px solid #ccff00;">[?, ?]</span>
          </div>

          <div id="tgx-lvl-badge" style="display:inline-block;font-size:10px;font-weight:800;color:#00ffff;background:rgba(0,255,255,0.12);padding:2px 10px;border-radius:12px;border:1px solid rgba(0,255,255,0.3);">
            MARTINGALE: LEVEL 1 (1X)
          </div>
        </div>

        <!-- POPUP BET AMOUNT SETTINGS (AS REQUESTED) -->
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px;margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="color:#00ffff;font-weight:700;font-size:11px;">BASE BET (BIG/SMALL):</span>
            <div style="display:flex;align-items:center;gap:2px;">
              <span style="color:#8b9bb4;font-size:10px;">₹</span>
              <input id="tgx-inp-main" type="number" min="1" value="${BASE_MAIN_BET}" style="width:52px;background:#000;border:1px solid rgba(0,255,255,0.3);border-radius:4px;color:#fff;text-align:center;font-weight:800;padding:2px;font-size:11px;outline:none;" />
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="color:#ccff00;font-weight:700;font-size:11px;">OPP NUMS BET (EACH):</span>
            <div style="display:flex;align-items:center;gap:2px;">
              <span style="color:#8b9bb4;font-size:10px;">₹</span>
              <input id="tgx-inp-opp" type="number" min="1" value="${BASE_OPP_BET}" style="width:52px;background:#000;border:1px solid rgba(204,255,0,0.3);border-radius:4px;color:#fff;text-align:center;font-weight:800;padding:2px;font-size:11px;outline:none;" />
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="color:#8b9bb4;font-size:10px;">MAX LEVEL / HEDGE MULT:</span>
            <div style="display:flex;gap:4px;">
              <select id="tgx-sel-lvl" style="background:#000;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;font-size:10px;padding:2px;">
                <option value="2" ${MAX_MARTINGALE_LVL === 2 ? 'selected' : ''}>2 LVL</option>
                <option value="3" ${MAX_MARTINGALE_LVL === 3 ? 'selected' : ''}>3 LVL</option>
                <option value="4" ${MAX_MARTINGALE_LVL === 4 ? 'selected' : ''}>4 LVL</option>
              </select>
              <button id="tgx-btn-mult-toggle" style="background:${HEDGE_MULTIPLIES ? 'rgba(0,255,106,0.2)' : 'rgba(255,255,255,0.1)'};border:1px solid ${HEDGE_MULTIPLIES ? '#00ff6a' : '#888'};color:${HEDGE_MULTIPLIES ? '#00ff6a' : '#888'};border-radius:4px;font-size:9px;padding:2px 4px;cursor:pointer;">
                ${HEDGE_MULTIPLIES ? 'HEDGE MULT: ON' : 'HEDGE MULT: OFF'}
              </button>
            </div>
          </div>

          <div style="font-size:9px;color:#8b9bb4;text-align:center;margin-top:4px;">
            Next Round: Main ₹<span id="tgx-cost-main">${BASE_MAIN_BET * getMultiplier(currentLevel)}</span> + Opp 2x₹<span id="tgx-cost-opp">${(HEDGE_MULTIPLIES ? BASE_OPP_BET * getMultiplier(currentLevel) : BASE_OPP_BET)}</span> = Total ₹<span id="tgx-cost-total">${(BASE_MAIN_BET * getMultiplier(currentLevel)) + (2 * (HEDGE_MULTIPLIES ? BASE_OPP_BET * getMultiplier(currentLevel) : BASE_OPP_BET))}</span>
          </div>
        </div>

        <!-- Scoreboard Stats -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;text-align:center;margin-bottom:8px;">
          <div style="background:rgba(0,0,0,0.4);padding:4px 2px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
            <div id="tgx-s-dir" style="color:#00ffff;font-weight:800;font-size:12px;">${winsDirect}</div>
            <div style="font-size:8px;color:#8b9bb4;">DIRECT</div>
          </div>
          <div style="background:rgba(0,0,0,0.4);padding:4px 2px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
            <div id="tgx-s-hdg" style="color:#ccff00;font-weight:800;font-size:12px;">${winsHedge}</div>
            <div style="font-size:8px;color:#8b9bb4;">HEDGE</div>
          </div>
          <div style="background:rgba(0,0,0,0.4);padding:4px 2px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
            <div id="tgx-s-los" style="color:#ff3b3b;font-weight:800;font-size:12px;">${totalLosses}</div>
            <div style="font-size:8px;color:#8b9bb4;">LOSS</div>
          </div>
          <div style="background:rgba(0,0,0,0.4);padding:4px 2px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
            <div id="tgx-s-rate" style="color:#fff;font-weight:800;font-size:12px;">0%</div>
            <div style="font-size:8px;color:#8b9bb4;">RATE</div>
          </div>
        </div>

        <!-- Mini History Logs -->
        <div style="max-height:85px;overflow-y:auto;background:rgba(0,0,0,0.5);border-radius:6px;padding:4px;font-size:9px;font-family:monospace;" id="tgx-log-box">
          <div style="color:#64748b;text-align:center;">Waiting for neural rounds...</div>
        </div>
      </div>
    `;

    container.appendChild(hud);
    bindHudEvents(hud);
  }

  function bindHudEvents(hud) {
    const hdr = hud.querySelector('#tgx-hdr');
    let isDragging = false, startX, startY, initLeft, initTop;

    hdr.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = hud.getBoundingClientRect();
      initLeft = rect.left;
      initTop = rect.top;
      hud.setPointerCapture(e.pointerId);
    });

    hud.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      hud.style.left = `${initLeft + (e.clientX - startX)}px`;
      hud.style.top = `${initTop + (e.clientY - startY)}px`;
      hud.style.right = 'auto';
    });

    hud.addEventListener('pointerup', (e) => {
      isDragging = false;
      try { hud.releasePointerCapture(e.pointerId); } catch (err) {}
    });

    // Minimize Button
    const minBtn = hud.querySelector('#tgx-min-btn');
    const bodyEl = hud.querySelector('#tgx-body');
    minBtn.addEventListener('click', () => {
      const isHidden = bodyEl.style.display === 'none';
      bodyEl.style.display = isHidden ? 'block' : 'none';
      minBtn.textContent = isHidden ? '−' : '+';
    });

    // Mode Toggle
    const modeBtn = hud.querySelector('#tgx-mode-btn');
    modeBtn.addEventListener('click', () => {
      GAME_MODE = (GAME_MODE === '30S') ? '1M' : '30S';
      modeBtn.textContent = (GAME_MODE === '30S') ? '⚡ WINGO 30S' : '🎯 WINGO 1M';
      LOTTERY_HISTORY = [];
      PENDING_ROUND = null;
      persistConfig();
      fetchDrawHistory();
      updateHud();
    });

    // Start/Stop Toggle
    const startBtn = hud.querySelector('#tgx-start-btn');
    startBtn.addEventListener('click', () => {
      running = !running;
      startBtn.textContent = running ? '🟢 RUNNING' : '🔴 START';
      startBtn.style.background = running ? 'linear-gradient(90deg,#00b040,#00ff6a)' : 'linear-gradient(90deg,#b31217,#ff3b3b)';
      startBtn.style.boxShadow = running ? '0 0 12px rgba(0,255,106,0.4)' : '0 0 12px rgba(255,59,59,0.4)';
      persistConfig();
    });

    // Inputs: Base Main Bet & Base Opp Bet
    const inpMain = hud.querySelector('#tgx-inp-main');
    inpMain.addEventListener('change', () => {
      BASE_MAIN_BET = Math.max(1, parseInt(inpMain.value, 10) || 10);
      inpMain.value = BASE_MAIN_BET;
      persistConfig();
      updateHud();
    });

    const inpOpp = hud.querySelector('#tgx-inp-opp');
    inpOpp.addEventListener('change', () => {
      BASE_OPP_BET = Math.max(1, parseInt(inpOpp.value, 10) || 2);
      inpOpp.value = BASE_OPP_BET;
      persistConfig();
      updateHud();
    });

    // Max Level Select
    const selLvl = hud.querySelector('#tgx-sel-lvl');
    selLvl.addEventListener('change', () => {
      MAX_MARTINGALE_LVL = parseInt(selLvl.value, 10) || 2;
      persistConfig();
    });

    // Hedge Multiplier Toggle
    const btnMult = hud.querySelector('#tgx-btn-mult-toggle');
    btnMult.addEventListener('click', () => {
      HEDGE_MULTIPLIES = !HEDGE_MULTIPLIES;
      btnMult.textContent = HEDGE_MULTIPLIES ? 'HEDGE MULT: ON' : 'HEDGE MULT: OFF';
      btnMult.style.background = HEDGE_MULTIPLIES ? 'rgba(0,255,106,0.2)' : 'rgba(255,255,255,0.1)';
      btnMult.style.borderColor = HEDGE_MULTIPLIES ? '#00ff6a' : '#888';
      btnMult.style.color = HEDGE_MULTIPLIES ? '#00ff6a' : '#888';
      persistConfig();
      updateHud();
    });
  }

  function updateHud() {
    const pLbl = document.getElementById('tgx-period-lbl');
    if (pLbl && currentPeriod) pLbl.textContent = 'PERIOD: #' + currentPeriod;

    const pCall = document.getElementById('tgx-pred-call');
    if (pCall) {
      pCall.textContent = lastPredictedSize || 'SYNCING';
      pCall.style.color = lastPredictedSize === 'BIG' ? '#00ffff' : '#ccff00';
    }

    const oppEl = document.getElementById('tgx-opp-nums');
    if (oppEl) {
      oppEl.textContent = lastTargetNums.length ? `[${lastTargetNums.join(', ')}]` : '[?, ?]';
    }

    const lvlEl = document.getElementById('tgx-lvl-badge');
    const mult = getMultiplier(currentLevel);
    if (lvlEl) {
      lvlEl.textContent = `MARTINGALE: LEVEL ${currentLevel} (${mult}X)`;
    }

    // Cost Breakdown
    const mainCost = BASE_MAIN_BET * mult;
    const oppCost  = HEDGE_MULTIPLIES ? (BASE_OPP_BET * mult) : BASE_OPP_BET;
    const totCost  = mainCost + (2 * oppCost);

    const cMain = document.getElementById('tgx-cost-main');
    const cOpp  = document.getElementById('tgx-cost-opp');
    const cTot  = document.getElementById('tgx-cost-total');
    if (cMain) cMain.textContent = mainCost;
    if (cOpp)  cOpp.textContent  = oppCost;
    if (cTot)  cTot.textContent  = totCost;

    // Stats
    const sDir = document.getElementById('tgx-s-dir');
    const sHdg = document.getElementById('tgx-s-hdg');
    const sLos = document.getElementById('tgx-s-los');
    const sRat = document.getElementById('tgx-s-rate');
    if (sDir) sDir.textContent = winsDirect;
    if (sHdg) sHdg.textContent = winsHedge;
    if (sLos) sLos.textContent = totalLosses;

    const totalRounds = winsDirect + winsHedge + totalLosses;
    const winRate = totalRounds > 0 ? Math.round(((winsDirect + winsHedge) / totalRounds) * 100) : 0;
    if (sRat) sRat.textContent = winRate + '%';

    // Log Box
    const logBox = document.getElementById('tgx-log-box');
    if (logBox && RECORDED_LOGS.length) {
      logBox.innerHTML = RECORDED_LOGS.slice(0, 8).map(l => {
        const color = l.winType === 'direct' ? '#00ffff' : (l.winType === 'hedge' ? '#ccff00' : '#ff3b3b');
        return `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:${color};">
          <span>#${l.period}</span>
          <span>${l.pred} ${l.opp}</span>
          <span>${l.result}</span>
          <b>${l.status}</b>
        </div>`;
      }).join('');
    }
  }

  // ── 11. BOOTSTRAP ─────────────────────────────────────────
  function init() {
    createHud();
    fetchDrawHistory();
    setInterval(botCycle, 700);
    setInterval(fetchDrawHistory, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
