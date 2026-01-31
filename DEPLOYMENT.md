# Deploying Educare to Vercel

This guide will walk you through deploying the Educare educational platform to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository (your code should be pushed to GitHub)
- API keys for the services you want to use:
  - **Gemini API Key** (recommended) - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
  - YouTube API Key (optional) - Get from [Google Cloud Console](https://console.cloud.google.com/)
  - OpenAI API Key (optional) - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended for First-Time Users)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Sign in with your GitHub account
   - Click "Import Project"
   - Select your Educare repository

3. **Configure the project**:
   - Project Name: `educare` (or your preferred name)
   - Framework Preset: `Other`
   - Root Directory: `./` (leave as default)
   - Build Command: Leave empty (static site with serverless functions)
   - Output Directory: `website`

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   - `GEMINI_API_KEY` = Your Gemini API key
   - `YOUTUBE_API_KEY` = Your YouTube API key (optional)
   - `GOOGLE_API_KEY` = Your Google API key (optional)
   - `OPENAI_API_KEY` = Your OpenAI API key (optional)
   - `NODE_ENV` = `production`

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)
   - You'll get a URL like `https://educare-xxx.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   cd C:\Users\Abhis\.gemini\antigravity\scratch\educare
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name? `educare` (or your preferred name)
   - In which directory is your code located? `./`

5. **Add environment variables**:
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add YOUTUBE_API_KEY
   vercel env add GOOGLE_API_KEY
   vercel env add OPENAI_API_KEY
   ```

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## Post-Deployment Configuration

### Setting Environment Variables (via Dashboard)

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (educare)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your API key
   - Environment: Production, Preview, Development (select all)
   - Click "Save"
5. Repeat for other API keys

### Redeploy After Adding Environment Variables

After adding environment variables, redeploy your application:
- **Via Dashboard**: Go to Deployments → Click "Redeploy" on the latest deployment
- **Via CLI**: Run `vercel --prod` again

## Verifying Your Deployment

1. **Visit your deployed URL**: Open the Vercel-provided URL in your browser
2. **Check homepage**: Verify the homepage loads correctly
3. **Test API endpoints**: 
   - Open browser console (F12)
   - Check if `window.ENV_CONFIG` is defined
   - Test AI features (requires API keys)

### Health Check

Visit `https://your-app.vercel.app/api/health` to verify the API is running.

## Troubleshooting

### Issue: "API key not configured" error

**Solution**: Make sure you've added the required environment variables in Vercel dashboard and redeployed.

### Issue: 404 errors on page navigation

**Solution**: Vercel configuration should handle routing automatically. Check that `vercel.json` is present in your repository root.

### Issue: Function timeout errors

**Solution**: 
- Vercel Hobby plan has 10-second timeout limit
- Vercel Pro plan has 300-second timeout limit
- Consider upgrading if AI operations are timing out
- Optimize API calls to complete faster

### Issue: Static files not loading

**Solution**: 
- Verify `website` directory contains all static files
- Check browser console for 404 errors
- Ensure file paths are relative, not absolute

## Updating Your Deployment

### Option 1: Automatic Deployment (Recommended)

Vercel automatically deploys when you push to your main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Option 2: Manual Deployment

```bash
vercel --prod
```

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

## Monitoring and Logs

- **View logs**: Vercel Dashboard → Your Project → Deployments → Click deployment → View Function Logs
- **Analytics**: Available in Vercel Dashboard under Analytics tab
- **Performance**: Check Vercel Speed Insights for performance metrics

## Cost Considerations

- **Hobby Plan** (Free):
  - Unlimited deployments
  - 100 GB bandwidth/month
  - 10-second function timeout
  - Team collaboration limited

- **Pro Plan** ($20/month):
  - Everything in Hobby
  - 1 TB bandwidth/month
  - 300-second function timeout
  - Advanced analytics
  - Priority support

For most educational projects, the Hobby plan should be sufficient.

## Security Best Practices

1. **Never commit** `.env` file to Git (already in `.gitignore`)
2. **Use environment variables** for all API keys
3. **Rotate API keys** regularly
4. **Monitor usage** of your API keys to prevent abuse
5. **Set up rate limiting** if needed for public APIs

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Educare Issues**: Report on your GitHub repository

---

**Deployment Status**: Ready to deploy! 🚀
