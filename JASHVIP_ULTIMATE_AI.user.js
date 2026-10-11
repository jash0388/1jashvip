// ==UserScript==
// @name         JASHVIP ULTIMATE AI — WinGo Floating Prediction HUD & AutoBet
// @namespace    https://github.com/jash0388/jashvip
// @version      5.1.0
// @description  Compact WinGo (1M / 30S) Prediction HUD with Auto-Betting (Martingale: 3 -> 6+1=7 -> 12+2=14, Single-Click Confirmation, Auto-Modal Dismiss, One-Click Expand/Minimize).
// @author       Jashwanth Singh
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      draw.ar-lottery01.com
// @connect      *
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    if (window.__JASHVIP_INJECTED__) return;
    window.__JASHVIP_INJECTED__ = true;

    /* =========================================================
       API CONFIGURATION
       ========================================================= */
    const API_ENDPOINTS = {
        '1M': 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
        '30S': 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json'
    };

    let currentMode = '1M';
    let soundEnabled = true;
    let isMinimized = false;
    let lastResolvedIssue = null;
    let currentPrediction = null;
    let timerInterval = null;
    let pollInterval = null;

    /* =========================================================
       MARTINGALE STATE (User formula: 3 -> 6+1=7 -> 12+2=14)
       ========================================================= */
    let autobetEnabled = false;
    let baseStake = parseInt(localStorage.getItem('JASH_BASE_STAKE') || '3', 10);
    if (isNaN(baseStake) || baseStake < 1) baseStake = 3;
    let lossStreak = 0;
    const placedPeriods = new Set();
    let isPlacingBet = false;

    function calculateStake(base, streak) {
        if (streak <= 0) return base;
        if (streak === 1) return (base * 2) + 1; // e.g. 3*2+1 = 7
        if (streak === 2) return ((base * 2) + 1) * 2; // e.g. 7*2 = 14
        return (((base * 2) + 1) * 2) * 2; // e.g. 14*2 = 28
    }

    function getCurrentBetAmount() {
        return calculateStake(baseStake, lossStreak);
    }

    /* =========================================================
       AUDIO CHIMES
       ========================================================= */
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) audioCtx = new AudioCtx();
        }
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    function playChime(isWin) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = isWin ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(isWin ? 880 : 280, ctx.currentTime);
            if (isWin) osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
            else osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.32);
        } catch (e) {}
    }

    /* =========================================================
       PREDICTION ENGINE
       ========================================================= */
    function getSize(number) {
        return parseInt(number, 10) >= 5 ? 'BIG' : 'SMALL';
    }

    function calculateCombinedPrediction(list) {
        if (!list || list.length < 3) return null;
        const sizes = list.slice(0, 15).map(item => getSize(item.number));

        let streak = 1;
        for (let i = 0; i < sizes.length - 1; i++) {
            if (sizes[i] === sizes[i + 1]) streak++; else break;
        }
        let alt = 1;
        for (let i = 0; i < sizes.length - 1; i++) {
            if (sizes[i] !== sizes[i + 1]) alt++; else break;
        }

        let pred = sizes[0];
        let label = 'TREND RIDE';

        if (streak >= 3) {
            pred = sizes[0];
            label = `⚡ DRAGON (${streak}X)`;
        } else if (alt >= 3) {
            pred = sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
            label = `⚡ ZIGZAG (${alt}X)`;
        } else {
            let bScore = 0, sScore = 0;
            for (let i = 0; i < Math.min(8, sizes.length); i++) {
                const w = 8 - i;
                if (sizes[i] === 'BIG') bScore += w; else sScore += w;
            }
            pred = bScore >= sScore ? 'BIG' : 'SMALL';
            label = 'AI CONSENSUS';
        }

        return {
            prediction: pred,
            patternLabel: label,
            latestIssue: list[0].issueNumber,
            latestNumber: parseInt(list[0].number, 10),
            nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString()
        };
    }

    /* =========================================================
       FETCH LOTTERY HISTORY
       ========================================================= */
    function fetchWinGoHistory() {
        return new Promise((resolve) => {
            const url = API_ENDPOINTS[currentMode] + '?t=' + Date.now();
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 6000,
                    onload: function (res) {
                        try {
                            const json = JSON.parse(res.responseText);
                            if (json && json.data && json.data.list) resolve(json.data.list);
                            else resolve(null);
                        } catch (e) { resolve(null); }
                    },
                    onerror: () => resolve(null),
                    ontimeout: () => resolve(null)
                });
            } else {
                fetch(url)
                    .then(r => r.json())
                    .then(j => resolve(j?.data?.list || null))
                    .catch(() => resolve(null));
            }
        });
    }

    /* =========================================================
       ACCURATE DMFIRST DOM CLICKER & SINGLE-CLICK BETTING
       ========================================================= */
    function closeAnyOpenBetModal() {
        const cancelBtns = Array.from(document.querySelectorAll('.van-popup button, .popup button, [class*="cancel"], .van-overlay'))
            .filter(e => !e.closest('#jashvip-tampermonkey-root'));
        for (const b of cancelBtns) {
            const txt = (b.textContent || '').trim().toLowerCase();
            if (txt === 'cancel' || b.classList.contains('van-overlay')) {
                try { b.click(); } catch (e) {}
            }
        }
    }

    function findBetButton(side) {
        const target = side.trim().toLowerCase(); // "big" or "small"

        // Search outside our HUD and outside past result tables
        const all = Array.from(document.querySelectorAll('button, div, span, p'))
            .filter(e => {
                if (e.closest('#jashvip-tampermonkey-root')) return false;
                if (e.closest('.game-history, .history, table, .record-list, .record, tbody, tr, td, .chart')) return false;
                return true;
            });

        // In DmFirst, Big and Small buttons are right below numbers/multipliers
        let btn = all.find(e => {
            const t = (e.textContent || '').trim().toLowerCase();
            return (t === target || t === `${target} 2x` || t === `${target}2x`) && e.children.length <= 1 && e.offsetHeight >= 24;
        });

        if (!btn) {
            btn = all.find(e => (e.textContent || '').trim().toLowerCase() === target && e.children.length === 0);
        }

        if (!btn) {
            btn = all.find(e => (e.textContent || '').trim().toLowerCase() === target);
        }

        return btn;
    }

    async function executeBetDOM(side, stake) {
        // Ensure no previous stuck modal is open
        closeAnyOpenBetModal();
        await new Promise(r => setTimeout(r, 150));

        const targetBtn = findBetButton(side);
        if (!targetBtn) {
            console.warn(`[JASHVIP AUTOBET] Target button ${side} not found on page!`);
            return false;
        }

        // 1. Click Big or Small
        try { targetBtn.click(); } catch (e) {}
        await new Promise(r => setTimeout(r, 450));

        // 2. Unit selection in modal
        // If stake >= 10 and stake % 10 === 0: click unit 10, Qty = stake / 10
        // Otherwise click unit 1, Qty = stake
        let unit = (stake >= 10 && stake % 10 === 0) ? 10 : 1;
        let qty = (unit === 10) ? Math.floor(stake / 10) : stake;

        const popupEls = Array.from(document.querySelectorAll('.van-popup button, .van-popup div, .van-popup span, .popup button, .popup div, .popup span'))
            .filter(e => !e.closest('#jashvip-tampermonkey-root'));

        const unitBtn = popupEls.find(e => (e.textContent || '').trim() === String(unit) && e.children.length === 0 && e.offsetHeight > 14);
        if (unitBtn) {
            try { unitBtn.click(); } catch (e) {}
            await new Promise(r => setTimeout(r, 120));
        }

        // 3. Set Quantity input
        const modalInputs = Array.from(document.querySelectorAll('.van-popup input, .popup input, uni-input input, input[type="tel"], input[type="number"], .van-stepper__input, input'))
            .filter(i => !i.closest('#jashvip-tampermonkey-root'));

        if (modalInputs.length > 0) {
            const inp = modalInputs[modalInputs.length - 1];
            try {
                inp.focus();
                const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
                if (setter) setter.call(inp, String(qty)); else inp.value = String(qty);
                inp.dispatchEvent(new Event('input', { bubbles: true }));
                inp.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (e) {}
        }

        await new Promise(r => setTimeout(r, 200));

        // 4. Click Confirm Button ("Total amount ₹...") EXACTLY ONCE!
        const allPopupEls = Array.from(document.querySelectorAll('div, button, span, uni-view, uni-button, p'))
            .filter(e => !e.closest('#jashvip-tampermonkey-root'));

        let confirmBtn = allPopupEls.find(b => {
            const t = (b.textContent || '').trim();
            return /Total\s*amount/i.test(t) && !/Cancel/i.test(t) && t.length <= 40;
        });

        if (!confirmBtn) {
            confirmBtn = allPopupEls.find(b => {
                const t = (b.textContent || '').trim();
                return /^(Confirm|Submit|Order|Buy|Presale|Pre-sale|Bet|立即投注)$/i.test(t) && !/Cancel/i.test(t);
            });
        }

        if (confirmBtn) {
            // STRICT SINGLE CLICK to prevent duplicate order submit / "6 Invalid parameter"!
            try { confirmBtn.click(); } catch (e) {}
            console.log(`%c[JASHVIP AUTOBET] ✅ Submitted Order: ${side} ₹${stake}`, 'background:#10B981;color:#000;font-weight:bold;padding:5px 10px;border-radius:4px');

            // Close modal after 800ms so it never stays stuck
            setTimeout(() => {
                closeAnyOpenBetModal();
            }, 800);
            return true;
        } else {
            console.warn('[JASHVIP AUTOBET] ⚠️ Confirm button not found!');
            return false;
        }
    }

    async function checkAndTriggerAutobet(pred) {
        if (!autobetEnabled || isPlacingBet) return;
        if (!pred || !pred.nextPeriod) return;
        const period = pred.nextPeriod;

        if (placedPeriods.has(period)) return;

        const now = new Date();
        const sec = now.getSeconds();
        const remaining = currentMode === '1M' ? (60 - sec) : (30 - (sec % 30));

        const minTime = currentMode === '1M' ? 10 : 7;
        const maxTime = currentMode === '1M' ? 55 : 26;

        if (remaining < minTime || remaining > maxTime) return;

        // Immediately mark period as placed to prevent any duplicate execution
        placedPeriods.add(period);
        isPlacingBet = true;

        const side = pred.prediction;
        const stake = getCurrentBetAmount();
        updateAutobetStatus('placing', `⏳ PLACING ${side} ₹${stake}...`);

        try {
            const success = await executeBetDOM(side, stake);
            if (success) {
                updateAutobetStatus('success', `✅ BET PLACED: ${side} ₹${stake} (#${period.slice(-5)})`);
                playChime(true);
            } else {
                updateAutobetStatus('error', `⚠️ BET FAILED`);
                placedPeriods.delete(period);
            }
        } catch (err) {
            console.error('[JASHVIP AUTOBET ERROR]', err);
            updateAutobetStatus('error', `⚠️ ERROR: ${err.message}`);
            placedPeriods.delete(period);
        } finally {
            isPlacingBet = false;
        }
    }

    /* =========================================================
       INJECT COMPACT FLOATING HUD
       ========================================================= */
    const host = document.createElement('div');
    host.id = 'jashvip-tampermonkey-root';
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
        :host {
            all: initial;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 2147483647;
            position: fixed;
            top: 20px;
            right: 20px;
            pointer-events: auto;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
        .hud-card {
            width: 240px;
            background: rgba(11, 14, 20, 0.96);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.75), 0 0 15px rgba(0, 217, 255, 0.15);
            color: #EAF1F8;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.15s ease;
        }

        /* MINIMIZED: EXPAND BY CLICKING ANYWHERE ON IT! */
        .hud-card.minimized {
            width: auto !important;
            min-width: 230px;
            max-width: 280px;
            border-radius: 20px;
            cursor: pointer !important;
            background: rgba(11, 14, 20, 0.96);
            border: 1px solid #00D9FF;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.85), 0 0 16px rgba(0, 217, 255, 0.4);
        }
        .hud-card.minimized:hover {
            border-color: #E4FF4A;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(228, 255, 74, 0.5);
            transform: translateY(-1px);
        }
        .hud-card.minimized .hud-body { display: none !important; }
        .hud-card.minimized .btn-icon#btnMin {
            background: #00D9FF;
            color: #06070A;
            font-weight: 900;
            font-size: 13px;
            border: none;
        }
        .hud-expand-chip {
            display: none;
            align-items: center;
            background: rgba(0, 217, 255, 0.2);
            border: 1px solid #00D9FF;
            color: #00D9FF;
            font-size: 8px;
            font-weight: 900;
            padding: 2px 6px;
            border-radius: 4px;
            cursor: pointer;
        }
        .hud-card.minimized .hud-expand-chip { display: inline-flex; }

        /* HEADER */
        .hud-header {
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: grab;
        }
        .hud-header:active { cursor: grabbing; }
        .brand {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .brand-icon {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #E4FF4A, #00D9FF);
            border-radius: 5px;
            display: grid;
            place-items: center;
            font-size: 12px;
            color: #06070A;
            font-weight: 900;
        }
        .brand-title {
            font-size: 12px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .vip-badge {
            background: #E4FF4A;
            color: #06070A;
            font-family: monospace;
            font-size: 7.5px;
            font-weight: 900;
            padding: 1px 4px;
            border-radius: 3px;
        }
        .vip-badge.bot-active {
            background: #FF3B5C;
            color: #FFFFFF;
            animation: pulseGlow 1s infinite;
        }
        @keyframes pulseGlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .actions { display: flex; align-items: center; gap: 4px; }
        .btn-icon {
            width: 22px;
            height: 22px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #8A97AA;
            display: grid;
            place-items: center;
            font-size: 11px;
            cursor: pointer;
        }
        .btn-icon:hover { background: rgba(255, 255, 255, 0.14); color: #FFF; }

        /* BODY */
        .hud-body {
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        /* TOP MODE & TIMER */
        .hud-top-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .mode-select {
            display: flex;
            background: rgba(0, 0, 0, 0.4);
            padding: 2px;
            border-radius: 6px;
            gap: 2px;
        }
        .mode-chip {
            background: transparent;
            border: none;
            color: #8A97AA;
            font-size: 9px;
            font-weight: 800;
            padding: 3px 6px;
            border-radius: 4px;
            cursor: pointer;
        }
        .mode-chip.active {
            background: rgba(0, 217, 255, 0.2);
            color: #00D9FF;
            border: 1px solid rgba(0, 217, 255, 0.4);
        }
        .hud-timer-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            font-family: monospace;
            font-size: 10px;
            font-weight: 800;
            color: #8A97AA;
        }
        .timer-sec {
            color: #EAF1F8;
            background: rgba(255, 255, 255, 0.06);
            padding: 2px 5px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* DIRECTION SIGNAL */
        .signal-card {
            background: rgba(18, 23, 34, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 8px;
            text-align: center;
        }
        .stage-pill {
            font-size: 8px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 12px;
            display: inline-block;
            margin-bottom: 2px;
        }
        .stage-pill.lvl1 { background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); }
        .stage-pill.lvl2 { background: rgba(255, 176, 32, 0.15); color: #FFB020; border: 1px solid rgba(255, 176, 32, 0.3); }
        .stage-pill.lvl3 { background: rgba(255, 59, 92, 0.15); color: #FF3B5C; border: 1px solid rgba(255, 59, 92, 0.3); }

        .pred-call {
            font-size: 32px;
            font-weight: 900;
            letter-spacing: -0.02em;
            line-height: 1;
            margin: 2px 0 4px;
            text-shadow: 0 0 20px currentColor;
        }
        .pred-call.big { color: #E4FF4A; }
        .pred-call.small { color: #00D9FF; }

        .pattern-lbl {
            font-size: 8px;
            font-family: monospace;
            font-weight: 700;
            color: #8A97AA;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* AUTOBET BUTTON */
        .autobet-btn {
            width: 100%;
            padding: 9px;
            border: none;
            border-radius: 8px;
            font-family: inherit;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.08em;
            cursor: pointer;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.15s;
        }
        .autobet-btn.start {
            background: linear-gradient(135deg, #10B981, #00D9FF);
            color: #06070A;
            box-shadow: 0 0 14px rgba(16, 185, 129, 0.4);
        }
        .autobet-btn.stop {
            background: linear-gradient(135deg, #FF3B5C, #FF5470);
            color: #FFFFFF;
            box-shadow: 0 0 18px rgba(255, 59, 92, 0.6);
            animation: pulseBtn 1.2s infinite ease-in-out;
        }
        @keyframes pulseBtn {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        /* BASE BET & CURRENT BET (EXACT REQUEST) */
        .bet-config-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
        }
        .bet-box {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 6px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .bet-lbl {
            font-size: 7.5px;
            font-weight: 800;
            color: #8A97AA;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }
        .bet-input-wrap {
            display: flex;
            align-items: center;
            gap: 3px;
        }
        .curr-sym {
            color: #E4FF4A;
            font-weight: 800;
            font-size: 12px;
            font-family: monospace;
        }
        .bet-input {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: #EAF1F8;
            font-size: 12px;
            font-weight: 900;
            font-family: monospace;
        }
        .curr-val {
            font-size: 12px;
            font-weight: 900;
            color: #00D9FF;
            font-family: monospace;
        }

        /* STATUS BAR */
        .status-bar {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 6px;
            padding: 5px 6px;
            display: flex;
            align-items: center;
            gap: 5px;
            font-family: monospace;
            font-size: 8.5px;
            font-weight: 800;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .status-dot { font-size: 9px; line-height: 1; }
        .status-dot.idle { color: #505B6D; }
        .status-dot.monitoring { color: #E4FF4A; }
        .status-dot.placing { color: #00D9FF; }
        .status-dot.success { color: #10B981; }
        .status-dot.error { color: #FF3B5C; }
    `;
    shadow.appendChild(style);

    const hudCard = document.createElement('div');
    hudCard.className = 'hud-card';
    hudCard.innerHTML = `
        <div class="hud-header" id="hudHeader" title="Click to minimize or expand">
            <div class="brand">
                <div class="brand-icon">⚡</div>
                <div class="brand-title" id="hudBrandTitle">
                    JASHVIP 
                    <span class="vip-badge" id="hudMiniBadge">AUTOBET</span>
                    <span class="hud-expand-chip" id="hudExpandChip">⤢ OPEN</span>
                </div>
            </div>
            <div class="actions">
                <button class="btn-icon" id="btnSound" title="Toggle Sound">🔊</button>
                <button class="btn-icon" id="btnMin" title="Minimize / Expand">−</button>
            </div>
        </div>
        <div class="hud-body">
            <!-- Mode & Countdown Row -->
            <div class="hud-top-row">
                <div class="mode-select">
                    <button class="mode-chip active" id="btnMode1M">1M</button>
                    <button class="mode-chip" id="btnMode30S">30S</button>
                </div>
                <div class="hud-timer-badge">
                    <span id="txtPeriod">#-----</span>
                    <span id="txtTimer" class="timer-sec">00:00</span>
                </div>
            </div>

            <!-- Direction Call & Stage -->
            <div class="signal-card">
                <div class="stage-pill lvl1" id="pillStage">STAGE: L1 (₹${baseStake})</div>
                <div class="pred-call big" id="txtPrediction">BIG</div>
                <div class="pattern-lbl" id="txtPattern">AI CONSENSUS</div>
            </div>

            <!-- Autobet Button -->
            <button class="autobet-btn start" id="btnAutobetToggle">
                ▶ START AUTOBET
            </button>

            <!-- Base Bet & Current Bet (Compact Focus) -->
            <div class="bet-config-row">
                <div class="bet-box">
                    <span class="bet-lbl">BASE BET</span>
                    <div class="bet-input-wrap">
                        <span class="curr-sym">₹</span>
                        <input type="number" id="inputBaseStake" class="bet-input" value="${baseStake}" min="1" max="10000" />
                    </div>
                </div>
                <div class="bet-box">
                    <span class="bet-lbl">CURRENT BET</span>
                    <span class="curr-val" id="valCurrentStake">₹${baseStake}</span>
                </div>
            </div>

            <!-- Live Status Banner -->
            <div class="status-bar">
                <span class="status-dot idle" id="autobetDot">●</span>
                <span class="status-txt" id="autobetStatusText">AUTOBET: PAUSED (OFF)</span>
            </div>
        </div>
    `;
    shadow.appendChild(hudCard);

    /* =========================================================
       DRAGGABLE & ONE-CLICK EXPAND / MINIMIZE
       ========================================================= */
    const hudHeader = shadow.getElementById('hudHeader');
    const btnMin = shadow.getElementById('btnMin');
    const hudExpandChip = shadow.getElementById('hudExpandChip');

    let isDragging = false, startX, startY, initX, initY, hasMoved = false;

    function toggleMinimize(force) {
        isMinimized = typeof force === 'boolean' ? force : !isMinimized;
        hudCard.classList.toggle('minimized', isMinimized);
        btnMin.textContent = isMinimized ? '＋' : '−';
        btnMin.title = isMinimized ? 'Click to Expand HUD' : 'Click to Minimize HUD';
    }

    // Min/Max Button Click
    btnMin.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMinimize();
    });

    // Expand Chip Click
    if (hudExpandChip) {
        hudExpandChip.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMinimize(false);
        });
    }

    // Click ANYWHERE on card while minimized expands it back immediately!
    hudCard.addEventListener('click', (e) => {
        if (isMinimized && !e.target.closest('#btnSound')) {
            toggleMinimize(false);
        }
    });

    // Header Dragging
    hudHeader.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        const rect = host.getBoundingClientRect();
        initX = rect.left;
        initY = rect.top;
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
        host.style.right = 'auto';
        host.style.left = `${Math.max(10, Math.min(window.innerWidth - 250, initX + dx))}px`;
        host.style.top = `${Math.max(10, Math.min(window.innerHeight - 150, initY + dy))}px`;
    });

    window.addEventListener('mouseup', (e) => {
        if (isDragging && !hasMoved && isMinimized) {
            if (!e.target.closest('#btnSound')) {
                toggleMinimize(false);
            }
        }
        isDragging = false;
    });

    // Sound toggle
    const btnSound = shadow.getElementById('btnSound');
    btnSound.addEventListener('click', (e) => {
        e.stopPropagation();
        soundEnabled = !soundEnabled;
        btnSound.textContent = soundEnabled ? '🔊' : '🔇';
    });

    // Mode chips
    const btnMode1M = shadow.getElementById('btnMode1M');
    const btnMode30S = shadow.getElementById('btnMode30S');

    btnMode1M.addEventListener('click', () => {
        if (currentMode === '1M') return;
        currentMode = '1M';
        btnMode1M.classList.add('active');
        btnMode30S.classList.remove('active');
        currentPrediction = null;
        lastResolvedIssue = null;
        runEngine();
    });

    btnMode30S.addEventListener('click', () => {
        if (currentMode === '30S') return;
        currentMode = '30S';
        btnMode30S.classList.add('active');
        btnMode1M.classList.remove('active');
        currentPrediction = null;
        lastResolvedIssue = null;
        runEngine();
    });

    /* =========================================================
       AUTOBET UI INTERACTIONS
       ========================================================= */
    const btnAutobetToggle = shadow.getElementById('btnAutobetToggle');
    const inputBaseStake = shadow.getElementById('inputBaseStake');
    const autobetDot = shadow.getElementById('autobetDot');
    const autobetStatusText = shadow.getElementById('autobetStatusText');
    const hudMiniBadge = shadow.getElementById('hudMiniBadge');

    function updateAutobetStatus(type, text) {
        if (!autobetDot || !autobetStatusText) return;
        autobetDot.className = `status-dot ${type}`;
        autobetStatusText.textContent = text;
    }

    function updateStakeDisplay() {
        const calcVal = shadow.getElementById('valCurrentStake');
        const pill = shadow.getElementById('pillStage');
        const currentAmt = getCurrentBetAmount();

        if (calcVal) {
            calcVal.textContent = `₹${currentAmt} (${lossStreak === 0 ? 'BASE' : 'STREAK ' + lossStreak})`;
        }
        if (pill) {
            if (lossStreak === 0) {
                pill.className = 'stage-pill lvl1';
                pill.textContent = `STAGE: L1 (₹${currentAmt})`;
            } else if (lossStreak === 1) {
                pill.className = 'stage-pill lvl2';
                pill.textContent = `STAGE: L2 (₹${currentAmt})`;
            } else {
                pill.className = 'stage-pill lvl3';
                pill.textContent = `STAGE: L3 (₹${currentAmt})`;
            }
        }
    }

    btnAutobetToggle.addEventListener('click', () => {
        autobetEnabled = !autobetEnabled;
        if (autobetEnabled) {
            btnAutobetToggle.className = 'autobet-btn stop';
            btnAutobetToggle.innerHTML = '⏹ STOP AUTOBET (ACTIVE)';
            hudMiniBadge.className = 'vip-badge bot-active';
            hudMiniBadge.textContent = 'AUTOBET ON';
            updateAutobetStatus('monitoring', 'AUTOBET: ACTIVE — MONITORING DRAW');
            if (currentPrediction && currentPrediction.nextPeriod) {
                checkAndTriggerAutobet(currentPrediction);
            }
        } else {
            btnAutobetToggle.className = 'autobet-btn start';
            btnAutobetToggle.innerHTML = '▶ START AUTOBET';
            hudMiniBadge.className = 'vip-badge';
            hudMiniBadge.textContent = 'AUTOBET';
            updateAutobetStatus('idle', 'AUTOBET: PAUSED (OFF)');
        }
    });

    inputBaseStake.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        baseStake = val;
        localStorage.setItem('JASH_BASE_STAKE', String(val));
        updateStakeDisplay();
    });

    inputBaseStake.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 1) {
            baseStake = val;
            updateStakeDisplay();
        }
    });

    function recordOutcome(isWin) {
        if (isWin) {
            lossStreak = 0; // Reset to base on win
        } else {
            lossStreak++;
            if (lossStreak > 3) lossStreak = 0;
        }
        updateStakeDisplay();
    }

    function renderPrediction(data) {
        shadow.getElementById('txtPeriod').textContent = `#${data.nextPeriod.slice(-5)}`;
        const predEl = shadow.getElementById('txtPrediction');
        predEl.textContent = data.prediction;
        predEl.className = `pred-call ${data.prediction.toLowerCase()}`;
        shadow.getElementById('txtPattern').textContent = data.patternLabel;
    }

    /* =========================================================
       ENGINE LOOP & COUNTDOWN TIMER
       ========================================================= */
    async function runEngine() {
        const list = await fetchWinGoHistory();
        if (!list || list.length < 3) return;

        const top = list[0];
        const actualCategory = getSize(top.number);

        if (lastResolvedIssue !== top.issueNumber) {
            if (currentPrediction && currentPrediction.nextPeriod === top.issueNumber) {
                const isWin = (currentPrediction.prediction === actualCategory);
                recordOutcome(isWin);
                playChime(isWin);
            }
            lastResolvedIssue = top.issueNumber;
        }

        const pred = calculateCombinedPrediction(list);
        if (pred) {
            currentPrediction = pred;
            renderPrediction(pred);
            checkAndTriggerAutobet(pred);
        }
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const now = new Date();
            const sec = now.getSeconds();
            const ms = now.getMilliseconds();
            const totalSec = currentMode === '1M' ? (60 - sec) : (30 - (sec % 30));

            const m = Math.floor(totalSec / 60);
            const s = totalSec % 60;
            const timerEl = shadow.getElementById('txtTimer');
            if (timerEl) {
                timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                if (totalSec <= 5) timerEl.style.color = '#FF3B5C';
                else timerEl.style.color = '#EAF1F8';
            }

            if (autobetEnabled && currentPrediction && currentPrediction.nextPeriod) {
                checkAndTriggerAutobet(currentPrediction);
            }

            if (totalSec === 1 && ms > 400) {
                setTimeout(runEngine, 1400);
            }
        }, 250);
    }

    // Initialize
    updateStakeDisplay();
    runEngine();
    startTimer();
    pollInterval = setInterval(runEngine, 4000);

    console.log('%c[JASHVIP V5.1]%c Single-Click Martingale HUD ready.', 'color:#E4FF4A;font-weight:bold;', 'color:#FFF;');
})();
