#!/bin/bash

# MGX AI Digital Companion Platform - Automated Deployment Script (Linux/Mac)
# This script automates the deployment process for the digital platform frontend
# to Netlify, Vercel, or GitHub Pages.

echo "==================================================="
echo "    MGX AI Digital Companion Platform Deployment"
echo "==================================================="
echo

# Check for Node.js installation
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in your PATH."
    echo "Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "[WARNING] Node.js version is below 18 (detected v$NODE_VERSION)."
    echo "Recommended version is 18 or higher."
    read -p "Do you want to continue anyway? (y/N): " CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for PNPM installation
if ! command -v pnpm &> /dev/null; then
    echo "[ERROR] PNPM is not installed or not in your PATH."
    echo "Installing PNPM globally..."
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install PNPM. Please install it manually:"
        echo "npm install -g pnpm"
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist or if user wants to refresh
if [ ! -d "node_modules" ]; then
    echo "Node modules not found. Installing dependencies..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies."
        exit 1
    fi
else
    read -p "Would you like to refresh dependencies? (y/N): " REFRESH_DEPS
    if [[ "$REFRESH_DEPS" =~ ^[Yy]$ ]]; then
        pnpm install
        if [ $? -ne 0 ]; then
            echo "[ERROR] Failed to refresh dependencies."
            exit 1
        fi
    fi
fi

# Build the application
echo
echo "Building the application..."
pnpm run build
if [ $? -ne 0 ]; then
    echo "[ERROR] Build failed. Please check the error messages above."
    exit 1
fi
echo "Build completed successfully!"

# Display deployment options
deployment_options() {
    echo
    echo "Please select a deployment option:"
    echo "1. Deploy to Netlify"
    echo "2. Deploy to Vercel"
    echo "3. Deploy to GitHub Pages"
    echo "4. Exit"
    echo

    read -p "Enter your choice (1-4): " DEPLOY_OPTION

    case $DEPLOY_OPTION in
        1) deploy_netlify ;;  
        2) deploy_vercel ;;
        3) deploy_github_pages ;;
        4) exit_script ;;
        *) echo "[ERROR] Invalid option. Please try again."; deployment_options ;;
    esac
}

# Deploy to Netlify
deploy_netlify() {
    echo
    echo "=== DEPLOYING TO NETLIFY ==="
    echo

    # Check for Netlify CLI
    if ! command -v netlify &> /dev/null; then
        echo "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
        if [ $? -ne 0 ]; then
            echo "[ERROR] Failed to install Netlify CLI."
            deployment_options
            return
        fi
    fi

    # Check if user is logged in to Netlify
    echo "Checking Netlify authentication..."
    netlify status &> /dev/null
    if [ $? -ne 0 ]; then
        echo "You need to log in to Netlify first."
        netlify login
        if [ $? -ne 0 ]; then
            echo "[ERROR] Failed to log in to Netlify."
            deployment_options
            return
        fi
    fi

    # Deploy to Netlify
    echo
    echo "Select deployment type:"
    echo "1. Create new site and deploy"
    echo "2. Deploy to existing site"
    echo
    read -p "Enter your choice (1-2): " NETLIFY_DEPLOY_TYPE

    if [ "$NETLIFY_DEPLOY_TYPE" = "1" ]; then
        echo "Creating new site and deploying..."
        netlify deploy --prod
    elif [ "$NETLIFY_DEPLOY_TYPE" = "2" ]; then
        echo "Deploying to existing site..."
        netlify deploy --prod
    else
        echo "[ERROR] Invalid option."
        deploy_netlify
        return
    fi

    if [ $? -ne 0 ]; then
        echo "[ERROR] Netlify deployment failed."
        deployment_options
    else
        echo "Netlify deployment completed!"
        exit_script
    fi
}

# Deploy to Vercel
deploy_vercel() {
    echo
    echo "=== DEPLOYING TO VERCEL ==="
    echo

    # Check for Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo "Vercel CLI not found. Installing..."
        npm install -g vercel
        if [ $? -ne 0 ]; then
            echo "[ERROR] Failed to install Vercel CLI."
            deployment_options
            return
        fi
    fi

    # Check if user is logged in to Vercel
    echo "Checking Vercel authentication..."
    vercel whoami &> /dev/null
    if [ $? -ne 0 ]; then
        echo "You need to log in to Vercel first."
        vercel login
        if [ $? -ne 0 ]; then
            echo "[ERROR] Failed to log in to Vercel."
            deployment_options
            return
        fi
    fi

    # Deploy to Vercel
    echo
    echo "Select deployment type:"
    echo "1. Deploy to production"
    echo "2. Create preview deployment"
    echo
    read -p "Enter your choice (1-2): " VERCEL_DEPLOY_TYPE

    if [ "$VERCEL_DEPLOY_TYPE" = "1" ]; then
        echo "Deploying to production..."
        vercel --prod
    elif [ "$VERCEL_DEPLOY_TYPE" = "2" ]; then
        echo "Creating preview deployment..."
        vercel
    else
        echo "[ERROR] Invalid option."
        deploy_vercel
        return
    fi

    if [ $? -ne 0 ]; then
        echo "[ERROR] Vercel deployment failed."
        deployment_options
    else
        echo "Vercel deployment completed!"
        exit_script
    fi
}

# Deploy to GitHub Pages
deploy_github_pages() {
    echo
    echo "=== DEPLOYING TO GITHUB PAGES ==="
    echo

    # Check if git is installed
    if ! command -v git &> /dev/null; then
        echo "[ERROR] Git is not installed or not in your PATH."
        echo "Please install Git from https://git-scm.com/"
        deployment_options
        return
    fi

    # Check if this is a git repository
    if [ ! -d ".git" ]; then
        echo "[ERROR] This is not a Git repository."
        echo "You need to initialize a Git repository first:"
        echo "git init"
        echo "git remote add origin YOUR_REPOSITORY_URL"
        deployment_options
        return
    fi

    # Confirm GitHub Pages deployment
    echo
    echo "This will deploy the current build to the gh-pages branch of your repository."
    echo "Make sure you have the necessary permissions to push to this branch."
    echo
    read -p "Do you want to continue? (y/N): " GITHUB_CONTINUE
    if [[ ! "$GITHUB_CONTINUE" =~ ^[Yy]$ ]]; then
        deployment_options
        return
    fi

    # Check if gh-pages package is installed
    if ! pnpm list --depth=0 gh-pages &> /dev/null; then
        echo "Installing gh-pages package..."
        pnpm add -D gh-pages
        if [ $? -ne 0 ]; then
            echo "[ERROR] Failed to install gh-pages package."
            deployment_options
            return
        fi
    fi

    # Add deploy script to package.json if it doesn't exist
    echo "Checking if deploy script exists in package.json..."
    if ! grep -q '"deploy":' package.json; then
        echo "Adding deploy script to package.json..."
        echo "[WARNING] This will modify your package.json file."
        read -p "Do you want to continue? (y/N): " MODIFY_PACKAGE_JSON
        if [[ "$MODIFY_PACKAGE_JSON" =~ ^[Yy]$ ]]; then
            # Use sed to add deploy scripts to package.json
            sed -i.bak 's/"preview": "vite preview"/"preview": "vite preview",\n    "predeploy": "vite build",\n    "deploy": "gh-pages -d dist"/' package.json
            if [ $? -ne 0 ]; then
                echo "[ERROR] Failed to modify package.json."
                echo "Please add the following scripts manually:"
                echo "  \"predeploy\": \"vite build\","
                echo "  \"deploy\": \"gh-pages -d dist\""
                deployment_options
                return
            fi
            # Remove backup file created by sed
            rm -f package.json.bak
        else
            echo "Skipping package.json modification."
            echo "Please add the deploy scripts manually before continuing."
            deployment_options
            return
        fi
    fi

    # Deploy to GitHub Pages
    echo
    echo "Deploying to GitHub Pages..."
    pnpm run deploy

    if [ $? -ne 0 ]; then
        echo "[ERROR] GitHub Pages deployment failed."
        deployment_options
    else
        echo "GitHub Pages deployment completed!"
        exit_script
    fi
}

exit_script() {
    echo
    echo "Thank you for using the MGX AI Digital Companion Platform Deployment Tool."
    echo "Visit DEPLOYMENT.md for more information on deployment options."
    echo
    exit 0
}

# Make the script executable on first run
chmod +x "$0"

# Start the deployment process
deployment_options