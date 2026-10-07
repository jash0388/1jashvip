// ==UserScript==
// @name         JASHVIP ULTIMATE AI — WinGo Floating Prediction HUD
// @namespace    https://github.com/jash0388/jashvip
// @version      3.0.0
// @description  Master Multi-Model Ensemble WinGo (1M / 30S) Prediction HUD with Draggable Cyberpunk UI, Stage Level Guard (L1/L2/L3 Skip Lock), Zero-Lag Geometric Pattern Engine, Audio Alerts & Live Draw Sync.
// @author       JASHVIP Team
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

    // Prevent double injection
    if (window.__JASHVIP_INJECTED__) return;
    window.__JASHVIP_INJECTED__ = true;

    /* =========================================================
       API CONFIGURATION & FALLBACKS
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
    let historyLogs = [];
    let currentLevel = 1;
    let timerInterval = null;
    let pollInterval = null;

    /* =========================================================
       CORE AI MULTI-MODEL ENSEMBLE ENGINE
       ========================================================= */
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

    // 1. Apex Titan Cadence Engine
    function apexTitanEngine(sizes, lossStreak) {
        const runs = getRuns(sizes);
        const cRun = runs[runs.length - 1];
        const cSide = cRun.size;
        const cLen = cRun.len;
        const lastS = sizes[sizes.length - 1];

        let alt = 0;
        for (let i = runs.length - 1; i >= 0; i--) {
            if (runs[i].len === 1) alt++;
            else break;
        }

        if (lossStreak >= 2) {
            if (cLen >= 4) return { vote: cSide, reg: '🛑 L3 DRAGON EXT' };
            if (cLen === 3) return { vote: opp(cSide), reg: '🛑 L3 DRAGON CUT' };
            if (cLen === 2) return { vote: opp(cSide), reg: '🛑 L3 DOUBLET CUT' };
            if (alt >= 3) return { vote: opp(lastS), reg: '🛑 L3 CHOP OSC' };
            return { vote: cSide, reg: '🛑 L3 MOMENTUM LOCK' };
        } else if (lossStreak === 1) {
            if (cLen >= 3) return { vote: cSide, reg: '🛡️ L2 DRAGON RIDE' };
            if (cLen === 2) return { vote: cSide, reg: '🛡️ L2 DOUBLET RIDE' };
            if (alt >= 2) return { vote: opp(lastS), reg: '🛡️ L2 CHOP FLIP' };
            return { vote: cSide, reg: '🛡️ L2 MOMENTUM LOCK' };
        } else {
            if (cLen >= 4) return { vote: cSide, reg: '🌊 L1 DRAGON EXT' };
            if (cLen === 3) return { vote: opp(cSide), reg: '🐉 L1 DRAGON CUT' };
            if (cLen === 2) return { vote: opp(cSide), reg: '🌊 L1 DOUBLET CUT' };
            if (alt >= 3) return { vote: opp(lastS), reg: '⚡ L1 CHOP OSC' };
            if (cLen === 1) return { vote: opp(cSide), reg: '🌊 L1 SINGLE CUT' };
            return { vote: cSide, reg: '🌊 L1 MOMENTUM' };
        }
    }

    // 2. Radhe Engine
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

    // 3. Suresh VIP Engine
    function sureshEngine(list) {
        let bigs = 0, smalls = 0;
        for (let i = 0; i < Math.min(10, list.length); i++) {
            const num = parseInt(list[i].number, 10);
            const weight = (10 - i);
            if (num >= 5) bigs += weight; else smalls += weight;
        }
        const last3 = list.slice(0, 3).map(x => getSize(x.number));
        if (last3[0] === last3[1] && last3[1] === last3[2]) {
            return last3[0] === 'BIG' ? 'SMALL' : 'BIG';
        }
        return bigs >= smalls ? 'BIG' : 'SMALL';
    }

    // 4. Quantum Markov 2-Gram
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

    // 5. TGX 6-Logic Suite
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
        if (streak >= 3) return sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
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

    // 6. Zero-Lag Geometric Structural Hierarchy
    function isArrMatch(arrA, arrB) {
        if (!arrA || !arrB || arrA.length !== arrB.length) return false;
        return arrA.every((v, i) => v === arrB[i]);
    }

    function checkZigzag(results) {
        if (results.length < 3) return null;
        let zigzagLen = 0;
        for (let i = 0; i < Math.min(results.length - 1, 8); i++) {
            if (results[i] !== results[i + 1]) zigzagLen++;
            else break;
        }
        if (zigzagLen >= 3) {
            const expected = results[0] === 'BIG' ? 'SMALL' : 'BIG';
            return {
                size: expected,
                name: `⚡ ZIGZAG SWITCH (${zigzagLen}X)`,
                conf: Math.min(94, 72 + zigzagLen * 4)
            };
        }
        return null;
    }

    function checkTriangle(results) {
        if (results.length < 3) return null;
        const last3 = results.slice(0, 3).reverse();
        if (isArrMatch(last3, ["BIG", "SMALL", "SMALL"])) {
            return { size: "BIG", name: "⚡ TRIANGLE COMPLETE (BSS)", conf: 82 };
        }
        if (isArrMatch(last3, ["SMALL", "BIG", "BIG"])) {
            return { size: "SMALL", name: "⚡ TRIANGLE COMPLETE (SBB)", conf: 82 };
        }
        return null;
    }

    function check4B4S(results, streak, lastResult) {
        if (results.length < 4) return null;
        const last8 = results.slice(0, 8).reverse();
        if (streak >= 4) {
            return { size: lastResult, name: `⚡ DRAGON RIDE (${streak}${lastResult[0]})`, conf: 86 };
        }
        if (isArrMatch(last8, ["BIG","BIG","BIG","BIG","SMALL","SMALL","SMALL","SMALL"])) {
            return { size: "BIG", name: "⚡ 4B+4S CYCLE COMPLETE", conf: 87 };
        }
        if (isArrMatch(last8, ["SMALL","SMALL","SMALL","SMALL","BIG","BIG","BIG","BIG"])) {
            return { size: "SMALL", name: "⚡ 4S+4B CYCLE COMPLETE", conf: 87 };
        }
        return null;
    }

    function check3B3S(results, streak, lastResult) {
        if (results.length < 3) return null;
        const last6 = results.slice(0, 6).reverse();
        const last5 = results.slice(0, 5).reverse();
        if (isArrMatch(last6, ["BIG","BIG","BIG","SMALL","SMALL","SMALL"])) {
            return { size: "BIG", name: "⚡ 3B+3S CYCLE COMPLETE", conf: 84 };
        }
        if (isArrMatch(last6, ["SMALL","SMALL","SMALL","BIG","BIG","BIG"])) {
            return { size: "SMALL", name: "⚡ 3S+3B CYCLE COMPLETE", conf: 84 };
        }
        if (isArrMatch(last5, ["BIG","BIG","BIG","SMALL","SMALL"])) {
            return { size: "SMALL", name: "⚡ 3B+2S FORMING", conf: 80 };
        }
        if (isArrMatch(last5, ["SMALL","SMALL","SMALL","BIG","BIG"])) {
            return { size: "BIG", name: "⚡ 3S+2B FORMING", conf: 80 };
        }
        return null;
    }

    function check2B2S(results, streak, lastResult) {
        if (results.length < 3) return null;
        const last4 = results.slice(0, 4).reverse();
        const last3 = results.slice(0, 3).reverse();
        if (isArrMatch(last4, ["BIG","BIG","SMALL","SMALL"])) {
            return { size: "BIG", name: "⚡ 2B+2S CYCLE COMPLETE (BBSS)", conf: 85 };
        }
        if (isArrMatch(last4, ["SMALL","SMALL","BIG","BIG"])) {
            return { size: "SMALL", name: "⚡ 2S+2B CYCLE COMPLETE (SSBB)", conf: 85 };
        }
        if (isArrMatch(last3, ["BIG","BIG","SMALL"])) {
            return { size: "SMALL", name: "⚡ 2B+1S FORMING (BBS)", conf: 82 };
        }
        if (isArrMatch(last3, ["SMALL","SMALL","BIG"])) {
            return { size: "BIG", name: "⚡ 2S+1B FORMING (SSB)", conf: 82 };
        }
        return null;
    }

    function evaluateStructural(sizes) {
        if (!sizes || sizes.length < 3) return null;
        const lastResult = sizes[0];
        let streak = 1;
        for (let i = 1; i < sizes.length; i++) {
            if (sizes[i] === lastResult) streak++;
            else break;
        }

        const p4 = check4B4S(sizes, streak, lastResult);
        if (p4) return p4;
        const p2 = check2B2S(sizes, streak, lastResult);
        if (p2) return p2;
        const p3 = check3B3S(sizes, streak, lastResult);
        if (p3) return p3;
        const tri = checkTriangle(sizes);
        if (tri) return tri;
        const zz = checkZigzag(sizes);
        if (zz) return zz;

        return null;
    }

    // 7. Mastermind V8 Engine
    function mastermindEngine(nums) {
        if (!nums || nums.length < 3) return 'BIG';
        const last3 = nums.slice(0, 3);
        const last5 = nums.slice(0, 5);
        const last7 = nums.slice(0, Math.min(7, nums.length));
        const last12 = nums.slice(0, Math.min(12, nums.length));

        const sm3 = last3.filter(n => n <= 4).length;
        const sm5 = last5.filter(n => n <= 4).length;
        const sm7 = last7.filter(n => n <= 4).length;
        const sm12 = last12.filter(n => n <= 4).length;

        const sScore = (sm3 / 3) * 0.40 + (sm5 / 5) * 0.28 + (sm7 / 7) * 0.20 + (sm12 / 12) * 0.12;
        const bScore = ((3 - sm3) / 3) * 0.40 + ((5 - sm5) / 5) * 0.28 + ((7 - sm7) / 7) * 0.20 + ((12 - sm12) / 12) * 0.12;

        return bScore >= sScore ? 'BIG' : 'SMALL';
    }

    // 8. Oblivion Volatility Engine
    function oblivionEngine(sizes, nums) {
        if (!sizes || sizes.length < 4) return sizes[0];
        let diffSum = 0;
        for (let i = 0; i < Math.min(4, nums.length - 1); i++) {
            diffSum += Math.abs(nums[i] - nums[i + 1]);
        }
        const avgDiff = diffSum / 4;
        if (avgDiff > 4.5) {
            return sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
        }
        return sizes[0];
    }

    // MASTER ENSEMBLE COMPUTATION
    function calculateCombinedPrediction(list) {
        if (!list || list.length < 3) return null;

        const sizes = list.slice(0, 15).map(item => getSize(item.number));
        const nums = list.slice(0, 15).map(item => parseInt(item.number, 10));

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

        // 🛑 STRICT CAPITAL LOCK: If currentLevel >= 3 (after 2 consecutive losses), HARD STOP-LOSS!
        if (currentLevel >= 3) {
            return {
                prediction: 'SKIP',
                patternType: 'skip',
                patternLabel: '🛑 CAPITAL LOCK: SKIP ROUND (L3 PROTECT - DO NOT BET)',
                confidence: 0,
                latestIssue: list[0].issueNumber,
                latestNumber: parseInt(list[0].number, 10),
                nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString(),
                models: {
                    l1: 'SKIP', l2: 'SKIP', l3: 'SKIP', l4: 'SKIP', l5: 'SKIP', l6: 'SKIP',
                    tsx: 'SKIP', titan: 'SKIP', mastermind: 'SKIP', radhe: 'SKIP',
                    suresh: 'SKIP', markov: 'SKIP', oblivion: 'SKIP', painPro: 'SKIP', nexaVote: 'SKIP'
                }
            };
        }

        const votes = { BIG: 0, SMALL: 0 };

        // Structural Zero-Lag Pattern Engine
        const structural = evaluateStructural(sizes);
        let tsxVote = 'NONE';
        if (structural) {
            votes[structural.size] += 2.5;
            tsxVote = structural.size;
        }

        // Apex Titan Cadence Engine
        const titan = apexTitanEngine(sizes, Math.max(0, currentLevel - 1));
        votes[titan.vote] += 2.5;

        // Mastermind V8 AI
        const mastermind = mastermindEngine(nums);
        votes[mastermind] += 2.0;

        // Radhe Engine
        const radhe = radheEngine(list);
        votes[radhe] += 1.8;

        // Suresh VIP Engine
        const suresh = sureshEngine(list);
        votes[suresh] += 1.8;

        // Markov 2-Gram
        const markov = markovEngine(sizes);
        votes[markov] += 1.6;

        // Oblivion Volatility Index
        const oblivion = oblivionEngine(sizes, nums);
        votes[oblivion] += 1.4;

        // TGX 6-Logic Suite
        const l1 = tgxLogic1(nums, sizes); votes[l1] += 0.8;
        const l2 = tgxLogic2(nums);        votes[l2] += 0.9;
        const l3 = tgxLogic3(nums, sizes); votes[l3] += 0.8;
        const l4 = tgxLogic4(sizes);       votes[l4] += 0.8;
        const l5 = tgxLogic5(nums);        votes[l5] += 0.7;
        const l6 = tgxLogic6(sizes);       votes[l6] += 0.8;

        // The Paid Pro 3-Round Window
        const painPro = sizes.slice(0, 3).filter(x => x === 'BIG').length > 1 ? 'BIG' : 'SMALL';
        votes[painPro] += 1.0;

        // Nexa Pro 15-Round Skew
        const big15 = sizes.slice(0, 15).filter(x => x === 'BIG').length;
        let nexaVote = 'BALANCED';
        if (big15 >= 10) {
            votes.SMALL += 1.2;
            nexaVote = 'REV-S';
        } else if (big15 <= 5) {
            votes.BIG += 1.2;
            nexaVote = 'REV-B';
        }

        // Chop Zone Filter
        if (alt >= 4 && Math.abs(votes.BIG - votes.SMALL) < 1.0) {
            return {
                prediction: 'SKIP',
                patternType: 'skip',
                patternLabel: '🛑 CHOP ZONE: SKIP ROUND (WAIT FOR SOLID SIGNAL)',
                confidence: 50,
                latestIssue: list[0].issueNumber,
                latestNumber: parseInt(list[0].number, 10),
                nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString(),
                models: {
                    l1, l2, l3, l4, l5, l6,
                    tsx: tsxVote, titan: titan.vote, mastermind, radhe,
                    suresh, markov, oblivion, painPro, nexaVote
                }
            };
        }

        let patternType = 'consensus';
        let patternLabel = structural ? structural.name : titan.reg;

        if (structural) {
            patternType = structural.name.includes('DRAGON') ? 'dragon' : (structural.name.includes('ZIGZAG') ? 'zigzag' : 'cycle');
        } else if (streak >= 4) {
            patternType = 'dragon';
        } else if (alt >= 3) {
            patternType = 'zigzag';
        }

        const prediction = votes.BIG >= votes.SMALL ? 'BIG' : 'SMALL';
        const totalScore = votes.BIG + votes.SMALL;
        const baseConf = structural ? structural.conf : Math.round((Math.max(votes.BIG, votes.SMALL) / totalScore) * 100);
        const confidence = Math.min(96, Math.max(78, baseConf));

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
                tsx: tsxVote, titan: titan.vote, mastermind, radhe,
                suresh, markov, oblivion, painPro, nexaVote
            }
        };
    }

    /* =========================================================
       CROSS-DOMAIN API FETCH (GM_xmlhttpRequest + FETCH FALLBACK)
       ========================================================= */
    function fetchHistory() {
        return new Promise((resolve) => {
            const url = API_ENDPOINTS[currentMode] + '?t=' + Date.now();

            // Try GM_xmlhttpRequest first for 100% bypass of CORS & ISP blocks
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 4500,
                    onload: function (res) {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (data && data.data && data.data.list) {
                                resolve(data.data.list);
                                return;
                            }
                        } catch (e) {}
                        fallbackFetch(url, resolve);
                    },
                    onerror: function () {
                        fallbackFetch(url, resolve);
                    },
                    ontimeout: function () {
                        fallbackFetch(url, resolve);
                    }
                });
            } else {
                fallbackFetch(url, resolve);
            }
        });
    }

    function fallbackFetch(url, resolve) {
        fetch(url, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (data && data.data && data.data.list) resolve(data.data.list);
                else resolve(null);
            })
            .catch(() => resolve(null));
    }

    /* =========================================================
       AUDIO SYNTHESIZER (WEB AUDIO API - NO EXTERNAL AUDIO ASSETS)
       ========================================================= */
    function playChime(isWin) {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = isWin ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(isWin ? 880 : 280, ctx.currentTime);
            if (isWin) {
                osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
            } else {
                osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
            }

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.32);
        } catch (e) {}
    }

    /* =========================================================
       FLOATING HUD INJECTION & DRAGGABLE INTERACTION
       ========================================================= */
    const STYLES = `
        #jashvip-hud-root {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", sans-serif;
            color: #EAF1F8;
            user-select: none;
            box-sizing: border-box;
            transition: opacity 0.2s ease;
        }

        #jashvip-hud-root * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* Minimized Pill Badge */
        #jashvip-hud-mini {
            display: none;
            background: rgba(11, 14, 20, 0.92);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(228, 255, 74, 0.4);
            border-radius: 28px;
            padding: 8px 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(228, 255, 74, 0.25);
            cursor: pointer;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-weight: 800;
        }

        #jashvip-hud-mini.show {
            display: flex;
        }

        .mini-call {
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            letter-spacing: 0.05em;
        }
        .mini-call.big { background: rgba(228, 255, 74, 0.2); color: #E4FF4A; border: 1px solid #E4FF4A; }
        .mini-call.small { background: rgba(0, 217, 255, 0.2); color: #00D9FF; border: 1px solid #00D9FF; }
        .mini-call.skip { background: rgba(255, 59, 92, 0.2); color: #FF3B5C; border: 1px solid #FF3B5C; }

        /* Full HUD Card */
        #jashvip-hud-card {
            width: 320px;
            background: rgba(14, 18, 27, 0.94);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 20px;
            padding: 14px 16px;
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.75), 0 0 24px rgba(228, 255, 74, 0.12);
            position: relative;
        }

        #jashvip-hud-card.hidden {
            display: none;
        }

        /* Top Bar & Drag Handle */
        .hud-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            cursor: move;
        }

        .hud-brand {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .hud-icon {
            width: 26px;
            height: 26px;
            background: linear-gradient(135deg, #E4FF4A, #00D9FF);
            border-radius: 7px;
            display: grid;
            place-items: center;
            font-size: 13px;
            color: #06070A;
            font-weight: 900;
        }

        .hud-title {
            font-size: 13px;
            font-weight: 800;
            letter-spacing: -0.01em;
            color: #FFFFFF;
        }

        .hud-chip {
            background: #E4FF4A;
            color: #06070A;
            font-size: 8px;
            font-weight: 800;
            padding: 1px 4px;
            border-radius: 3px;
            margin-left: 4px;
        }

        .hud-controls {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .hud-btn {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #8A97AA;
            width: 26px;
            height: 26px;
            border-radius: 7px;
            display: grid;
            place-items: center;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s;
        }

        .hud-btn:hover {
            color: #E4FF4A;
            border-color: #E4FF4A;
        }

        /* Mode Selector */
        .hud-modes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: rgba(0, 0, 0, 0.35);
            padding: 3px;
            border-radius: 10px;
            margin: 10px 0;
            gap: 4px;
        }

        .hud-mode-tab {
            background: transparent;
            border: 0;
            color: #8A97AA;
            padding: 6px;
            border-radius: 7px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.05em;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
        }

        .hud-mode-tab.active {
            background: linear-gradient(135deg, rgba(228, 255, 74, 0.2), rgba(0, 217, 255, 0.15));
            color: #FFFFFF;
            border: 1px solid rgba(228, 255, 74, 0.4);
        }

        /* Period & Countdown Row */
        .hud-meta-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .hud-period {
            font-size: 12px;
            font-weight: 800;
            font-family: monospace;
            color: #FFFFFF;
        }

        .hud-timer {
            display: flex;
            align-items: center;
            gap: 4px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 3px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            font-family: monospace;
        }

        .hud-timer.urgent {
            background: rgba(255, 84, 112, 0.2);
            border-color: #FF5470;
            color: #FF5470;
            animation: jashPulse 0.8s infinite;
        }

        @keyframes jashPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        /* Stage Level Pill */
        .hud-level-pill {
            text-align: center;
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 10px;
            background: rgba(16, 185, 129, 0.12);
            border: 1px solid rgba(16, 185, 129, 0.35);
            color: #10B981;
        }

        .hud-level-pill.lvl2 {
            background: rgba(255, 176, 32, 0.15);
            border-color: rgba(255, 176, 32, 0.45);
            color: #FFB020;
        }

        .hud-level-pill.skip {
            background: rgba(255, 59, 92, 0.25);
            border-color: #FF3B5C;
            color: #FF3B5C;
            animation: jashPulse 0.7s infinite;
        }

        /* Central Big/Small Callout */
        .hud-prediction-box {
            text-align: center;
            padding: 10px 0;
            background: rgba(0, 0, 0, 0.25);
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            margin-bottom: 10px;
        }

        .hud-pred-text {
            font-size: 42px;
            font-weight: 900;
            letter-spacing: -0.02em;
            line-height: 1;
            margin-bottom: 4px;
        }

        .hud-pred-text.big {
            color: #E4FF4A;
            text-shadow: 0 0 24px rgba(228, 255, 74, 0.5);
        }

        .hud-pred-text.small {
            color: #00D9FF;
            text-shadow: 0 0 24px rgba(0, 217, 255, 0.5);
        }

        .hud-pred-text.skip {
            color: #FF3B5C;
            font-size: 32px;
            text-shadow: 0 0 24px rgba(255, 59, 92, 0.6);
            animation: jashPulse 1s infinite;
        }

        .hud-pred-text.loading {
            font-size: 20px;
            color: #505B6D;
        }

        .hud-pattern-desc {
            font-size: 9px;
            font-family: monospace;
            font-weight: 700;
            color: #8A97AA;
            padding: 0 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Stats Grid */
        .hud-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            text-align: center;
            margin-bottom: 10px;
        }

        .hud-stat-box {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            padding: 6px 2px;
            border-radius: 8px;
        }

        .hud-stat-val {
            font-size: 13px;
            font-weight: 800;
            font-family: monospace;
            color: #FFFFFF;
        }

        .hud-stat-lbl {
            font-size: 7.5px;
            color: #505B6D;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 1px;
        }

        /* Mini Log Row */
        .hud-recent-log {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 8px;
            background: rgba(255, 255, 255, 0.025);
            border-radius: 8px;
            font-size: 9.5px;
            font-family: monospace;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hud-log-badge {
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 4px;
        }
        .hud-log-badge.win { background: rgba(16, 185, 129, 0.2); color: #10B981; }
        .hud-log-badge.loss { background: rgba(255, 59, 92, 0.2); color: #FF3B5C; }
        .hud-log-badge.skip { background: rgba(255, 176, 32, 0.2); color: #FFB020; }
    `;

    // Inject Styles into Document Head
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    // Build HUD DOM
    const hudContainer = document.createElement('div');
    hudContainer.id = 'jashvip-hud-root';
    hudContainer.innerHTML = `
        <!-- Minimized Floating Widget -->
        <div id="jashvip-hud-mini" title="Click to open JASHVIP AI HUD">
            <span>⚡ JASHVIP</span>
            <span class="mini-call big" id="hudMiniCall">WAIT</span>
            <span id="hudMiniTimer" style="color: #8A97AA; font-family: monospace;">--:--</span>
        </div>

        <!-- Full HUD Window -->
        <div id="jashvip-hud-card">
            <!-- Header Handle -->
            <div class="hud-header" id="hudHeaderHandle">
                <div class="hud-brand">
                    <div class="hud-icon">⚡</div>
                    <div class="hud-title">JASHVIP <span class="hud-chip">ULTIMATE</span></div>
                </div>
                <div class="hud-controls">
                    <button class="hud-btn" id="hudSoundBtn" title="Toggle Sound">🔊</button>
                    <button class="hud-btn" id="hudRefreshBtn" title="Re-Analyze">🔄</button>
                    <button class="hud-btn" id="hudMinimizeBtn" title="Minimize">—</button>
                </div>
            </div>

            <!-- Mode Selector -->
            <div class="hud-modes">
                <button class="hud-mode-tab active" id="hudTab1m">WinGo 1 Min</button>
                <button class="hud-mode-tab" id="hudTab30s">WinGo 30 Sec</button>
            </div>

            <!-- Period & Timer -->
            <div class="hud-meta-row">
                <div class="hud-period" id="hudPeriod">#LOADING...</div>
                <div class="hud-timer" id="hudTimer">
                    <span>⏱️</span>
                    <span id="hudTimerVal">--:--</span>
                </div>
            </div>

            <!-- Stage Level Pill -->
            <div class="hud-level-pill" id="hudLevelPill">🎯 STAGE: LEVEL 1 (1X - BASE)</div>

            <!-- Prediction Box -->
            <div class="hud-prediction-box">
                <div class="hud-pred-text loading" id="hudPredDisplay">ANALYZING...</div>
                <div class="hud-pattern-desc" id="hudPatternDesc">SYNCHRONIZING ZERO-LAG ENGINE</div>
            </div>

            <!-- Quick Stats Grid -->
            <div class="hud-stats-grid">
                <div class="hud-stat-box">
                    <div class="hud-stat-val" id="hudStatWinRate" style="color: #E4FF4A;">0%</div>
                    <div class="hud-stat-lbl">Win Rate</div>
                </div>
                <div class="hud-stat-box">
                    <div class="hud-stat-val" id="hudStatStreak" style="color: #10B981;">0W</div>
                    <div class="hud-stat-lbl">Current</div>
                </div>
                <div class="hud-stat-box">
                    <div class="hud-stat-val" id="hudStatConf" style="color: #00D9FF;">--%</div>
                    <div class="hud-stat-lbl">Confidence</div>
                </div>
            </div>

            <!-- Recent Result Row -->
            <div class="hud-recent-log" id="hudRecentLog">
                <span>Last Outcome</span>
                <span class="hud-log-badge win" id="hudLogBadge">STANDBY</span>
            </div>
        </div>
    `;

    document.body.appendChild(hudContainer);

    /* =========================================================
       DOM ELEMENTS & DRAGGING LOGIC
       ========================================================= */
    const hudCard = document.getElementById('jashvip-hud-card');
    const hudMini = document.getElementById('jashvip-hud-mini');
    const hudHeaderHandle = document.getElementById('hudHeaderHandle');
    const hudMinimizeBtn = document.getElementById('hudMinimizeBtn');
    const hudSoundBtn = document.getElementById('hudSoundBtn');
    const hudRefreshBtn = document.getElementById('hudRefreshBtn');
    const hudTab1m = document.getElementById('hudTab1m');
    const hudTab30s = document.getElementById('hudTab30s');

    const hudPeriod = document.getElementById('hudPeriod');
    const hudTimerVal = document.getElementById('hudTimerVal');
    const hudTimer = document.getElementById('hudTimer');
    const hudLevelPill = document.getElementById('hudLevelPill');
    const hudPredDisplay = document.getElementById('hudPredDisplay');
    const hudPatternDesc = document.getElementById('hudPatternDesc');
    const hudStatWinRate = document.getElementById('hudStatWinRate');
    const hudStatStreak = document.getElementById('hudStatStreak');
    const hudStatConf = document.getElementById('hudStatConf');
    const hudLogBadge = document.getElementById('hudLogBadge');
    const hudMiniCall = document.getElementById('hudMiniCall');
    const hudMiniTimer = document.getElementById('hudMiniTimer');

    // Draggable Functionality
    let isDragging = false;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    hudHeaderHandle.addEventListener('mousedown', function (e) {
        if (e.target.closest('button')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = hudContainer.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        hudContainer.style.right = 'auto';
        hudContainer.style.left = `${initialLeft}px`;
        hudContainer.style.top = `${initialTop}px`;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        hudContainer.style.left = `${Math.max(10, Math.min(window.innerWidth - 330, initialLeft + dx))}px`;
        hudContainer.style.top = `${Math.max(10, Math.min(window.innerHeight - 100, initialTop + dy))}px`;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Minimized Toggle
    hudMinimizeBtn.addEventListener('click', () => {
        hudCard.classList.add('hidden');
        hudMini.classList.add('show');
    });

    hudMini.addEventListener('click', () => {
        hudMini.classList.remove('show');
        hudCard.classList.remove('hidden');
    });

    // Sound Toggle
    hudSoundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        hudSoundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    });

    // Manual Refresh
    hudRefreshBtn.addEventListener('click', () => {
        runEngine();
    });

    // Mode Switchers
    hudTab1m.addEventListener('click', () => switchMode('1M'));
    hudTab30s.addEventListener('click', () => switchMode('30S'));

    function switchMode(mode) {
        if (currentMode === mode) return;
        currentMode = mode;
        hudTab1m.classList.toggle('active', mode === '1M');
        hudTab30s.classList.toggle('active', mode === '30S');

        lastResolvedIssue = null;
        currentPrediction = null;
        currentLevel = 1;
        updateLevelUI();

        hudPredDisplay.textContent = 'ANALYZING...';
        hudPredDisplay.className = 'hud-pred-text loading';
        hudPatternDesc.textContent = 'SWITCHING ENGINE...';

        startTimer();
        runEngine();
    }

    /* =========================================================
       UI UPDATES & PREDICTION RENDERING
       ========================================================= */
    function updateLevelUI() {
        if (currentLevel === 1) {
            hudLevelPill.className = 'hud-level-pill';
            hudLevelPill.textContent = '🎯 STAGE: LEVEL 1 (1X - BASE)';
        } else if (currentLevel === 2) {
            hudLevelPill.className = 'hud-level-pill lvl2';
            hudLevelPill.textContent = '⚡ STAGE: LEVEL 2 (3X - RECOVERY)';
        } else {
            hudLevelPill.className = 'hud-level-pill skip';
            hudLevelPill.textContent = '🛑 CAPITAL LOCK: SKIP ROUND (DO NOT BET)';
        }
    }

    function renderPrediction(data) {
        hudPeriod.textContent = `#${data.nextPeriod.slice(-6)}`;
        hudStatConf.textContent = data.confidence ? `${data.confidence}%` : '--%';
        hudPatternDesc.textContent = data.patternLabel;

        if (data.prediction === 'SKIP') {
            hudPredDisplay.textContent = '🛑 SKIP';
            hudPredDisplay.className = 'hud-pred-text skip';
            hudMiniCall.textContent = 'SKIP 🛑';
            hudMiniCall.className = 'mini-call skip';
        } else {
            hudPredDisplay.textContent = data.prediction;
            hudPredDisplay.className = `hud-pred-text ${data.prediction.toLowerCase()}`;
            hudMiniCall.textContent = data.prediction;
            hudMiniCall.className = `mini-call ${data.prediction.toLowerCase()}`;
        }
    }

    function recordOutcome(item) {
        if (item.isSkip) {
            currentLevel = 1;
            hudLogBadge.className = 'hud-log-badge skip';
            hudLogBadge.textContent = 'SKIPPED 🛡️';
        } else if (item.isWin) {
            currentLevel = 1;
            hudLogBadge.className = 'hud-log-badge win';
            hudLogBadge.textContent = `WIN ✓ (${item.actualCategory})`;
        } else {
            currentLevel++;
            if (currentLevel > 2) currentLevel = 3;
            hudLogBadge.className = 'hud-log-badge loss';
            hudLogBadge.textContent = `LOSS ✕ (${item.actualCategory})`;
        }
        updateLevelUI();

        historyLogs.unshift(item);
        updateStats();
    }

    function updateStats() {
        const bets = historyLogs.filter(x => !x.isSkip);
        const total = bets.length;
        const wins = bets.filter(x => x.isWin).length;
        const winRate = total ? Math.round((wins / total) * 100) : 0;

        hudStatWinRate.textContent = `${winRate}%`;

        // Calculate current streak
        let streak = 0;
        let streakType = null;
        for (const r of bets) {
            if (streakType === null) {
                streakType = r.isWin ? 'W' : 'L';
                streak = 1;
            } else if ((streakType === 'W' && r.isWin) || (streakType === 'L' && !r.isWin)) {
                streak++;
            } else {
                break;
            }
        }
        hudStatStreak.textContent = streak ? `${streak}${streakType}` : '0W';
        hudStatStreak.style.color = streakType === 'W' ? '#10B981' : (streakType === 'L' ? '#FF3B5C' : '#FFFFFF');
    }

    /* =========================================================
       ENGINE EXECUTION & REAL-TIME TIMER LOOP
       ========================================================= */
    async function runEngine() {
        const list = await fetchHistory();
        if (!list || list.length < 3) return;

        const top = list[0];
        const actualCategory = getSize(top.number);
        const actualNum = parseInt(top.number, 10);

        if (lastResolvedIssue !== top.issueNumber) {
            if (currentPrediction && currentPrediction.nextPeriod === top.issueNumber) {
                if (currentPrediction.prediction === 'SKIP') {
                    recordOutcome({
                        period: top.issueNumber,
                        predicted: 'SKIP',
                        actualNum,
                        actualCategory,
                        isWin: null,
                        isSkip: true
                    });
                } else {
                    const isWin = (currentPrediction.prediction === actualCategory);
                    recordOutcome({
                        period: top.issueNumber,
                        predicted: currentPrediction.prediction,
                        actualNum,
                        actualCategory,
                        isWin,
                        isSkip: false
                    });
                    playChime(isWin);
                }
            }

            lastResolvedIssue = top.issueNumber;

            const result = calculateCombinedPrediction(list);
            if (result) {
                currentPrediction = result;
                renderPrediction(result);
            }
        }
    }

    function startTimer() {
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            const now = new Date();
            const sec = now.getSeconds();
            const ms = now.getMilliseconds();

            let remaining;
            if (currentMode === '1M') {
                remaining = 60 - sec;
            } else {
                remaining = 30 - (sec % 30);
            }

            if (remaining === 0) remaining = currentMode === '1M' ? 60 : 30;

            const displaySec = String(remaining).padStart(2, '0');
            hudTimerVal.textContent = `00:${displaySec}`;
            hudMiniTimer.textContent = `00:${displaySec}`;

            const isUrgent = remaining <= 5;
            hudTimer.classList.toggle('urgent', isUrgent);

            // Fast refresh right when round resolves
            if (remaining === 1 && ms > 700) {
                setTimeout(runEngine, 600);
            }
        }, 250);
    }

    // Boot
    updateLevelUI();
    startTimer();
    runEngine();
    pollInterval = setInterval(runEngine, 2500);

    console.log('%c[JASHVIP ULTIMATE]%c Floating Prediction HUD injected successfully.', 'color:#E4FF4A;font-weight:bold;', 'color:#FFFFFF;');
})();
