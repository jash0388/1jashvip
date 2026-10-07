/**
 * =========================================================
 * JASHVIP ULTIMATE AI — CLOUDFLARE WORKER EDGE ENGINE & PROXY
 * High-performance edge server for WinGo (1M / 30S):
 * 1. CORS-free API Proxy to bypass ISP/firewall blocks
 * 2. Edge-computed AI Multi-Model Predictions
 * 3. Instant Static HTML Web Hosting at 300+ Edge Locations
 * =========================================================
 */

const HTML_CONTENT = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover\">\n    <title>JASHVIP — Ultimate AI Prediction Engine</title>\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;600;800&display=swap\" rel=\"stylesheet\">\n    <style>\n        :root {\n            --a1: #E4FF4A;\n            --a2: #00D9FF;\n            --a3: #FF5470;\n            --a4: #FFB020;\n            --win: #10B981;\n            --loss: #FF3B5C;\n            --ink: #06070A;\n            --ink2: #0B0E14;\n            --ink3: #121722;\n            --card-bg: rgba(18, 23, 34, 0.82);\n            --tx: #EAF1F8;\n            --mu: #8A97AA;\n            --dm: #505B6D;\n            --ln: rgba(255, 255, 255, 0.08);\n            --ln2: rgba(255, 255, 255, 0.16);\n            --disp: 'Space Grotesk', system-ui, -apple-system, sans-serif;\n            --mono: 'JetBrains Mono', monospace;\n        }\n\n        * {\n            box-sizing: border-box;\n            margin: 0;\n            padding: 0;\n            -webkit-tap-highlight-color: transparent;\n        }\n\n        body {\n            background-color: var(--ink);\n            color: var(--tx);\n            font-family: var(--disp);\n            min-height: 100vh;\n            overflow-x: hidden;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            padding: 14px 12px 60px;\n            background-image: \n                radial-gradient(110% 70% at 50% -10%, color-mix(in srgb, var(--a1) 12%, transparent) 0%, transparent 60%),\n                radial-gradient(80% 60% at 100% 100%, color-mix(in srgb, var(--a2) 10%, transparent) 0%, transparent 60%),\n                linear-gradient(180deg, var(--ink) 0%, var(--ink2) 50%, var(--ink3) 100%);\n        }\n\n        /* Subtle grid background */\n        .bg-grid {\n            position: fixed;\n            inset: 0;\n            pointer-events: none;\n            background-image: \n                linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),\n                linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);\n            background-size: 40px 40px;\n            z-index: 0;\n        }\n\n        .container {\n            width: 100%;\n            max-width: 520px;\n            position: relative;\n            z-index: 1;\n            display: flex;\n            flex-direction: column;\n            gap: 14px;\n        }\n\n        /* Header */\n        header {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            padding: 10px 14px;\n            background: var(--card-bg);\n            backdrop-filter: blur(16px);\n            -webkit-backdrop-filter: blur(16px);\n            border: 1px solid var(--ln);\n            border-radius: 18px;\n            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);\n        }\n\n        .brand {\n            display: flex;\n            align-items: center;\n            gap: 10px;\n        }\n\n        .brand-icon {\n            width: 38px;\n            height: 38px;\n            background: linear-gradient(135deg, var(--a1), var(--a2));\n            border-radius: 10px;\n            display: grid;\n            place-items: center;\n            font-size: 20px;\n            box-shadow: 0 0 20px color-mix(in srgb, var(--a1) 40%, transparent);\n        }\n\n        .brand-title {\n            font-size: 17px;\n            font-weight: 800;\n            letter-spacing: -0.02em;\n            display: flex;\n            align-items: center;\n            gap: 6px;\n        }\n\n        .vip-chip {\n            background: var(--a1);\n            color: var(--ink);\n            font-family: var(--mono);\n            font-size: 9px;\n            font-weight: 800;\n            padding: 2px 6px;\n            border-radius: 4px;\n            letter-spacing: 0.1em;\n        }\n\n        .brand-sub {\n            font-size: 9px;\n            font-family: var(--mono);\n            color: var(--mu);\n            letter-spacing: 0.15em;\n            text-transform: uppercase;\n        }\n\n        .header-actions {\n            display: flex;\n            align-items: center;\n            gap: 6px;\n        }\n\n        .icon-btn {\n            background: rgba(255, 255, 255, 0.05);\n            border: 1px solid var(--ln);\n            color: var(--tx);\n            width: 36px;\n            height: 36px;\n            border-radius: 10px;\n            display: grid;\n            place-items: center;\n            cursor: pointer;\n            font-size: 14px;\n            transition: all 0.2s ease;\n        }\n\n        .icon-btn:hover {\n            border-color: var(--a1);\n            color: var(--a1);\n            transform: translateY(-1px);\n        }\n\n        .status-dot {\n            display: inline-flex;\n            align-items: center;\n            gap: 5px;\n            font-family: var(--mono);\n            font-size: 9px;\n            font-weight: 700;\n            color: var(--win);\n            padding: 4px 8px;\n            border-radius: 20px;\n            background: rgba(16, 185, 129, 0.1);\n            border: 1px solid rgba(16, 185, 129, 0.25);\n        }\n\n        .status-dot::before {\n            content: \"\";\n            width: 6px;\n            height: 6px;\n            background: var(--win);\n            border-radius: 50%;\n            box-shadow: 0 0 8px var(--win);\n            animation: pulse 1.6s infinite;\n        }\n\n        @keyframes pulse {\n            0%, 100% { opacity: 1; transform: scale(1); }\n            50% { opacity: 0.4; transform: scale(0.8); }\n        }\n\n        /* Mode Selector Tabs */\n        .mode-tabs {\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n            background: rgba(10, 14, 22, 0.7);\n            padding: 4px;\n            border-radius: 14px;\n            border: 1px solid var(--ln);\n            gap: 6px;\n        }\n\n        .mode-tab {\n            background: transparent;\n            border: 0;\n            color: var(--mu);\n            padding: 10px 14px;\n            border-radius: 10px;\n            font-family: var(--mono);\n            font-size: 11px;\n            font-weight: 700;\n            letter-spacing: 0.08em;\n            cursor: pointer;\n            transition: all 0.22s ease;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            gap: 7px;\n            text-transform: uppercase;\n        }\n\n        .mode-tab.active {\n            background: linear-gradient(135deg, rgba(228, 255, 74, 0.18), rgba(0, 217, 255, 0.12));\n            color: var(--tx);\n            border: 1px solid color-mix(in srgb, var(--a1) 45%, transparent);\n            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);\n        }\n\n        /* Hero Prediction Card */\n        .card {\n            background: var(--card-bg);\n            backdrop-filter: blur(18px);\n            -webkit-backdrop-filter: blur(18px);\n            border: 1px solid var(--ln);\n            border-radius: 24px;\n            padding: 24px 20px;\n            position: relative;\n            overflow: hidden;\n            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);\n        }\n\n        .card::before {\n            content: \"\";\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 48px;\n            height: 2px;\n            background: var(--a1);\n            box-shadow: 0 0 16px var(--a1);\n        }\n\n        .hero-top {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin-bottom: 12px;\n        }\n\n        .period-info {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n        }\n\n        .period-num {\n            font-family: var(--mono);\n            font-size: 15px;\n            font-weight: 800;\n            color: var(--tx);\n            letter-spacing: -0.01em;\n        }\n\n        .copy-pill {\n            background: rgba(255, 255, 255, 0.06);\n            border: 1px solid var(--ln);\n            padding: 3px 8px;\n            border-radius: 6px;\n            font-size: 10px;\n            color: var(--mu);\n            cursor: pointer;\n            font-family: var(--mono);\n            transition: all 0.2s;\n        }\n\n        .copy-pill:hover {\n            color: var(--a1);\n            border-color: var(--a1);\n        }\n\n        /* Countdown Timer */\n        .timer-badge {\n            display: inline-flex;\n            align-items: center;\n            gap: 6px;\n            padding: 6px 12px;\n            background: rgba(255, 255, 255, 0.04);\n            border: 1px solid var(--ln);\n            border-radius: 12px;\n            font-family: var(--mono);\n            font-size: 14px;\n            font-weight: 800;\n            color: var(--tx);\n        }\n\n        .timer-badge.urgent {\n            background: rgba(255, 84, 112, 0.15);\n            border-color: var(--a3);\n            color: var(--a3);\n            box-shadow: 0 0 16px rgba(255, 84, 112, 0.35);\n            animation: pulseUrgent 0.8s infinite;\n        }\n\n        @keyframes pulseUrgent {\n            0%, 100% { transform: scale(1); }\n            50% { transform: scale(1.04); }\n        }\n\n        /* Level Guard Badge */\n        .level-guard-row {\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            margin-bottom: 4px;\n        }\n\n        .level-pill {\n            display: inline-flex;\n            align-items: center;\n            gap: 6px;\n            padding: 4px 12px;\n            border-radius: 20px;\n            font-family: var(--mono);\n            font-size: 10px;\n            font-weight: 800;\n            letter-spacing: 0.1em;\n            text-transform: uppercase;\n            border: 1px solid var(--ln);\n            background: rgba(255, 255, 255, 0.04);\n            color: var(--a1);\n            transition: all 0.25s;\n        }\n\n        .level-pill.lvl1 {\n            border-color: rgba(16, 185, 129, 0.4);\n            background: rgba(16, 185, 129, 0.1);\n            color: var(--win);\n        }\n\n        .level-pill.lvl2 {\n            border-color: rgba(255, 176, 32, 0.4);\n            background: rgba(255, 176, 32, 0.1);\n            color: var(--a4);\n        }\n\n        .level-pill.lvl3 {\n            border-color: rgba(255, 84, 112, 0.45);\n            background: rgba(255, 84, 112, 0.15);\n            color: var(--a3);\n            animation: pulseUrgent 1s infinite;\n        }\n\n        .level-pill.skip {\n            border-color: rgba(255, 68, 68, 0.7);\n            background: rgba(255, 68, 68, 0.2);\n            color: #ff5555;\n            animation: pulseUrgent 0.8s infinite;\n        }\n\n        /* Big Prediction Presentation */\n        .prediction-box {\n            text-align: center;\n            padding: 18px 10px 16px;\n            position: relative;\n        }\n\n        .pred-label {\n            font-family: var(--mono);\n            font-size: 10px;\n            font-weight: 700;\n            letter-spacing: 0.22em;\n            text-transform: uppercase;\n            color: var(--mu);\n            margin-bottom: 6px;\n        }\n\n        .pred-display {\n            font-size: clamp(66px, 19vw, 96px);\n            font-weight: 900;\n            line-height: 0.95;\n            letter-spacing: -0.04em;\n            text-transform: uppercase;\n            margin: 8px 0 14px;\n            transition: all 0.3s ease;\n        }\n\n        .pred-display.big {\n            color: var(--a1);\n            text-shadow: 0 0 52px color-mix(in srgb, var(--a1) 55%, transparent);\n        }\n\n        .pred-display.small {\n            color: var(--a2);\n            text-shadow: 0 0 52px color-mix(in srgb, var(--a2) 55%, transparent);\n        }\n\n        .pred-display.loading {\n            color: var(--dm);\n            font-size: 38px;\n            letter-spacing: 0.05em;\n        }\n\n        .pred-display.skip {\n            color: var(--loss);\n            font-size: clamp(48px, 14vw, 72px);\n            text-shadow: 0 0 52px color-mix(in srgb, var(--loss) 60%, transparent);\n            animation: pulse-skip 1.2s infinite ease-in-out;\n        }\n\n        @keyframes pulse-skip {\n            0%, 100% { opacity: 1; transform: scale(1); }\n            50% { opacity: 0.82; transform: scale(0.97); }\n        }\n\n        /* Pattern Strategy Banner */\n        .pattern-banner {\n            display: inline-flex;\n            align-items: center;\n            gap: 7px;\n            padding: 8px 16px;\n            border-radius: 12px;\n            font-family: var(--mono);\n            font-size: 11px;\n            font-weight: 800;\n            letter-spacing: 0.08em;\n            text-transform: uppercase;\n            margin-top: 4px;\n            background: rgba(255, 255, 255, 0.04);\n            border: 1px solid var(--ln);\n        }\n\n        .pattern-banner.skip {\n            background: rgba(255, 59, 92, 0.16);\n            border-color: rgba(255, 59, 92, 0.6);\n            color: var(--loss);\n            box-shadow: 0 0 28px rgba(255, 59, 92, 0.35);\n        }\n\n        .pattern-banner.zigzag {\n            background: rgba(0, 217, 255, 0.12);\n            border-color: rgba(0, 217, 255, 0.45);\n            color: var(--a2);\n            box-shadow: 0 0 24px rgba(0, 217, 255, 0.22);\n        }\n\n        .pattern-banner.dragon {\n            background: rgba(228, 255, 74, 0.12);\n            border-color: rgba(228, 255, 74, 0.45);\n            color: var(--a1);\n            box-shadow: 0 0 24px rgba(228, 255, 74, 0.22);\n        }\n\n        .pattern-banner.cycle {\n            background: rgba(16, 185, 129, 0.12);\n            border-color: rgba(16, 185, 129, 0.45);\n            color: var(--win);\n            box-shadow: 0 0 24px rgba(16, 185, 129, 0.22);\n        }\n\n        .pattern-banner.consensus {\n            background: rgba(255, 176, 32, 0.12);\n            border-color: rgba(255, 176, 32, 0.35);\n            color: var(--a4);\n        }\n\n        /* Confidence & Meta Grid */\n        .meta-grid {\n            display: grid;\n            grid-template-columns: repeat(3, 1fr);\n            gap: 10px;\n            margin-top: 20px;\n            padding-top: 18px;\n            border-top: 1px solid var(--ln);\n        }\n\n        .meta-item {\n            text-align: center;\n            background: rgba(255, 255, 255, 0.025);\n            padding: 10px 6px;\n            border-radius: 12px;\n            border: 1px solid var(--ln);\n        }\n\n        .meta-label {\n            font-family: var(--mono);\n            font-size: 8px;\n            font-weight: 700;\n            color: var(--dm);\n            letter-spacing: 0.16em;\n            text-transform: uppercase;\n            margin-bottom: 3px;\n        }\n\n        .meta-val {\n            font-family: var(--mono);\n            font-size: 13px;\n            font-weight: 800;\n            color: var(--tx);\n        }\n\n        .meta-val.hi {\n            color: var(--a1);\n        }\n\n        /* Multi-Model Consensus Matrix */\n        .models-matrix {\n            margin-top: 14px;\n            padding: 12px;\n            background: rgba(255, 255, 255, 0.025);\n            border: 1px solid var(--ln);\n            border-radius: 14px;\n        }\n\n        .matrix-head {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            font-size: 10px;\n            font-weight: 800;\n            letter-spacing: 0.1em;\n            text-transform: uppercase;\n            color: var(--mu);\n            margin-bottom: 8px;\n        }\n\n        .matrix-status {\n            font-family: var(--mono);\n            font-size: 9px;\n            font-weight: 700;\n            color: var(--win);\n            display: flex;\n            align-items: center;\n            gap: 5px;\n        }\n\n        .matrix-status::before {\n            content: '';\n            width: 5px;\n            height: 5px;\n            border-radius: 50%;\n            background: var(--win);\n            box-shadow: 0 0 8px var(--win);\n        }\n\n        .matrix-grid {\n            display: grid;\n            grid-template-columns: repeat(6, 1fr);\n            gap: 5px;\n        }\n\n        .matrix-pill {\n            padding: 5px 2px;\n            border-radius: 6px;\n            font-family: var(--mono);\n            font-size: 9px;\n            font-weight: 800;\n            text-align: center;\n            background: rgba(255, 255, 255, 0.04);\n            border: 1px solid var(--ln);\n            color: var(--tx);\n            transition: all 0.2s ease;\n        }\n\n        .matrix-pill.big {\n            color: var(--a1);\n            border-color: rgba(228, 255, 74, 0.35);\n            background: rgba(228, 255, 74, 0.08);\n        }\n\n        .matrix-pill.small {\n            color: var(--a2);\n            border-color: rgba(0, 229, 255, 0.35);\n            background: rgba(0, 229, 255, 0.08);\n        }\n\n        .matrix-pill.span2 {\n            grid-column: span 2;\n        }\n\n        /* Quick Action Bar */\n        .actions-bar {\n            display: grid;\n            grid-template-columns: repeat(3, 1fr);\n            gap: 10px;\n        }\n\n        .action-btn {\n            background: var(--card-bg);\n            border: 1px solid var(--ln);\n            padding: 12px 10px;\n            border-radius: 14px;\n            color: var(--mu);\n            font-family: var(--mono);\n            font-size: 9.5px;\n            font-weight: 800;\n            letter-spacing: 0.14em;\n            text-transform: uppercase;\n            cursor: pointer;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            gap: 7px;\n            transition: all 0.2s ease;\n        }\n\n        .action-btn:hover {\n            border-color: var(--a1);\n            color: var(--tx);\n            transform: translateY(-2px);\n        }\n\n        /* Stats Row */\n        .stats-banner {\n            background: var(--card-bg);\n            border: 1px solid var(--ln);\n            border-radius: 18px;\n            padding: 14px 18px;\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n        }\n\n        .stats-item {\n            text-align: center;\n        }\n\n        .stats-val {\n            font-family: var(--mono);\n            font-size: 18px;\n            font-weight: 800;\n        }\n\n        .stats-lbl {\n            font-family: var(--mono);\n            font-size: 7.5px;\n            font-weight: 700;\n            letter-spacing: 0.16em;\n            color: var(--dm);\n            text-transform: uppercase;\n            margin-top: 2px;\n        }\n\n        /* History Table */\n        .history-card {\n            background: var(--card-bg);\n            border: 1px solid var(--ln);\n            border-radius: 20px;\n            padding: 18px 16px;\n        }\n\n        .history-head {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin-bottom: 12px;\n            padding-bottom: 10px;\n            border-bottom: 1px solid var(--ln);\n        }\n\n        .history-title {\n            font-size: 13px;\n            font-weight: 800;\n            letter-spacing: 0.05em;\n            text-transform: uppercase;\n            display: flex;\n            align-items: center;\n            gap: 7px;\n        }\n\n        .history-clear-btn {\n            background: transparent;\n            border: 1px solid var(--ln);\n            padding: 4px 10px;\n            border-radius: 6px;\n            font-family: var(--mono);\n            font-size: 9px;\n            color: var(--dm);\n            cursor: pointer;\n            transition: all 0.2s;\n        }\n\n        .history-clear-btn:hover {\n            color: var(--tx);\n            border-color: var(--mu);\n        }\n\n        .history-list {\n            display: flex;\n            flex-direction: column;\n            gap: 8px;\n            max-height: 480px;\n            overflow-y: auto;\n            padding-right: 4px;\n        }\n\n        .history-list::-webkit-scrollbar {\n            width: 4px;\n        }\n\n        .history-list::-webkit-scrollbar-thumb {\n            background: rgba(255, 255, 255, 0.1);\n            border-radius: 4px;\n        }\n\n        .history-row {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            padding: 10px 12px;\n            background: rgba(255, 255, 255, 0.025);\n            border: 1px solid var(--ln);\n            border-radius: 12px;\n            transition: transform 0.2s;\n        }\n\n        .history-row.win {\n            border-left: 3px solid var(--win);\n        }\n\n        .history-row.loss {\n            border-left: 3px solid var(--loss);\n        }\n\n        .history-row.skip {\n            border-left: 3px solid var(--a4);\n            background: rgba(255, 176, 32, 0.05);\n        }\n\n        .h-period {\n            font-family: var(--mono);\n            font-size: 11.5px;\n            font-weight: 700;\n            color: var(--tx);\n        }\n\n        .h-sub {\n            font-family: var(--mono);\n            font-size: 9px;\n            color: var(--dm);\n            margin-top: 2px;\n        }\n\n        .h-center {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n            font-family: var(--mono);\n            font-size: 11px;\n            font-weight: 700;\n        }\n\n        .h-call {\n            padding: 2px 7px;\n            border-radius: 6px;\n            font-size: 10px;\n            background: rgba(255, 255, 255, 0.06);\n        }\n\n        .h-call.big { color: var(--a1); border: 1px solid rgba(228, 255, 74, 0.3); }\n        .h-call.small { color: var(--a2); border: 1px solid rgba(0, 217, 255, 0.3); }\n        .h-call.skip { color: var(--a4); border: 1px solid rgba(255, 176, 32, 0.4); }\n\n        .h-actual {\n            color: var(--mu);\n        }\n\n        .h-badge {\n            font-family: var(--mono);\n            font-size: 10px;\n            font-weight: 800;\n            padding: 4px 10px;\n            border-radius: 8px;\n            letter-spacing: 0.08em;\n            text-transform: uppercase;\n        }\n\n        .h-badge.win {\n            background: rgba(16, 185, 129, 0.16);\n            color: var(--win);\n            border: 1px solid rgba(16, 185, 129, 0.4);\n        }\n\n        .h-badge.loss {\n            background: rgba(255, 59, 92, 0.16);\n            color: var(--loss);\n            border: 1px solid rgba(255, 59, 92, 0.4);\n        }\n\n        .h-badge.skip {\n            background: rgba(255, 176, 32, 0.16);\n            color: var(--a4);\n            border: 1px solid rgba(255, 176, 32, 0.45);\n        }\n\n        /* Result Popup Banner */\n        .toast-banner {\n            position: fixed;\n            top: 20px;\n            left: 50%;\n            transform: translateX(-50%) translateY(-100px);\n            opacity: 0;\n            pointer-events: none;\n            z-index: 9999;\n            background: var(--ink2);\n            border: 1px solid var(--ln);\n            padding: 12px 22px;\n            border-radius: 16px;\n            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7);\n            font-family: var(--mono);\n            font-size: 12px;\n            font-weight: 800;\n            letter-spacing: 0.1em;\n            display: flex;\n            align-items: center;\n            gap: 10px;\n            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);\n        }\n\n        .toast-banner.show {\n            transform: translateX(-50%) translateY(0);\n            opacity: 1;\n        }\n\n        .toast-banner.win {\n            border-color: var(--win);\n            color: var(--win);\n            box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);\n        }\n\n        .toast-banner.loss {\n            border-color: var(--loss);\n            color: var(--loss);\n            box-shadow: 0 10px 40px rgba(255, 59, 92, 0.3);\n        }\n\n        .empty-history {\n            text-align: center;\n            padding: 36px 14px;\n            color: var(--dm);\n            font-size: 11px;\n            font-family: var(--mono);\n            letter-spacing: 0.08em;\n        }\n\n        /* Footer Credit */\n        footer {\n            text-align: center;\n            margin-top: 10px;\n            font-family: var(--mono);\n            font-size: 9px;\n            color: var(--dm);\n            letter-spacing: 0.2em;\n            text-transform: uppercase;\n        }\n\n        footer span {\n            color: var(--a1);\n        }\n    </style>\n</head>\n<body>\n\n    <div class=\"bg-grid\"></div>\n\n    <!-- Floating Result Notification -->\n    <div id=\"toast\" class=\"toast-banner\">\n        <span id=\"toast-icon\">🎯</span>\n        <span id=\"toast-msg\">SIGNAL HIT</span>\n    </div>\n\n    <div class=\"container\">\n\n        <!-- Top Navigation -->\n        <header>\n            <div class=\"brand\">\n                <div class=\"brand-icon\">⚡</div>\n                <div>\n                    <div class=\"brand-title\">JASHVIP <span class=\"vip-chip\">ULTIMATE</span></div>\n                    <div class=\"brand-sub\">Master Multi-Model Ensemble</div>\n                </div>\n            </div>\n            <div class=\"header-actions\">\n                <span class=\"status-dot\">LIVE</span>\n                <button class=\"icon-btn\" id=\"soundToggleBtn\" onclick=\"toggleSound()\" title=\"Toggle Sound\">🔊</button>\n                <button class=\"icon-btn\" onclick=\"manualRefresh()\" title=\"Refresh API\">🔄</button>\n            </div>\n        </header>\n\n        <!-- Mode Selector -->\n        <div class=\"mode-tabs\">\n            <button class=\"mode-tab active\" id=\"tab-1m\" onclick=\"switchMode('1M')\">\n                <span>⏱️</span> WinGo 1 Min\n            </button>\n            <button class=\"mode-tab\" id=\"tab-30s\" onclick=\"switchMode('30S')\">\n                <span>⚡</span> WinGo 30 Sec\n            </button>\n        </div>\n\n        <!-- Main Hero Prediction Card -->\n        <main class=\"card\">\n            <div class=\"hero-top\">\n                <div class=\"period-info\">\n                    <span class=\"period-num\" id=\"periodDisplay\">#LOADING...</span>\n                    <span class=\"copy-pill\" onclick=\"copyPeriod()\">COPY</span>\n                </div>\n                <div class=\"timer-badge\" id=\"timerBadge\">\n                    <span>⏱️</span>\n                    <span id=\"timerVal\">--:--</span>\n                </div>\n            </div>\n\n            <!-- Stage Level Guard Badge -->\n            <div class=\"level-guard-row\">\n                <div class=\"level-pill lvl1\" id=\"levelPill\">🎯 STAGE: LEVEL 1 (1X - BASE)</div>\n            </div>\n\n            <!-- Central Big/Small Prediction Display -->\n            <div class=\"prediction-box\">\n                <div class=\"pred-label\">PRIMARY DIRECTION CALL</div>\n                <div class=\"pred-display loading\" id=\"predDisplay\">ANALYZING...</div>\n                <div>\n                    <span class=\"pattern-banner consensus\" id=\"patternBanner\">\n                        🛡️ ENSEMBLE ENGINE INITIALIZING\n                    </span>\n                </div>\n            </div>\n\n            <!-- Metadata Metrics -->\n            <div class=\"meta-grid\">\n                <div class=\"meta-item\">\n                    <div class=\"meta-label\">Last Draw</div>\n                    <div class=\"meta-val\" id=\"lastNumVal\">--</div>\n                </div>\n                <div class=\"meta-item\">\n                    <div class=\"meta-label\">Confidence</div>\n                    <div class=\"meta-val hi\" id=\"confidenceVal\">--%</div>\n                </div>\n                <div class=\"meta-item\">\n                    <div class=\"meta-label\">Recovery Guard</div>\n                    <div class=\"meta-val\" id=\"levelGuardVal\" style=\"color: var(--win);\">SAFE (L1)</div>\n                </div>\n            </div>\n\n            <!-- Multi-Model Consensus Matrix (Titan + Radhe + Suresh + TGX + Markov + Nexa + Pain) -->\n            <div class=\"models-matrix\">\n                <div class=\"matrix-head\">\n                    <span>⚡ MULTI-MODEL CONSENSUS</span>\n                    <span class=\"matrix-status\">SYNCHRONIZED</span>\n                </div>\n                <div class=\"matrix-grid\">\n                    <div class=\"matrix-pill\" id=\"mPillL1\">L1: --</div>\n                    <div class=\"matrix-pill\" id=\"mPillL2\">L2: --</div>\n                    <div class=\"matrix-pill\" id=\"mPillL3\">L3: --</div>\n                    <div class=\"matrix-pill\" id=\"mPillL4\">L4: --</div>\n                    <div class=\"matrix-pill\" id=\"mPillL5\">L5: --</div>\n                    <div class=\"matrix-pill\" id=\"mPillL6\">L6: --</div>\n                    <div class=\"matrix-pill span2\" id=\"mPillTsx\">TSX: STRUCT</div>\n                    <div class=\"matrix-pill span2\" id=\"mPillTitan\">TITAN: --</div>\n                    <div class=\"matrix-pill span2\" id=\"mPillRadhe\">RADHE: --</div>\n                    <div class=\"matrix-pill span2\" id=\"mPillSuresh\">SURESH: --</div>\n                    <div class=\"matrix-pill span2\" id=\"mPillMarkov\">MARKOV: --</div>\n                    <div class=\"matrix-pill span2\" id=\"mPillMaster\">MIND: --</div>\n                    <div class=\"matrix-pill span2\" id=\"mPillOblivion\">OBLIV: --</div>\n                    <div class=\"matrix-pill span2\" id=\"mPillPain\">PAIN: --</div>\n                    <div class=\"matrix-pill span2\" id=\"mPillNexa\">NEXA: 15R</div>\n                </div>\n            </div>\n        </main>\n\n        <!-- Quick Actions Bar -->\n        <div class=\"actions-bar\">\n            <button class=\"action-btn\" onclick=\"copyFullSignal()\">\n                <span>📋</span> Copy Signal\n            </button>\n            <button class=\"action-btn\" onclick=\"manualRefresh()\">\n                <span>⚡</span> Re-Analyze\n            </button>\n            <button class=\"action-btn\" onclick=\"toggleSound()\">\n                <span id=\"soundActionIcon\">🔊</span> Audio Alert\n            </button>\n        </div>\n\n        <!-- Win/Loss Stats Overview -->\n        <section class=\"stats-banner\">\n            <div class=\"stats-item\">\n                <div class=\"stats-val\" id=\"statTotalRounds\" style=\"color: var(--tx);\">0</div>\n                <div class=\"stats-lbl\">Total Rounds</div>\n            </div>\n            <div class=\"stats-item\">\n                <div class=\"stats-val\" id=\"statWins\" style=\"color: var(--win);\">0</div>\n                <div class=\"stats-lbl\">Wins</div>\n            </div>\n            <div class=\"stats-item\">\n                <div class=\"stats-val\" id=\"statLosses\" style=\"color: var(--loss);\">0</div>\n                <div class=\"stats-lbl\">Losses</div>\n            </div>\n            <div class=\"stats-item\">\n                <div class=\"stats-val\" id=\"statWinRate\" style=\"color: var(--a1);\">0%</div>\n                <div class=\"stats-lbl\">Win Rate</div>\n            </div>\n        </section>\n\n        <!-- Activity History Log -->\n        <section class=\"history-card\">\n            <div class=\"history-head\">\n                <div class=\"history-title\">\n                    <span>📈</span> Verified Activity Log\n                </div>\n                <button class=\"history-clear-btn\" onclick=\"clearHistoryRecords()\">Clear</button>\n            </div>\n            <div class=\"history-list\" id=\"historyList\">\n                <div class=\"empty-history\">Connecting to live feed... Completed rounds will appear here.</div>\n            </div>\n        </section>\n\n        <footer>\n            ULTIMATE ENSEMBLE ENGINE • TSX STRUCTURAL x APEX TITAN x MASTERMIND x RADHE x SURESH • <span>JASHVIP</span>\n        </footer>\n\n    </div>\n\n    <script>\n        /* =========================================================\n           JASHVIP ULTIMATE MASTER ENSEMBLE ENGINE\n           Synthesizes ALL proven engines:\n           1. Ronin Win Micro-Pattern Hash + 2-Gram Transitions\n           2. TGX Owner Official 6-Logic Consensus Matrix\n           3. Paid Pro Weighted Recency Momentum\n           4. Nexa Pro Entropy & 15-Round Mean Reversion Filter\n           5. Strict Under 3-Level Auto Reset Guard\n           ========================================================= */\n\n        const API_ENDPOINTS = {\n            '1M': 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',\n            '30S': 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json'\n        };\n\n        let currentMode = '1M';\n        let soundEnabled = true;\n        let lastResolvedIssue = null;\n        let currentPrediction = null;\n        let historyLogs = [];\n        let timerInterval = null;\n        let pollInterval = null;\n        let currentLevel = 1;\n\n        // Elements\n        const periodDisplay = document.getElementById('periodDisplay');\n        const timerVal = document.getElementById('timerVal');\n        const timerBadge = document.getElementById('timerBadge');\n        const predDisplay = document.getElementById('predDisplay');\n        const patternBanner = document.getElementById('patternBanner');\n        const lastNumVal = document.getElementById('lastNumVal');\n        const confidenceVal = document.getElementById('confidenceVal');\n        const levelGuardVal = document.getElementById('levelGuardVal');\n        const levelPill = document.getElementById('levelPill');\n        const historyList = document.getElementById('historyList');\n        const statTotalRounds = document.getElementById('statTotalRounds');\n        const statWins = document.getElementById('statWins');\n        const statLosses = document.getElementById('statLosses');\n        const statWinRate = document.getElementById('statWinRate');\n        const soundToggleBtn = document.getElementById('soundToggleBtn');\n        const soundActionIcon = document.getElementById('soundActionIcon');\n\n        // Helper: Convert number to category (0-4: SMALL, 5-9: BIG)\n        function getSize(number) {\n            return parseInt(number, 10) >= 5 ? 'BIG' : 'SMALL';\n        }\n        function opp(size) {\n            return size === 'BIG' ? 'SMALL' : 'BIG';\n        }\n\n        function getRuns(sizes) {\n            const runs = [];\n            if (!sizes.length) return runs;\n            let cur = sizes[0], len = 1;\n            for (let i = 1; i < sizes.length; i++) {\n                if (sizes[i] === cur) len++;\n                else {\n                    runs.push({ size: cur, len });\n                    cur = sizes[i];\n                    len = 1;\n                }\n            }\n            runs.push({ size: cur, len });\n            return runs;\n        }\n\n        /* ---------------------------------------------------------\n           1. APEX TITAN V100 CADENCE ENGINE (JASH AUTOBET)\n           --------------------------------------------------------- */\n        function apexTitanEngine(sizes, lossStreak) {\n            const runs = getRuns(sizes);\n            const cRun = runs[runs.length - 1];\n            const cSide = cRun.size;\n            const cLen = cRun.len;\n            const pRun = runs.length >= 2 ? runs[runs.length - 2] : { size: opp(cSide), len: 0 };\n            const lastS = sizes[sizes.length - 1];\n\n            let alt = 0;\n            for (let i = runs.length - 1; i >= 0; i--) {\n                if (runs[i].len === 1) alt++;\n                else break;\n            }\n\n            if (lossStreak >= 2) {\n                if (cLen >= 4) return { vote: cSide, reg: '🛑 L3 DRAGON EXT' };\n                if (cLen === 3) return { vote: opp(cSide), reg: '🛑 L3 DRAGON CUT' };\n                if (cLen === 2) return { vote: opp(cSide), reg: '🛑 L3 DOUBLET CUT' };\n                if (alt >= 3) return { vote: opp(lastS), reg: '🛑 L3 CHOP OSC' };\n                return { vote: cSide, reg: '🛑 L3 MOMENTUM LOCK' };\n            } else if (lossStreak === 1) {\n                if (cLen >= 3) return { vote: cSide, reg: '🛡️ L2 DRAGON RIDE' }; // Key fix: never fight a 3-streak at L2!\n                if (cLen === 2) return { vote: cSide, reg: '🛡️ L2 DOUBLET RIDE' };\n                if (alt >= 2) return { vote: opp(lastS), reg: '🛡️ L2 CHOP FLIP' };\n                return { vote: cSide, reg: '🛡️ L2 MOMENTUM LOCK' };\n            } else {\n                if (cLen >= 4) return { vote: cSide, reg: '🌊 L1 DRAGON EXT' };\n                if (cLen === 3) return { vote: opp(cSide), reg: '🐉 L1 DRAGON CUT' };\n                if (cLen === 2) return { vote: opp(cSide), reg: '🌊 L1 DOUBLET CUT' };\n                if (alt >= 3) return { vote: opp(lastS), reg: '⚡ L1 CHOP OSC' };\n                if (cLen === 1) return { vote: opp(cSide), reg: '🌊 L1 SINGLE CUT' };\n                return { vote: cSide, reg: '🌊 L1 MOMENTUM' };\n            }\n        }\n\n        /* ---------------------------------------------------------\n           2. RADHE HACK 2-3 LEVEL FIX (WEIGHTED RECENCY & 4-FLIP)\n           --------------------------------------------------------- */\n        function radheEngine(list) {\n            let sizes = list.slice(0, 12).map(item => getSize(item.number));\n            let consecutiveCount = 1;\n            for (let i = 1; i < sizes.length; i++) {\n                if (sizes[i] === sizes[0]) consecutiveCount++; else break;\n            }\n            if (consecutiveCount >= 4) return sizes[0]; \n            let isAlternating = true;\n            for (let i = 0; i < 4; i++) {\n                if (sizes[i] === sizes[i + 1]) { isAlternating = false; break; }\n            }\n            if (isAlternating) return sizes[0] === 'BIG' ? 'SMALL' : 'BIG';\n            let weightSum = 0;\n            for (let i = 0; i < Math.min(list.length, 6); i++) {\n                let num = parseInt(list[i].number, 10);\n                let pWeight = (6 - i) * 3;\n                weightSum += (num >= 5) ? pWeight : -pWeight;\n            }\n            return weightSum >= 0 ? 'BIG' : 'SMALL';\n        }\n\n        /* ---------------------------------------------------------\n           3. SURESH VIP SUPREME V15 (ANTI-STREAK 10-ROUND RECENCY)\n           --------------------------------------------------------- */\n        function sureshEngine(list) {\n            let bigs = 0, smalls = 0;\n            for (let i = 0; i < Math.min(10, list.length); i++) {\n                const num = parseInt(list[i].number, 10);\n                const weight = (10 - i);\n                if (num >= 5) bigs += weight; else smalls += weight;\n            }\n            const last3 = list.slice(0, 3).map(x => getSize(x.number));\n            if (last3[0] === last3[1] && last3[1] === last3[2]) {\n                return last3[0] === 'BIG' ? 'SMALL' : 'BIG';\n            }\n            return bigs >= smalls ? 'BIG' : 'SMALL';\n        }\n\n        /* ---------------------------------------------------------\n           4. QUANTUM MARKOV 2-GRAM PATTERN MATCHING\n           --------------------------------------------------------- */\n        function markovEngine(sizes) {\n            if (sizes.length < 5) return sizes[0];\n            const s1 = sizes[1], s0 = sizes[0];\n            let nextB = 0, nextS = 0;\n            for (let i = 0; i < sizes.length - 2; i++) {\n                if (sizes[i + 1] === s1 && sizes[i] === s0) {\n                    if (sizes[i + 2] === 'BIG') nextB++; else nextS++;\n                }\n            }\n            if (nextB > nextS) return 'BIG';\n            if (nextS > nextB) return 'SMALL';\n            return s0;\n        }\n\n        /* ---------------------------------------------------------\n           5. TGX 6-LOGIC ENGINE LAYER\n           --------------------------------------------------------- */\n        function tgxLogic1(nums, sizes) {\n            const n1 = nums[0], n2 = nums[1] || nums[0];\n            const n9 = nums[8] || nums[nums.length - 1], n10 = nums[9] || nums[nums.length - 1];\n            let total = Math.abs((n1 - n2) + (n9 - n10)) % 10;\n            let bigs = 0;\n            for (let i = 0; i < Math.min(5, sizes.length); i++) if (sizes[i] === 'BIG') bigs++;\n            if (bigs >= 4) return total >= 4 ? 'BIG' : 'SMALL';\n            if (bigs <= 1) return total >= 6 ? 'BIG' : 'SMALL';\n            return total >= 5 ? 'BIG' : 'SMALL';\n        }\n\n        function tgxLogic2(nums) {\n            const w = [3, 2, 1, 1, 1];\n            let sum = 0;\n            for (let i = 0; i < Math.min(5, nums.length); i++) sum += nums[i] * w[i];\n            sum += nums[0] * 2;\n            return (sum % 10) >= 5 ? 'BIG' : 'SMALL';\n        }\n\n        function tgxLogic3(nums, sizes) {\n            let vol = 0;\n            for (let i = 0; i < Math.min(5, nums.length - 1); i++) vol += Math.abs(nums[i] - nums[i + 1]);\n            vol = vol / 5;\n            let streak = 1;\n            for (let i = 1; i < Math.min(5, sizes.length); i++) if (sizes[i] === sizes[0]) streak++; else break;\n            let streakScore = streak >= 3 ? -25 : (streak === 2 ? -15 : (vol > 3 ? 10 : 5));\n            let bigCnt = sizes.slice(0, 8).filter(x => x === 'BIG').length;\n            let imbalance = ((bigCnt - 4) / 8) * 100;\n            let pattern = (sizes[0] === sizes[1] && sizes[1] === sizes[2]) ? -35 : (sizes[0] === sizes[1] ? -20 : 25);\n            let total = (streakScore * 0.3) + (imbalance * 0.4) + (pattern * 0.3);\n            return total >= 0 ? 'BIG' : 'SMALL';\n        }\n\n        function tgxLogic4(sizes) {\n            let streak = 1;\n            for (let i = 1; i < sizes.length; i++) if (sizes[i] === sizes[0]) streak++; else break;\n            if (streak >= 3) return sizes[0] === 'BIG' ? 'SMALL' : 'BIG';\n            let changes = 0;\n            for (let i = 0; i < Math.min(5, sizes.length - 1); i++) if (sizes[i] !== sizes[i + 1]) changes++;\n            if (changes >= 3) return sizes[0] === 'BIG' ? 'SMALL' : 'BIG';\n            return sizes[0];\n        }\n\n        function tgxLogic5(nums) {\n            let ev = 0;\n            for (let i = 0; i < Math.min(6, nums.length); i++) if (nums[i] % 2 === 0) ev++;\n            return ev >= 3 ? 'BIG' : 'SMALL';\n        }\n\n        function tgxLogic6(sizes) {\n            if (sizes.length < 2) return sizes[0];\n            return sizes[0] === sizes[1] ? (sizes[0] === 'BIG' ? 'SMALL' : 'BIG') : sizes[0];\n        }\n\n        /* ---------------------------------------------------------\n           STRUCTURAL ZERO-LAG PATTERN ENGINE (REFINED GEOMETRIC HIERARCHY)\n           Prioritizes Dragons and 2B+2S Cycles over Triangles.\n           Eliminates fake 2-round guesses that cause whipsaw losses.\n           --------------------------------------------------------- */\n        function isArrMatch(arrA, arrB) {\n            if (!arrA || !arrB || arrA.length !== arrB.length) return false;\n            return arrA.every((v, i) => v === arrB[i]);\n        }\n\n        function checkZigzag(results) {\n            if (results.length < 3) return null;\n            let zigzagLen = 0;\n            for (let i = 0; i < Math.min(results.length - 1, 8); i++) {\n                if (results[i] !== results[i + 1]) zigzagLen++;\n                else break;\n            }\n            if (zigzagLen >= 3) {\n                const expected = results[0] === 'BIG' ? 'SMALL' : 'BIG';\n                return {\n                    size: expected,\n                    name: `⚡ ZIGZAG SWITCH (${zigzagLen}X)`,\n                    desc: `Alternating rhythm active. Opposite expected (${expected}).`,\n                    conf: Math.min(94, 72 + zigzagLen * 4)\n                };\n            }\n            return null;\n        }\n\n        function checkTriangle(results) {\n            if (results.length < 3) return null;\n            const last3 = results.slice(0, 3).reverse();\n\n            // Strict 3-Round Complete Geometric Triangle only:\n            // 1B + 2S Pattern complete -> reversal to BIG\n            if (isArrMatch(last3, [\"BIG\", \"SMALL\", \"SMALL\"])) {\n                return { size: \"BIG\", name: \"⚡ TRIANGLE COMPLETE (BSS)\", desc: \"1B+2S Complete. Reversal to BIG expected.\", conf: 82 };\n            }\n            // 1S + 2B Pattern complete -> reversal to SMALL\n            if (isArrMatch(last3, [\"SMALL\", \"BIG\", \"BIG\"])) {\n                return { size: \"SMALL\", name: \"⚡ TRIANGLE COMPLETE (SBB)\", desc: \"1S+2B Complete. Reversal to SMALL expected.\", conf: 82 };\n            }\n\n            return null;\n        }\n\n        function check4B4S(results, streak, lastResult) {\n            if (results.length < 4) return null;\n            const last9 = results.slice(0, 9).reverse();\n            const last8 = results.slice(0, 8).reverse();\n\n            // 4+ Breakouts (Dragon Ride) - Never fight a streak!\n            if (streak >= 4) {\n                return { size: lastResult, name: `⚡ DRAGON RIDE (${streak}${lastResult[0]})`, desc: `4+ ${lastResult}s in a row. Trend continuation ride.`, conf: 86 };\n            }\n\n            // Complete 4B + 4S Cycles\n            if (isArrMatch(last8, [\"BIG\",\"BIG\",\"BIG\",\"BIG\",\"SMALL\",\"SMALL\",\"SMALL\",\"SMALL\"])) {\n                return { size: \"BIG\", name: \"⚡ 4B+4S CYCLE COMPLETE\", desc: \"4B then 4S cycle finished. Full reversal to BIG.\", conf: 87 };\n            }\n            if (isArrMatch(last8, [\"SMALL\",\"SMALL\",\"SMALL\",\"SMALL\",\"BIG\",\"BIG\",\"BIG\",\"BIG\"])) {\n                return { size: \"SMALL\", name: \"⚡ 4S+4B CYCLE COMPLETE\", desc: \"4S then 4B cycle finished. Full reversal to SMALL.\", conf: 87 };\n            }\n\n            return null;\n        }\n\n        function check3B3S(results, streak, lastResult) {\n            if (results.length < 3) return null;\n            const last6 = results.slice(0, 6).reverse();\n            const last5 = results.slice(0, 5).reverse();\n\n            // Standard 3B + 3S Cycles\n            if (isArrMatch(last6, [\"BIG\",\"BIG\",\"BIG\",\"SMALL\",\"SMALL\",\"SMALL\"])) {\n                return { size: \"BIG\", name: \"⚡ 3B+3S CYCLE COMPLETE\", desc: \"3B then 3S complete. Reversal to BIG expected.\", conf: 84 };\n            }\n            if (isArrMatch(last6, [\"SMALL\",\"SMALL\",\"SMALL\",\"BIG\",\"BIG\",\"BIG\"])) {\n                return { size: \"SMALL\", name: \"⚡ 3S+3B CYCLE COMPLETE\", desc: \"3S then 3B complete. Reversal to SMALL expected.\", conf: 84 };\n            }\n\n            // Forming 3B + 2S / 3S + 2B\n            if (isArrMatch(last5, [\"BIG\",\"BIG\",\"BIG\",\"SMALL\",\"SMALL\"])) {\n                return { size: \"SMALL\", name: \"⚡ 3B+2S FORMING\", desc: \"Expecting 3rd SMALL to complete 3B+3S block.\", conf: 80 };\n            }\n            if (isArrMatch(last5, [\"SMALL\",\"SMALL\",\"SMALL\",\"BIG\",\"BIG\"])) {\n                return { size: \"BIG\", name: \"⚡ 3S+2B FORMING\", desc: \"Expecting 3rd BIG to complete 3S+3B block.\", conf: 80 };\n            }\n\n            return null;\n        }\n\n        function check2B2S(results, streak, lastResult) {\n            if (results.length < 3) return null;\n            const last4 = results.slice(0, 4).reverse();\n            const last3 = results.slice(0, 3).reverse();\n\n            if (isArrMatch(last4, [\"BIG\",\"BIG\",\"SMALL\",\"SMALL\"])) {\n                return { size: \"BIG\", name: \"⚡ 2B+2S CYCLE COMPLETE (BBSS)\", desc: \"2B+2S pattern complete. Reversal to BIG.\", conf: 85 };\n            }\n            if (isArrMatch(last4, [\"SMALL\",\"SMALL\",\"BIG\",\"BIG\"])) {\n                return { size: \"SMALL\", name: \"⚡ 2S+2B CYCLE COMPLETE (SSBB)\", desc: \"2S+2B pattern complete. Reversal to SMALL.\", conf: 85 };\n            }\n            if (isArrMatch(last3, [\"BIG\",\"BIG\",\"SMALL\"])) {\n                return { size: \"SMALL\", name: \"⚡ 2B+1S FORMING (BBS)\", desc: \"Expecting second SMALL to complete 2B+2S.\", conf: 82 };\n            }\n            if (isArrMatch(last3, [\"SMALL\",\"SMALL\",\"BIG\"])) {\n                return { size: \"BIG\", name: \"⚡ 2S+1B FORMING (SSB)\", desc: \"Expecting second BIG to complete 2S+2B.\", conf: 82 };\n            }\n\n            return null;\n        }\n\n        function evaluateStructural(sizes) {\n            if (!sizes || sizes.length < 3) return null;\n            const lastResult = sizes[0];\n            let streak = 1;\n            for (let i = 1; i < sizes.length; i++) {\n                if (sizes[i] === lastResult) streak++;\n                else break;\n            }\n\n            // Priority 1: Dragon Breakout (streak >= 4) - NEVER fight a dragon!\n            const p4 = check4B4S(sizes, streak, lastResult);\n            if (p4) return p4;\n\n            // Priority 2: 2B+2S Cycle (Strict BBSS / SSBB / BBS / SSB) - checked BEFORE triangle!\n            const p2 = check2B2S(sizes, streak, lastResult);\n            if (p2) return p2;\n\n            // Priority 3: 3B+3S Cycle\n            const p3 = check3B3S(sizes, streak, lastResult);\n            if (p3) return p3;\n\n            // Priority 4: Triangle (Strict 3-round BSS / SBB completion only)\n            const tri = checkTriangle(sizes);\n            if (tri) return tri;\n\n            // Priority 5: Zigzag alternation (streak >= 3)\n            const zz = checkZigzag(sizes);\n            if (zz) return zz;\n\n            return null;\n        }\n\n        /* ---------------------------------------------------------\n           MASTERMIND V8 MULTI-WINDOW EXPONENTIAL DECAY AI\n           --------------------------------------------------------- */\n        function mastermindEngine(nums) {\n            if (!nums || nums.length < 3) return 'BIG';\n            const last3 = nums.slice(0, 3);\n            const last5 = nums.slice(0, 5);\n            const last7 = nums.slice(0, Math.min(7, nums.length));\n            const last12 = nums.slice(0, Math.min(12, nums.length));\n\n            const sm3 = last3.filter(n => n <= 4).length;\n            const sm5 = last5.filter(n => n <= 4).length;\n            const sm7 = last7.filter(n => n <= 4).length;\n            const sm12 = last12.filter(n => n <= 4).length;\n\n            const sScore = (sm3 / 3) * 0.40 + (sm5 / 5) * 0.28 + (sm7 / 7) * 0.20 + (sm12 / 12) * 0.12;\n            const bScore = ((3 - sm3) / 3) * 0.40 + ((5 - sm5) / 5) * 0.28 + ((7 - sm7) / 7) * 0.20 + ((12 - sm12) / 12) * 0.12;\n\n            return bScore >= sScore ? 'BIG' : 'SMALL';\n        }\n\n        /* ---------------------------------------------------------\n           BMW OBLIVION VOLATILITY INDEX ENGINE\n           --------------------------------------------------------- */\n        function oblivionEngine(sizes, nums) {\n            if (!sizes || sizes.length < 4) return sizes[0];\n            let diffSum = 0;\n            for (let i = 0; i < Math.min(4, nums.length - 1); i++) {\n                diffSum += Math.abs(nums[i] - nums[i + 1]);\n            }\n            const avgDiff = diffSum / 4;\n            if (avgDiff > 4.5) {\n                return sizes[0] === 'BIG' ? 'SMALL' : 'BIG';\n            }\n            return sizes[0];\n        }\n\n        /* ---------------------------------------------------------\n           ULTIMATE MASTER MULTI-MODEL ENSEMBLE ENGINE\n           --------------------------------------------------------- */\n        function calculateCombinedPrediction(list) {\n            if (!list || list.length < 3) return null;\n\n            const sizes = list.slice(0, 15).map(item => getSize(item.number));\n            const nums = list.slice(0, 15).map(item => parseInt(item.number, 10));\n\n            // Streaks & Alternation\n            let alt = 1;\n            for (let i = 0; i < sizes.length - 1; i++) {\n                if (sizes[i] !== sizes[i + 1]) alt++;\n                else break;\n            }\n\n            let streak = 1;\n            for (let i = 0; i < sizes.length - 1; i++) {\n                if (sizes[i] === sizes[i + 1]) streak++;\n                else break;\n            }\n\n            // 🛑 STRICT CAPITAL LOCK: If currentLevel >= 3 (after 2 consecutive losses),\n            // HARD STOP-LOSS! Output SKIP! No user will bet into a runaway drawdown.\n            if (currentLevel >= 3) {\n                return {\n                    prediction: 'SKIP',\n                    patternType: 'skip',\n                    patternLabel: '🛑 CAPITAL LOCK: SKIP ROUND (L3 PROTECT - DO NOT BET)',\n                    confidence: 0,\n                    latestIssue: list[0].issueNumber,\n                    latestNumber: parseInt(list[0].number, 10),\n                    nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString(),\n                    models: {\n                        l1: 'SKIP', l2: 'SKIP', l3: 'SKIP', l4: 'SKIP', l5: 'SKIP', l6: 'SKIP',\n                        tsx: 'SKIP', titan: 'SKIP', mastermind: 'SKIP', radhe: 'SKIP',\n                        suresh: 'SKIP', markov: 'SKIP', oblivion: 'SKIP', painPro: 'SKIP', nexaVote: 'SKIP'\n                    }\n                };\n            }\n\n            const votes = { BIG: 0, SMALL: 0 };\n\n            // Layer 0: Zero-Lag Geometric Structural Engine (+2.5 weight)\n            const structural = evaluateStructural(sizes);\n            let tsxVote = 'NONE';\n            if (structural) {\n                votes[structural.size] += 2.5;\n                tsxVote = structural.size;\n            }\n\n            // Layer 1: Apex Titan Cadence Engine (Jash Autobet)\n            const titan = apexTitanEngine(sizes, Math.max(0, currentLevel - 1));\n            votes[titan.vote] += 2.5;\n\n            // Layer 2: Mastermind v8 Multi-Window AI\n            const mastermind = mastermindEngine(nums);\n            votes[mastermind] += 2.0;\n\n            // Layer 3: Radhe Hack 2-3 Level Fix\n            const radhe = radheEngine(list);\n            votes[radhe] += 1.8;\n\n            // Layer 4: Suresh VIP Supreme V15\n            const suresh = sureshEngine(list);\n            votes[suresh] += 1.8;\n\n            // Layer 5: Quantum Markov 2-Gram\n            const markov = markovEngine(sizes);\n            votes[markov] += 1.6;\n\n            // Layer 6: BMW Oblivion Volatility Index\n            const oblivion = oblivionEngine(sizes, nums);\n            votes[oblivion] += 1.4;\n\n            // Layer 7: TGX 6-Logic Ensemble\n            const l1 = tgxLogic1(nums, sizes); votes[l1] += 0.8;\n            const l2 = tgxLogic2(nums);        votes[l2] += 0.9;\n            const l3 = tgxLogic3(nums, sizes); votes[l3] += 0.8;\n            const l4 = tgxLogic4(sizes);       votes[l4] += 0.8;\n            const l5 = tgxLogic5(nums);        votes[l5] += 0.7;\n            const l6 = tgxLogic6(sizes);       votes[l6] += 0.8;\n\n            // Layer 8: The Paid Pro 3-Round Window\n            const painPro = sizes.slice(0, 3).filter(x => x === 'BIG').length > 1 ? 'BIG' : 'SMALL';\n            votes[painPro] += 1.0;\n\n            // Layer 9: Nexa Pro 15-Round Skew Reversion\n            const big15 = sizes.slice(0, 15).filter(x => x === 'BIG').length;\n            let nexaVote = 'BALANCED';\n            if (big15 >= 10) {\n                votes.SMALL += 1.2;\n                nexaVote = 'REV-S';\n            } else if (big15 <= 5) {\n                votes.BIG += 1.2;\n                nexaVote = 'REV-B';\n            }\n\n            // 🛑 CHOP ZONE FILTER: When alternation >= 4 and models are indecisive, SKIP!\n            if (alt >= 4 && Math.abs(votes.BIG - votes.SMALL) < 1.0) {\n                return {\n                    prediction: 'SKIP',\n                    patternType: 'skip',\n                    patternLabel: '🛑 CHOP ZONE: SKIP ROUND (WAIT FOR SOLID SIGNAL)',\n                    confidence: 50,\n                    latestIssue: list[0].issueNumber,\n                    latestNumber: parseInt(list[0].number, 10),\n                    nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString(),\n                    models: {\n                        l1, l2, l3, l4, l5, l6,\n                        tsx: tsxVote, titan: titan.vote, mastermind, radhe,\n                        suresh, markov, oblivion, painPro, nexaVote\n                    }\n                };\n            }\n\n            let patternType = 'consensus';\n            let patternLabel = structural ? structural.name : titan.reg;\n\n            if (structural) {\n                patternType = structural.name.includes('DRAGON') ? 'dragon' : (structural.name.includes('ZIGZAG') ? 'zigzag' : 'cycle');\n            } else if (streak >= 4) {\n                patternType = 'dragon';\n            } else if (alt >= 3) {\n                patternType = 'zigzag';\n            } else {\n                patternType = 'consensus';\n            }\n\n            const prediction = votes.BIG >= votes.SMALL ? 'BIG' : 'SMALL';\n            const totalScore = votes.BIG + votes.SMALL;\n            const baseConf = structural ? structural.conf : Math.round((Math.max(votes.BIG, votes.SMALL) / totalScore) * 100);\n            const confidence = Math.min(96, Math.max(78, baseConf));\n\n            return {\n                prediction,\n                patternType,\n                patternLabel,\n                confidence,\n                latestIssue: list[0].issueNumber,\n                latestNumber: parseInt(list[0].number, 10),\n                nextPeriod: (BigInt(list[0].issueNumber) + 1n).toString(),\n                models: {\n                    l1, l2, l3, l4, l5, l6,\n                    tsx: tsxVote,\n                    titan: titan.vote,\n                    mastermind,\n                    radhe,\n                    suresh,\n                    markov,\n                    oblivion,\n                    painPro,\n                    nexaVote\n                }\n            };\n        }\n\n        // Fetch WinGo History (Primary direct fetch + Cloudflare proxy fallback)\n        async function fetchHistory() {\n            const primaryUrl = API_ENDPOINTS[currentMode] + '?t=' + Date.now();\n            try {\n                const res = await fetch(primaryUrl);\n                if (res.ok) {\n                    const json = await res.json();\n                    if (json && json.data && json.data.list) return json.data.list;\n                }\n            } catch (err) {\n                // Primary fetch blocked (CORS or ISP), attempt fallback proxy\n            }\n\n            try {\n                const customProxy = localStorage.getItem('jashvip_cf_proxy');\n                const proxyUrl = customProxy \n                    ? `${customProxy.replace(/\\/$/, '')}/api/history?mode=${currentMode}&t=${Date.now()}`\n                    : `/api/history?mode=${currentMode}&t=${Date.now()}`;\n                const res = await fetch(proxyUrl);\n                if (res.ok) {\n                    const json = await res.json();\n                    if (json && json.data && json.data.list) return json.data.list;\n                }\n            } catch (proxyErr) {\n                console.error('Fetch error on primary and proxy:', proxyErr);\n            }\n            return null;\n        }\n\n        // Main Engine Execution Loop\n        async function runEngine() {\n            const list = await fetchHistory();\n            if (!list || list.length < 3) return;\n\n            const top = list[0];\n            const actualCategory = getSize(top.number);\n            const actualNum = parseInt(top.number, 10);\n\n            // Check if a previous round resolved\n            if (lastResolvedIssue !== top.issueNumber) {\n                if (currentPrediction && currentPrediction.nextPeriod === top.issueNumber) {\n                    if (currentPrediction.prediction === 'SKIP') {\n                        // Skip round resolved - no bet was placed, capital 100% protected!\n                        recordOutcome({\n                            period: top.issueNumber,\n                            predicted: 'SKIP',\n                            actualNum,\n                            actualCategory,\n                            patternLabel: currentPrediction.patternLabel,\n                            isWin: null,\n                            isSkip: true\n                        });\n                        flashToast(true, 'SKIP', actualCategory, actualNum);\n                    } else {\n                        const isWin = (currentPrediction.prediction === actualCategory);\n                        recordOutcome({\n                            period: top.issueNumber,\n                            predicted: currentPrediction.prediction,\n                            actualNum,\n                            actualCategory,\n                            patternLabel: currentPrediction.patternLabel,\n                            isWin,\n                            isSkip: false\n                        });\n                        flashToast(isWin, currentPrediction.prediction, actualCategory, actualNum);\n                        playChime(isWin);\n                    }\n                }\n\n                lastResolvedIssue = top.issueNumber;\n\n                // Compute new prediction\n                const result = calculateCombinedPrediction(list);\n                if (result) {\n                    currentPrediction = result;\n                    renderPrediction(result);\n                }\n            }\n        }\n\n        function updateMatrixPill(id, text, type) {\n            const el = document.getElementById(id);\n            if (!el) return;\n            el.textContent = text;\n            const isSpan = (id.includes('Tsx') || id.includes('Titan') || id.includes('Radhe') || id.includes('Suresh') || id.includes('Markov') || id.includes('Master') || id.includes('Oblivion') || id.includes('Pain') || id.includes('Nexa'));\n            el.className = 'matrix-pill' + (isSpan ? ' span2' : '') + (type === 'BIG' ? ' big' : (type === 'SMALL' ? ' small' : ''));\n        }\n\n        // Render Prediction on UI\n        function renderPrediction(data) {\n            periodDisplay.textContent = `#${data.nextPeriod}`;\n            lastNumVal.textContent = `${data.latestNumber} (${getSize(data.latestNumber)})`;\n            confidenceVal.textContent = data.confidence ? `${data.confidence}%` : '--%';\n\n            if (data.prediction === 'SKIP') {\n                predDisplay.textContent = '🛑 SKIP';\n                predDisplay.className = 'pred-display skip';\n            } else {\n                predDisplay.textContent = data.prediction;\n                predDisplay.className = `pred-display ${data.prediction.toLowerCase()}`;\n            }\n\n            patternBanner.textContent = data.patternLabel;\n            patternBanner.className = `pattern-banner ${data.patternType}`;\n\n            if (data.models) {\n                updateMatrixPill('mPillL1', `L1: ${data.models.l1}`, data.models.l1);\n                updateMatrixPill('mPillL2', `L2: ${data.models.l2}`, data.models.l2);\n                updateMatrixPill('mPillL3', `L3: ${data.models.l3}`, data.models.l3);\n                updateMatrixPill('mPillL4', `L4: ${data.models.l4}`, data.models.l4);\n                updateMatrixPill('mPillL5', `L5: ${data.models.l5}`, data.models.l5);\n                updateMatrixPill('mPillL6', `L6: ${data.models.l6}`, data.models.l6);\n                updateMatrixPill('mPillTsx', `TSX: ${data.models.tsx}`, data.models.tsx);\n                updateMatrixPill('mPillTitan', `TITAN: ${data.models.titan}`, data.models.titan);\n                updateMatrixPill('mPillRadhe', `RADHE: ${data.models.radhe}`, data.models.radhe);\n                updateMatrixPill('mPillSuresh', `SURESH: ${data.models.suresh}`, data.models.suresh);\n                updateMatrixPill('mPillMarkov', `MARKOV: ${data.models.markov}`, data.models.markov);\n                updateMatrixPill('mPillMaster', `MIND: ${data.models.mastermind}`, data.models.mastermind);\n                updateMatrixPill('mPillOblivion', `OBLIV: ${data.models.oblivion}`, data.models.oblivion);\n                updateMatrixPill('mPillPain', `PAIN: ${data.models.painPro}`, data.models.painPro);\n                updateMatrixPill('mPillNexa', `NEXA: ${data.models.nexaVote}`, data.models.nexaVote.includes('B') ? 'BIG' : (data.models.nexaVote.includes('S') ? 'SMALL' : ''));\n            }\n        }\n\n        function updateLevelUI() {\n            if (currentLevel === 1) {\n                levelPill.className = 'level-pill lvl1';\n                levelPill.textContent = '🎯 STAGE: LEVEL 1 (1X - BASE)';\n                levelGuardVal.textContent = 'SAFE (L1)';\n                levelGuardVal.style.color = 'var(--win)';\n            } else if (currentLevel === 2) {\n                levelPill.className = 'level-pill lvl2';\n                levelPill.textContent = '⚡ STAGE: LEVEL 2 (3X - RECOVERY)';\n                levelGuardVal.textContent = 'RECOVERY (L2)';\n                levelGuardVal.style.color = 'var(--a4)';\n            } else {\n                levelPill.className = 'level-pill skip';\n                levelPill.textContent = '🛑 CAPITAL LOCK: SKIP ROUND (DO NOT BET)';\n                levelGuardVal.textContent = 'LOCKED (SKIP)';\n                levelGuardVal.style.color = 'var(--loss)';\n            }\n        }\n\n        // Record round to history (unlimited session storage)\n        function recordOutcome(item) {\n            if (item.isSkip) {\n                currentLevel = 1; // HARD RESET BACK TO LEVEL 1 AFTER SKIP!\n            } else if (item.isWin) {\n                currentLevel = 1;\n            } else {\n                currentLevel++;\n                if (currentLevel > 2) {\n                    currentLevel = 3; // Enters Level 3 (Hard Skip on next prediction)\n                }\n            }\n            updateLevelUI();\n\n            historyLogs.unshift(item);\n            renderHistoryTable();\n            updateStats();\n        }\n\n        function renderHistoryTable() {\n            if (!historyLogs.length) {\n                historyList.innerHTML = '<div class=\"empty-history\">No rounds recorded yet.</div>';\n                return;\n            }\n\n            historyList.innerHTML = historyLogs.map(item => `\n                <div class=\"history-row ${item.isSkip ? 'skip' : (item.isWin ? 'win' : 'loss')}\">\n                    <div>\n                        <div class=\"h-period\">#${item.period.slice(-5)}</div>\n                        <div class=\"h-sub\">${item.patternLabel.split(' ')[0]} ${item.patternLabel.split(' ')[1] || ''}</div>\n                    </div>\n                    <div class=\"h-center\">\n                        <span class=\"h-call ${item.predicted.toLowerCase()}\">${item.predicted}</span>\n                        <span>➔</span>\n                        <span class=\"h-actual\">${item.actualCategory} (${item.actualNum})</span>\n                    </div>\n                    <div>\n                        <span class=\"h-badge ${item.isSkip ? 'skip' : (item.isWin ? 'win' : 'loss')}\">\n                            ${item.isSkip ? 'SKIPPED 🛡️' : (item.isWin ? 'WIN ✓' : 'LOSS ✕')}\n                        </span>\n                    </div>\n                </div>\n            `).join('');\n        }\n\n        function updateStats() {\n            const bets = historyLogs.filter(x => !x.isSkip);\n            const total = bets.length;\n            const wins = bets.filter(x => x.isWin).length;\n            const losses = total - wins;\n            const winRate = total ? Math.round((wins / total) * 100) : 0;\n\n            statTotalRounds.textContent = historyLogs.length;\n            statWins.textContent = wins;\n            statLosses.textContent = losses;\n            statWinRate.textContent = `${winRate}%`;\n        }\n\n        function clearHistoryRecords() {\n            historyLogs = [];\n            currentLevel = 1;\n            updateLevelUI();\n            renderHistoryTable();\n            updateStats();\n        }\n\n        // Live Clock Countdown\n        function startTimer() {\n            clearInterval(timerInterval);\n\n            timerInterval = setInterval(() => {\n                const now = new Date();\n                const sec = now.getSeconds();\n                const ms = now.getMilliseconds();\n\n                let remaining;\n                if (currentMode === '1M') {\n                    remaining = 60 - sec;\n                } else {\n                    remaining = 30 - (sec % 30);\n                }\n\n                if (remaining === 0) remaining = currentMode === '1M' ? 60 : 30;\n\n                const displaySec = String(remaining).padStart(2, '0');\n                timerVal.textContent = `00:${displaySec}`;\n\n                const isUrgent = remaining <= 5;\n                timerBadge.classList.toggle('urgent', isUrgent);\n\n                // Run fast engine refresh right when round ends\n                if (remaining === 1 && ms > 700) {\n                    setTimeout(runEngine, 600);\n                }\n            }, 250);\n        }\n\n        // Switch Game Mode\n        function switchMode(mode) {\n            if (currentMode === mode) return;\n            currentMode = mode;\n            document.getElementById('tab-1m').classList.toggle('active', mode === '1M');\n            document.getElementById('tab-30s').classList.toggle('active', mode === '30S');\n\n            lastResolvedIssue = null;\n            currentPrediction = null;\n            currentLevel = 1;\n            updateLevelUI();\n\n            predDisplay.textContent = 'ANALYZING...';\n            predDisplay.className = 'pred-display loading';\n            patternBanner.textContent = 'SWITCHING ENGINE...';\n\n            startTimer();\n            runEngine();\n        }\n\n        // Sound System\n        function playChime(isWin) {\n            if (!soundEnabled) return;\n            try {\n                const ctx = new (window.AudioContext || window.webkitAudioContext)();\n                const osc = ctx.createOscillator();\n                const gain = ctx.createGain();\n\n                osc.type = isWin ? 'triangle' : 'sine';\n                osc.frequency.setValueAtTime(isWin ? 880 : 280, ctx.currentTime);\n                if (isWin) {\n                    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);\n                } else {\n                    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);\n                }\n\n                gain.gain.setValueAtTime(0.12, ctx.currentTime);\n                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);\n\n                osc.connect(gain);\n                gain.connect(ctx.destination);\n                osc.start();\n                osc.stop(ctx.currentTime + 0.32);\n            } catch (e) {}\n        }\n\n        function toggleSound() {\n            soundEnabled = !soundEnabled;\n            soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';\n            soundActionIcon.textContent = soundEnabled ? '🔊' : '🔇';\n        }\n\n        // Floating Toast Notification\n        let toastTimeout;\n        function flashToast(isWin, predicted, actual, num) {\n            const toast = document.getElementById('toast');\n            const icon = document.getElementById('toast-icon');\n            const msg = document.getElementById('toast-msg');\n\n            clearTimeout(toastTimeout);\n            toast.className = `toast-banner ${isWin ? 'win' : 'loss'} show`;\n            icon.textContent = isWin ? '🎯' : '⚠️';\n            msg.textContent = isWin \n                ? `SIGNAL HIT! ${predicted} MATCHED (${actual} #${num})`\n                : `SIGNAL MISSED! Call ${predicted} • Actual: ${actual} (${num})`;\n\n            toastTimeout = setTimeout(() => {\n                toast.classList.remove('show');\n            }, 3000);\n        }\n\n        // Clipboard Actions\n        function copyPeriod() {\n            const text = currentPrediction ? currentPrediction.nextPeriod : '';\n            if (text) {\n                navigator.clipboard.writeText(text);\n                alert(`Period #${text} copied!`);\n            }\n        }\n\n        function copyFullSignal() {\n            if (!currentPrediction) return;\n            const text = `⚡ JASHVIP VIP SIGNAL\\n` +\n                         `🎯 Period: #${currentPrediction.nextPeriod}\\n` +\n                         `🔥 Prediction: ${currentPrediction.prediction}\\n` +\n                         `📊 Pattern: ${currentPrediction.patternLabel}\\n` +\n                         `💎 Confidence: ${currentPrediction.confidence}%\\n` +\n                         `🛡️ Stage: Level ${currentLevel}`;\n            navigator.clipboard.writeText(text);\n            alert('VIP Signal copied to clipboard!');\n        }\n\n        function manualRefresh() {\n            runEngine();\n        }\n\n        // Boot\n        updateLevelUI();\n        startTimer();\n        runEngine();\n        pollInterval = setInterval(runEngine, 2500);\n    </script>\n</body>\n</html>\n";

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
