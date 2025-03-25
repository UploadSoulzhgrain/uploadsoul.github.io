# UploadSoul Deployment Guide

## Prerequisites

1. GitHub account with access to the repository
2. Vercel account (sign up at https://vercel.com if you don't have one)
3. Node.js and pnpm installed on your local machine for testing

## Deployment Process

### Step 1: Push Changes to GitHub

All changes pushed to the `main` branch will trigger the automated deployment workflow:

```bash
# Add all changes
git add .

# Commit changes with a descriptive message
git commit -m "Your commit message"

# Push to the main branch
git push origin main
```

This will automatically trigger the dual deployment workflow defined in `.github/workflows/dual-deploy.yml`.

### Step 2: Verify GitHub Actions Workflow

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. You should see the "Dual Deployment (GitHub Pages & Vercel)" workflow running
4. Wait for it to complete (both jobs should show green checkmarks)

### Step 3: Check GitHub Pages Deployment

1. Go to your GitHub repository
2. Click on "Settings" > "Pages"
3. You should see that your site is published at https://uploadsoulzhgrain.github.io/uploadsoul.github.io
4. If you've configured a custom domain, it will be shown here

### Step 4: Verify Vercel Deployment

1. Log in to your Vercel account
2. Go to your project dashboard
3. Check the latest deployment status
4. Click on "Visit" to access the deployed site

## Setting up Custom Domains

### GitHub Pages Custom Domain

1. Go to your repository settings
2. Navigate to "Pages"
3. Under "Custom domain", enter your domain (e.g., `uploadsoul.com`)
4. Save
5. Configure your domain's DNS settings to point to GitHub Pages:
   - Add an A record pointing to the GitHub Pages IP addresses: 
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add a CNAME record for `www` pointing to `<username>.github.io`

### Vercel Custom Domain

1. Go to your Vercel project
2. Click on "Settings" > "Domains"
3. Add your domain
4. Follow the instructions provided by Vercel to configure your DNS settings

## Troubleshooting

### Common Issues

1. **Build failures**:
   - Check the build logs in GitHub Actions or Vercel
   - Ensure all dependencies are correctly specified in package.json

2. **Routing issues**:
   - Ensure the vercel.json file has the correct routes configuration
   - For GitHub Pages, make sure the 404.html redirect is working

3. **Custom domain not working**:
   - Verify DNS settings are correct and propagated (can take up to 48 hours)
   - Check that the CNAME file exists in the repository

4. **Environment variables**:
   - Make sure all necessary environment variables are set in Vercel
   
### Manual Deployment (if automation fails)

#### GitHub Pages Manual Deploy

```bash
# Build the project
pnpm run build

# Create CNAME file if needed
echo "uploadsoul.com" > dist/CNAME

# Deploy the dist folder to gh-pages branch
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

#### Vercel Manual Deploy

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod
```

## Verifying Successful Deployment

After deployment, test the following features:

1. General navigation across all pages
2. Digital Human creation functionality 
3. Digital Rebirth features
4. Responsive design on multiple devices
5. Any API integrations

If any issues are found, check the console logs for errors and review the deployment configuration.
