import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const workerCode = `/**
 * =========================================================
 * JASHVIP ULTIMATE AI — CLOUDFLARE WORKER EDGE ENGINE & PROXY
 * High-performance edge server for WinGo (1M / 30S):
 * 1. CORS-free API Proxy to bypass ISP/firewall blocks
 * 2. Edge-computed AI Multi-Model Predictions
 * 3. Instant Static HTML Web Hosting at 300+ Edge Locations
 * =========================================================
 */

const HTML_CONTENT = ${JSON.stringify(htmlContent)};

const API_ENDPOINTS = {
  '1M': 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
  '30S': 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json'
};

// Size helper
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

// 4. Markov 2-Gram
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

// 6. Zero-Lag Geometric Hierarchy
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
      name: \`⚡ ZIGZAG SWITCH (\${zigzagLen}X)\`,
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
    return { size: lastResult, name: \`⚡ DRAGON RIDE (\${streak}\${lastResult[0]})\`, conf: 86 };
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

// Master Ensemble Computation
function calculateCombinedPrediction(list, currentLevel = 1) {
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

  // 🛑 Level 3 Hard Stop Lock
  if (currentLevel >= 3) {
    return {
      prediction: 'SKIP',
      patternType: 'skip',
      patternLabel: '🛑 CAPITAL LOCK: SKIP ROUND (L3 PROTECT - DO NOT BET)',
      confidence: 0,
      latestIssue: list[0].issueNumber,
      latestNumber: parseInt(list[0].number, 10),
      nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString(),
      stageLevel: 3,
      models: {
        l1: 'SKIP', l2: 'SKIP', l3: 'SKIP', l4: 'SKIP', l5: 'SKIP', l6: 'SKIP',
        tsx: 'SKIP', titan: 'SKIP', mastermind: 'SKIP', radhe: 'SKIP',
        suresh: 'SKIP', markov: 'SKIP', oblivion: 'SKIP', painPro: 'SKIP', nexaVote: 'SKIP'
      }
    };
  }

  const votes = { BIG: 0, SMALL: 0 };

  const structural = evaluateStructural(sizes);
  let tsxVote = 'NONE';
  if (structural) {
    votes[structural.size] += 2.5;
    tsxVote = structural.size;
  }

  const titan = apexTitanEngine(sizes, Math.max(0, currentLevel - 1));
  votes[titan.vote] += 2.5;

  const mastermind = mastermindEngine(nums);
  votes[mastermind] += 2.0;

  const radhe = radheEngine(list);
  votes[radhe] += 1.8;

  const suresh = sureshEngine(list);
  votes[suresh] += 1.8;

  const markov = markovEngine(sizes);
  votes[markov] += 1.6;

  const oblivion = oblivionEngine(sizes, nums);
  votes[oblivion] += 1.4;

  const l1 = tgxLogic1(nums, sizes); votes[l1] += 0.8;
  const l2 = tgxLogic2(nums);        votes[l2] += 0.9;
  const l3 = tgxLogic3(nums, sizes); votes[l3] += 0.8;
  const l4 = tgxLogic4(sizes);       votes[l4] += 0.8;
  const l5 = tgxLogic5(nums);        votes[l5] += 0.7;
  const l6 = tgxLogic6(sizes);       votes[l6] += 0.8;

  const painPro = sizes.slice(0, 3).filter(x => x === 'BIG').length > 1 ? 'BIG' : 'SMALL';
  votes[painPro] += 1.0;

  const big15 = sizes.slice(0, 15).filter(x => x === 'BIG').length;
  let nexaVote = 'BALANCED';
  if (big15 >= 10) {
    votes.SMALL += 1.2;
    nexaVote = 'REV-S';
  } else if (big15 <= 5) {
    votes.BIG += 1.2;
    nexaVote = 'REV-B';
  }

  if (alt >= 4 && Math.abs(votes.BIG - votes.SMALL) < 1.0) {
    return {
      prediction: 'SKIP',
      patternType: 'skip',
      patternLabel: '🛑 CHOP ZONE: SKIP ROUND (WAIT FOR SOLID SIGNAL)',
      confidence: 50,
      latestIssue: list[0].issueNumber,
      latestNumber: parseInt(list[0].number, 10),
      nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString(),
      stageLevel: currentLevel,
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
    stageLevel: currentLevel,
    models: {
      l1, l2, l3, l4, l5, l6,
      tsx: tsxVote,
      titan: titan.vote,
      mastermind,
      radhe,
      suresh,
      markov,
      oblivion,
      painPro,
      nexaVote
    }
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    };

    // Preflight CORS handler
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'online',
        service: 'JASHVIP Ultimate Edge Engine',
        platform: 'Cloudflare Workers (Edge V8)',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // History proxy with edge caching
    if (pathname === '/api/history') {
      const mode = (url.searchParams.get('mode') || '1M').toUpperCase();
      const targetUrl = API_ENDPOINTS[mode] || API_ENDPOINTS['1M'];

      try {
        const upstream = await fetch(targetUrl + '?t=' + Date.now(), {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        const data = await upstream.text();
        return new Response(data, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=2'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to fetch draw history', message: err.message }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Edge AI Prediction API
    if (pathname === '/api/prediction') {
      const mode = (url.searchParams.get('mode') || '1M').toUpperCase();
      const level = parseInt(url.searchParams.get('level') || '1', 10);
      const targetUrl = API_ENDPOINTS[mode] || API_ENDPOINTS['1M'];

      try {
        const upstream = await fetch(targetUrl + '?t=' + Date.now(), {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        const json = await upstream.json();
        const list = json?.data?.list;

        if (!list || list.length < 3) {
          return new Response(JSON.stringify({ error: 'Incomplete draw data from lottery API' }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const prediction = calculateCombinedPrediction(list, level);
        return new Response(JSON.stringify({
          status: 'success',
          mode,
          ...prediction,
          serverTimestamp: Date.now()
        }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Prediction computation error', message: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Web App Frontend (Default Route)
    return new Response(HTML_CONTENT, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
        'X-Powered-By': 'JASHVIP Cloudflare Edge Engine'
      }
    });
  }
};
`;

fs.writeFileSync(path.resolve('./worker.js'), workerCode, 'utf-8');
console.log('Successfully generated cloudflare-worker/worker.js (' + Buffer.byteLength(workerCode) + ' bytes)');
