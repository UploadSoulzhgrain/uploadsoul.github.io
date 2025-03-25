# MGX AI Digital Companion Platform - Automated Deployment Instructions

This guide explains how to use the automated deployment scripts to deploy the MGX AI Digital Companion Platform frontend to Netlify, Vercel, or GitHub Pages.

## Prerequisites

Before using the deployment scripts, ensure you have:

- **Node.js** (version 18 or higher) installed
- **PNPM** (version 8 or higher) installed
- Git installed (for GitHub Pages deployment)
- A GitHub account (for all deployment options)
- Repository access with appropriate permissions

## Available Scripts

Two deployment scripts are provided:

1. `deploy.bat` - For Windows users
2. `deploy.sh` - For Linux/Mac users

## How to Use the Scripts

### Windows Users

1. Open Command Prompt or PowerShell
2. Navigate to the project directory
3. Run the deployment script:
   ```
   deploy.bat
   ```
4. Follow the on-screen prompts to select your deployment option

### Linux/Mac Users

1. Open Terminal
2. Navigate to the project directory
3. Make the script executable (first time only):
   ```
   chmod +x deploy.sh
   ```
4. Run the deployment script:
   ```
   ./deploy.sh
   ```
5. Follow the on-screen prompts to select your deployment option

## Deployment Options

The scripts provide three deployment options:

### 1. Deploy to Netlify

This option will:
- Install the Netlify CLI if not already installed
- Log you in to Netlify (if not already logged in)
- Build the application
- Deploy to Netlify (with options for new site or existing site)

Requirements:
- Netlify account
- Internet connection for CLI installation and deployment

### 2. Deploy to Vercel

This option will:
- Install the Vercel CLI if not already installed
- Log you in to Vercel (if not already logged in)
- Build the application
- Deploy to Vercel (with options for production or preview deployment)

Requirements:
- Vercel account
- Internet connection for CLI installation and deployment

### 3. Deploy to GitHub Pages

This option will:
- Check if the directory is a Git repository
- Install the gh-pages package if not already installed
- Add deployment scripts to package.json (if not already present)
- Build the application
- Deploy to the gh-pages branch of your repository

Requirements:
- Git repository with remote origin set
- GitHub account with appropriate repository permissions
- Internet connection for package installation and deployment

## Troubleshooting

### Common Issues

1. **Node.js or PNPM not installed**
   - The scripts will attempt to install PNPM automatically if not found
   - For Node.js, you'll need to install it manually from https://nodejs.org/

2. **Authentication failures with Netlify or Vercel**
   - Follow the interactive login prompts provided by the CLIs
   - If issues persist, try logging in manually using the respective CLI tools

3. **GitHub Pages deployment fails**
   - Ensure your repository has the correct remote origin set
   - Verify you have push access to the repository
   - Check that the gh-pages branch isn't protected

4. **Build failures**
   - Check the error messages for specific issues
   - Ensure all dependencies are correctly installed
   - Verify your code doesn't contain syntax errors

### Additional Help

For more detailed information about deployment options, refer to the `DEPLOYMENT.md` file in the project repository.

## Custom Configuration

The deployment scripts use the configuration files provided in the repository:
- `netlify.toml` for Netlify deployments
- `vercel.json` for Vercel deployments
- `.github/workflows/deploy.yml` for GitHub Actions deployments

If you need to modify these configurations, edit the respective files directly.

## Support

If you encounter any issues with the deployment scripts, please contact the development team for support.