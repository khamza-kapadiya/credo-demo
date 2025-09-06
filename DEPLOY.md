# 🚀 Deploy Credo to Vercel

## Method 1: Using Vercel Web Interface (Easiest)

### Step 1: Prepare Your Code
1. **Commit all changes to Git:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

### Step 2: Deploy via Vercel Website
1. **Go to:** [vercel.com](https://vercel.com)
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your Git repository**
5. **Configure settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Step 3: Environment Variables
Add these in Vercel dashboard:
- `NODE_ENV=production`

### Step 4: Deploy!
Click "Deploy" and wait for it to finish!

## Method 2: Using Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel --prod
```

## Method 3: GitHub Integration (Automatic)

1. **Push to GitHub**
2. **Connect GitHub to Vercel**
3. **Auto-deploy on every push!**

## 🎯 After Deployment

Your app will be available at:
- `https://your-app-name.vercel.app`

Share this URL with anyone in the world! 🌍

## 🔧 Troubleshooting

### If Backend Doesn't Work:
1. **Check Vercel Functions logs**
2. **Ensure `vercel.json` is correct**
3. **Verify API routes start with `/api/`**

### If Frontend Doesn't Work:
1. **Check build logs**
2. **Ensure `dist` folder exists**
3. **Verify environment variables**

## 🎉 Success!

Once deployed, your Credo app will be:
- ✅ **Accessible from anywhere**
- ✅ **Fast and reliable**
- ✅ **Auto-scaling**
- ✅ **Free to use**
