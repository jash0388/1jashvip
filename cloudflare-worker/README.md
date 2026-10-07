# ⚡ JASHVIP ULTIMATE — Cloudflare Worker Edge Server

High-performance, zero-latency serverless edge engine running on Cloudflare Workers (300+ global data centers).

---

## 🌟 Capabilities

1. **Edge-Hosted Web App (`/`)**: Directly serves the JASHVIP Ultimate dashboard with instantaneous global loading.
2. **CORS & ISP Bypass Proxy (`/api/history?mode=1M`)**: Proxies official WinGo lottery results with full CORS headers (`Access-Control-Allow-Origin: *`), preventing ISP blocks (Airtel, Jio, etc.).
3. **Edge AI Prediction API (`/api/prediction?mode=1M&level=1`)**: Runs the multi-model ensemble (Apex Titan + Mastermind + Radhe + Suresh + Markov + TGX + Geometric Structural Zero-Lag) directly inside Cloudflare's Edge V8 runtime.
4. **Capital Lock Protection**: Automatically commands `🛑 SKIP` on Level 3 drawdown states to protect bankrolls.

---

## 🚀 Deployment Options

### Option A: Cloudflare Web Dashboard (Fastest — 60 Seconds, No Terminal)

1. Log into your free account at [dash.cloudflare.com](https://dash.cloudflare.com/).
2. In the left navigation, click **Compute (Workers & Pages)** > **Create application**.
3. Click **Create Worker**.
4. Give it a name (e.g., `jashvip-engine`) and click **Deploy**.
5. Click **Edit code**.
6. Replace everything in the online editor with the contents of `worker.js`.
7. Click **Save and deploy**.
8. Done! Your edge server is live worldwide at `https://jashvip-engine.<your-subdomain>.workers.dev`.

---

### Option B: Wrangler CLI (One Command)

From this directory:

```bash
# 1. Log in to Cloudflare (one-time setup)
npx wrangler login

# 2. Deploy to Cloudflare Workers
npx wrangler deploy
```

---

## 📡 API Endpoints

### 1. Edge Prediction
```http
GET /api/prediction?mode=1M&level=1
```
#### Response:
```json
{
  "status": "success",
  "mode": "1M",
  "prediction": "BIG",
  "confidence": 88,
  "patternLabel": "⚡ 3S+3B CYCLE COMPLETE",
  "patternType": "cycle",
  "nextPeriod": "2026100811350",
  "latestNumber": 3,
  "stageLevel": 1,
  "models": {
    "tsx": "BIG",
    "titan": "BIG",
    "mastermind": "BIG",
    "radhe": "BIG",
    "suresh": "BIG",
    "markov": "BIG",
    "oblivion": "BIG",
    "painPro": "BIG",
    "nexaVote": "BALANCED"
  },
  "serverTimestamp": 1791408266911
}
```

### 2. Live Draw History (CORS-Free)
```http
GET /api/history?mode=1M
GET /api/history?mode=30S
```

### 3. Server Health
```http
GET /api/health
```
