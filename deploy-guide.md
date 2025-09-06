# 🚀 How to Deploy Credo App to the Internet

## Option 1: Local Network Sharing (Same WiFi)

1. **Run the setup script:**
   ```bash
   start-network.bat
   ```

2. **Share these URLs with friends on same WiFi:**
   - Frontend: `http://192.168.1.150:5173`
   - Backend: `http://192.168.1.150:5000`

## Option 2: Deploy to Vercel (Free)

### Step 1: Prepare for Deployment
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

### Step 2: Deploy Backend
1. Go to backend folder:
   ```bash
   cd backend
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Copy the deployment URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update Frontend for Production
1. Update `src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-app.vercel.app/api'
   ```

2. Update `src/services/socket.ts`:
   ```typescript
   this.socket = io('https://your-app.vercel.app')
   ```

### Step 4: Deploy Frontend
1. Go back to root folder:
   ```bash
   cd ..
   ```

2. Deploy frontend:
   ```bash
   vercel --prod
   ```

3. Share the frontend URL with anyone!

## Option 3: Deploy to Netlify (Alternative)

1. Build the app:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist` folder
4. Update API URLs to point to your Vercel backend

## Option 4: Use ngrok for Quick Sharing

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Start your backend:
   ```bash
   cd backend && npm run dev
   ```

3. In another terminal, expose port 5000:
   ```bash
   ngrok http 5000
   ```

4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Update your frontend API URLs to use this ngrok URL
6. Share the frontend URL!

## 🎯 Quick Start (Recommended)

**For immediate sharing on same WiFi:**
1. Double-click `start-network.bat`
2. Share `http://192.168.1.150:5173` with friends

**For internet sharing:**
1. Deploy backend to Vercel
2. Deploy frontend to Vercel
3. Share the frontend URL globally!
