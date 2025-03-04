# MGX AI Digital Companion Platform - Deployment Guide

This guide provides detailed instructions for deploying the MGX AI Digital Companion Platform to three popular hosting services: Netlify, Vercel, and GitHub Pages. Each service offers different features and benefits, so choose the one that best suits your requirements.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Building the Application](#building-the-application)
- [Option 1: Deploying to Netlify](#option-1-deploying-to-netlify)
- [Option 2: Deploying to Vercel](#option-2-deploying-to-vercel)
- [Option 3: Deploying to GitHub Pages](#option-3-deploying-to-github-pages)
- [Custom Domain Setup](#custom-domain-setup)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have the following:

- A GitHub account (for all deployment options)
- The MGX AI Digital Companion Platform codebase in a GitHub repository
- Node.js version 18 or higher installed
- pnpm version 8 or higher installed

## Building the Application

The application is built using the following command:



```bash
pnpm run build
```

This creates a `dist` directory containing the compiled application ready for deployment.

## Option 1: Deploying to Netlify

Netlify offers a straightforward way to deploy React applications with continuous deployment from Git.

### Method 1: Netlify UI

1. Create a Netlify account at [netlify.com](https://www.netlify.com/) if you don't have one.
2. Click "New site from Git" on your Netlify dashboard.
3. Connect to your GitHub account and select your repository.
4. Configure the build settings:
   - Build command: `pnpm run build`
   - Publish directory: `dist`
5. (Optional) Add any required environment variables under "Site settings" > "Build & deploy" > "Environment".
6. Click "Deploy site".

### Method 2: Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Login to your Netlify account:
   ```bash
   netlify login
   ```
3. Navigate to your project directory and run:
   ```bash
   netlify init
   ```
4. Follow the prompts to configure your site.
5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

### Using the netlify.toml File

This repository includes a `netlify.toml` configuration file with optimized settings for the MGX AI Digital Companion Platform. It automatically configures:

- Build settings
- Cache headers for better performance
- Redirects for SPA routing

## Option 2: Deploying to Vercel

Vercel is optimized for frontend frameworks like React and provides an excellent developer experience.

### Method 1: Vercel UI

1. Create a Vercel account at [vercel.com](https://vercel.com/) if you don't have one.
2. Click "New Project" on your Vercel dashboard.
3. Import your GitHub repository.
4. The build settings should be automatically detected, but you can verify:
   - Framework Preset: Vite
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
5. (Optional) Add any required environment variables under "Environment Variables".
6. Click "Deploy".

### Method 2: Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Login to your Vercel account:
   ```bash
   vercel login
   ```
3. Navigate to your project directory and run:
   ```bash
   vercel
   ```
4. Follow the prompts to configure your deployment.
5. For production deployment, run:
   ```bash
   vercel --prod
   ```

### Using the vercel.json File

This repository includes a `vercel.json` configuration file with optimized settings for the MGX AI Digital Companion Platform. It automatically configures:

- Build settings
- Cache headers for better performance
- SPA routing

## Option 3: Deploying to GitHub Pages

GitHub Pages offers free hosting directly from your GitHub repository.

### Method 1: GitHub Actions (Recommended)

This repository includes a GitHub Actions workflow in `.github/workflows/deploy.yml` that automatically builds and deploys your application to GitHub Pages whenever you push to the main branch.

To use this method:

1. Go to your GitHub repository.
2. Click on "Settings".
3. Navigate to "Pages" in the sidebar.
4. Under "Source", select "GitHub Actions".
5. Push changes to your main branch, and the workflow will automatically deploy your site.

### Method 2: Manual Deployment

1. Build your application:
   ```bash
   pnpm run build
   ```
2. Install the `gh-pages` package:
   ```bash
   pnpm add -D gh-pages
   ```
3. Add these scripts to your package.json:
   ```json
   "scripts": {
     "predeploy": "pnpm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Deploy to GitHub Pages:
   ```bash
   pnpm run deploy
   ```

## Custom Domain Setup

### Netlify Custom Domain

1. Go to your site's dashboard in Netlify.
2. Navigate to "Site settings" > "Domain management".
3. Click "Add custom domain".
4. Follow the instructions to configure your DNS settings.

### Vercel Custom Domain

1. Go to your project dashboard in Vercel.
2. Navigate to "Settings" > "Domains".
3. Add your custom domain and follow the instructions to update DNS settings.

### GitHub Pages Custom Domain

1. Go to your repository on GitHub.
2. Navigate to "Settings" > "Pages".
3. Under "Custom domain", enter your domain name and click "Save".
4. Configure your DNS settings according to GitHub's instructions.
5. Create a file named `CNAME` in the `public` directory with your domain name.

## Environment Variables

For production deployments with sensitive configuration, use environment variables:

### Netlify Environment Variables

1. Go to your site's dashboard in Netlify.
2. Navigate to "Site settings" > "Build & deploy" > "Environment".
3. Add your environment variables.

### Vercel Environment Variables

1. Go to your project dashboard in Vercel.
2. Navigate to "Settings" > "Environment Variables".
3. Add your environment variables.

### GitHub Pages Environment Variables

GitHub Pages doesn't directly support environment variables. For public repositories, avoid including sensitive information. Instead:

1. Use a configuration file with public values.
2. For sensitive data, consider using a backend service or API gateway.

## Troubleshooting

### Common Issues

#### 1. Build Failures

- Ensure all dependencies are correctly installed
- Check for any TypeScript or ESLint errors
- Verify that your Node.js version is compatible

#### 2. Routing Issues

- Confirm that the deployment platform is configured for single-page application routing
- Check that the configuration files (netlify.toml, vercel.json) are present and correct

#### 3. API Connection Problems

- Verify that API endpoints are correctly configured for production
- Check CORS settings on your backend
- Ensure environment variables are correctly set

### Getting Help

If you encounter issues not covered in this guide:

1. Check the documentation for your deployment platform:
   - [Netlify Docs](https://docs.netlify.com/)
   - [Vercel Docs](https://vercel.com/docs)
   - [GitHub Pages Docs](https://docs.github.com/en/pages)
2. Submit an issue to the project repository
3. Contact the development team for support