# UploadSoul Deployment Solution

## Dual Deployment Strategy

This project is configured for deployment to both GitHub Pages and Vercel, providing redundancy and ensuring users can access the application from either platform.

### GitHub Pages Deployment

The application is deployed to GitHub Pages through GitHub Actions, which automatically builds and deploys the application whenever changes are pushed to the main branch.

- **GitHub Pages URL**: https://uploadsoulzhgrain.github.io/uploadsoul.github.io
- **Custom Domain**: uploadsoul.com (when DNS is configured)

### Vercel Deployment

The application is also deployed to Vercel, which provides additional features like serverless functions and environment variables.

- **Vercel Preview URL**: Automatically generated for each push
- **Vercel Production URL**: Set up with custom domain when available

## Deployment Configuration Files

### Vercel Configuration

- **vercel.json**: Handles routing and build settings for Vercel
- **vercel-build.sh**: Custom build script to handle the build process on Vercel

### GitHub Actions

- **.github/workflows/dual-deploy.yml**: GitHub Action workflow for dual deployment

## Troubleshooting

### Common Issues and Solutions

1. **Build Failures**
   - Check the logs in GitHub Actions or Vercel for specific error messages
   - Ensure all dependencies are properly installed
   - Verify the Node.js version compatibility

2. **Routing Issues**
   - Ensure the SPA routing is properly configured in both GitHub Pages and Vercel
   - Check the vercel.json configuration for proper routing rules

3. **Environment Variable Issues**
   - Make sure all required environment variables are set in Vercel project settings
   - For local development, use .env.local (not committed to git)

### Testing Deployments

After deploying, test the following functionality:

1. Basic navigation through all pages
2. Digital Human creation and management
3. Digital Rebirth feature
4. User authentication if implemented
5. Any API integrations

## Manual Deployment

### To GitHub Pages

```bash
# Build the application
pnpm run build

# Deploy to gh-pages branch
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

### To Vercel

```bash
# Install Vercel CLI if not already installed
pnpm add -g vercel

# Login to Vercel (first time only)
vercel login

# Deploy to production
pnpm run deploy
# or
vercel --prod
```
