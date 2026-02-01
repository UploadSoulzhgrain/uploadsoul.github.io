# Azure Avatar & MVP Channel Troubleshooting Guide

## 1. Azure Avatar Realtime API Restrictions
**Issue:** Connection fails or Avatar does not appear when using "Lisa" or other characters in Realtime (Interactive) mode.  
**Symptoms:** 
- `SpeechSDK.ResultReason.Canceled`
- WebSocket connection immediately closes.

**Root Cause:**
Not all Avatar styles work with the Realtime API. Specifically for the character **Lisa**:
- ❌ `graceful-sitting` (Batch Video ONLY)
- ❌ `technical-sitting` (Batch Video ONLY)
- ✅ `casual-sitting` (Supported in Realtime)

**Solution:**
Always configure the `AvatarConfig` with a supported style.
```javascript
// Correct configuration for Lisa in Realtime API
const avatarConfig = new SpeechSDK.AvatarConfig("Lisa", "casual-sitting");
```

## 2. Local Development Server
**Issue:** API calls to `/api/speech-token` or `/api/ice-servers` fail with 500 or 404 in local development.  
**Symptoms:** 
- Console errors: `Failed to load resource: the server responded with a status of 500`
- Logs showing "Azure credentials not configured" even if `.env` is correct (if simulator logic is failing) or purely 404/500 from proxy.

**Root Cause:**
The Vite frontend (`npm run dev`) only proxies requests. It does not run the backend logic. The `backend-simulator.js` must be running to handle these requests.

**Solution:**
1. Open a new terminal.
2. Run the simulator:
   ```bash
   npm run server
   # OR
   node backend-simulator.js
   ```
3. Ensure `npm run dev` is running in another terminal.

## 3. Deployment Notes
- This project is configured for static deployment (GitHub Pages).
- The `backend-simulator.js` is for **LOCAL DEVELOPMENT ONLY**.
- For production, these API endpoints must be implemented in a real backend (e.g., Vercel Functions, Azure Functions, or a separate Node.js server) because client-side calls cannot safely hold the Azure Secrets, and `backend-simulator` doesn't run on GitHub Pages.
